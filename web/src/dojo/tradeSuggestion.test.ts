import { describe, it, expect, beforeEach } from "vitest";
import { calculateBestTrade, TradeSuggestion } from "./tradeSuggestion";
import { GameClass, DrugMarket } from "./class/Game";
import { ConfigStoreClass, DrugConfigFull } from "./stores/config";

// Mock drug configurations
const mockDrugConfigs: Record<string, DrugConfigFull> = {
  Ludes: {
    drug: "Ludes",
    drug_id: 1,
    icon: () => null,
    name: "Ludes",
  } as DrugConfigFull,
  Speed: {
    drug: "Speed",
    drug_id: 2,
    icon: () => null,
    name: "Speed",
  } as DrugConfigFull,
  Weed: {
    drug: "Weed",
    drug_id: 3,
    icon: () => null,
    name: "Weed",
  } as DrugConfigFull,
};

// Mock ConfigStore
const createMockConfigStore = (): Partial<ConfigStoreClass> => ({
  getDrugById: (mode: string, drugId: number) => {
    const drug = Object.values(mockDrugConfigs).find((d) => d.drug_id === drugId);
    return drug!;
  },
  getLocation: (location: string) =>
    ({
      name: location,
      location,
      location_id: 1,
      icon: () => null,
    } as any),
});

// Helper to create mock markets
const createMarket = (drug: string, drugId: number, price: number, weight: number = 10): DrugMarket => ({
  drug,
  drugId,
  price,
  weight,
});

// Helper to create mock game
const createMockGame = (
  cash: number,
  transport: number,
  currentDrug?: string,
  currentQuantity?: number,
  currentMarkets?: DrugMarket[],
  targetMarkets?: DrugMarket[],
): Partial<GameClass> => ({
  player: {
    cash,
  } as any,
  items: {
    transport: {
      stat: transport,
    },
  } as any,
  drugs: {
    drug: currentDrug ? mockDrugConfigs[currentDrug] : null,
    quantity: currentQuantity || 0,
  } as any,
  markets: {
    marketsByLocation: new Map([
      ["CurrentLocation", currentMarkets || []],
      ["TargetLocation", targetMarkets || []],
    ]),
  } as any,
  seasonSettings: {
    drugs_mode: "1",
  } as any,
});

describe("calculateBestTrade - Table-Based Tests", () => {
  interface TestCase {
    name: string;
    // Player state
    cash: number;
    transport: number;
    currentDrug?: string;
    currentQuantity?: number;
    // Market prices
    currentMarkets: Array<{ drug: string; drugId: number; price: number; weight?: number }>;
    targetMarkets: Array<{ drug: string; drugId: number; price: number; weight?: number }>;
    // Expected result
    expectedType: "buy_and_sell" | "sell_only" | "none";
    expectedDrug?: string;
    expectedCurrentDrug?: string;
    expectedProfit?: number;
    expectedMessage?: string;
  }

  const testCases: TestCase[] = [
    {
      name: "Empty inventory, profitable buy opportunity",
      cash: 10000,
      transport: 100,
      currentDrug: undefined,
      currentQuantity: 0,
      currentMarkets: [
        { drug: "Ludes", drugId: 1, price: 100, weight: 10 },
        { drug: "Speed", drugId: 2, price: 200, weight: 10 },
      ],
      targetMarkets: [
        { drug: "Ludes", drugId: 1, price: 300, weight: 10 },
        { drug: "Speed", drugId: 2, price: 250, weight: 10 },
      ],
      expectedType: "buy_and_sell",
      expectedDrug: "Ludes", // 200 profit per unit, can buy 10 units = 2000 profit
      expectedProfit: 2000,
    },
    {
      name: "Has drugs, better to sell and buy different drug",
      cash: 5000,
      transport: 100,
      currentDrug: "Speed",
      currentQuantity: 5,
      currentMarkets: [
        { drug: "Ludes", drugId: 1, price: 100, weight: 10 },
        { drug: "Speed", drugId: 2, price: 200, weight: 10 },
      ],
      targetMarkets: [
        { drug: "Ludes", drugId: 1, price: 500, weight: 10 },
        { drug: "Speed", drugId: 2, price: 250, weight: 10 },
      ],
      expectedType: "buy_and_sell",
      expectedDrug: "Ludes",
      expectedCurrentDrug: "Speed",
    },
    {
      name: "Has drugs, only sell is profitable (sell_only)",
      cash: 1000,
      transport: 100,
      currentDrug: "Ludes",
      currentQuantity: 10,
      currentMarkets: [
        { drug: "Ludes", drugId: 1, price: 100, weight: 10 },
        { drug: "Speed", drugId: 2, price: 500, weight: 10 },
      ],
      targetMarkets: [
        { drug: "Ludes", drugId: 1, price: 300, weight: 10 }, // Sell for profit
        { drug: "Speed", drugId: 2, price: 400, weight: 10 }, // Can't afford to buy
      ],
      expectedType: "sell_only",
      expectedCurrentDrug: "Ludes",
      expectedProfit: 2000, // (300 - 100) * 10
    },
    {
      name: "No profitable trades available",
      cash: 10000,
      transport: 100,
      currentDrug: undefined,
      currentQuantity: 0,
      currentMarkets: [
        { drug: "Ludes", drugId: 1, price: 300, weight: 10 },
        { drug: "Speed", drugId: 2, price: 500, weight: 10 },
      ],
      targetMarkets: [
        { drug: "Ludes", drugId: 1, price: 200, weight: 10 }, // Loss
        { drug: "Speed", drugId: 2, price: 400, weight: 10 }, // Loss
      ],
      expectedType: "none",
    },
    {
      name: "Limited by transport capacity",
      cash: 100000,
      transport: 50, // Can only carry 5 units of weight-10 drugs
      currentDrug: undefined,
      currentQuantity: 0,
      currentMarkets: [{ drug: "Ludes", drugId: 1, price: 100, weight: 10 }],
      targetMarkets: [{ drug: "Ludes", drugId: 1, price: 300, weight: 10 }],
      expectedType: "buy_and_sell",
      expectedDrug: "Ludes",
      expectedProfit: 1000, // (300 - 100) * 5 units
    },
    {
      name: "Limited by cash",
      cash: 500, // Can only buy 5 units at 100 each
      transport: 1000,
      currentDrug: undefined,
      currentQuantity: 0,
      currentMarkets: [{ drug: "Ludes", drugId: 1, price: 100, weight: 10 }],
      targetMarkets: [{ drug: "Ludes", drugId: 1, price: 300, weight: 10 }],
      expectedType: "buy_and_sell",
      expectedDrug: "Ludes",
      expectedProfit: 1000, // (300 - 100) * 5 units
    },
    {
      name: "Has drugs with negative sell profit but profitable buy",
      cash: 5000,
      transport: 100,
      currentDrug: "Ludes",
      currentQuantity: 10,
      currentMarkets: [
        { drug: "Ludes", drugId: 1, price: 300, weight: 10 },
        { drug: "Speed", drugId: 2, price: 100, weight: 10 },
      ],
      targetMarkets: [
        { drug: "Ludes", drugId: 1, price: 200, weight: 10 }, // Loss to sell (-1000)
        { drug: "Speed", drugId: 2, price: 500, weight: 10 }, // Can buy after selling (+4000)
      ],
      expectedType: "buy_and_sell", // Sell Ludes, buy Speed for net profit
      expectedDrug: "Speed",
      expectedCurrentDrug: "Ludes",
      expectedProfit: 3000, // -1000 (Ludes loss) + 4000 (Speed profit)
    },
    {
      name: "Same drug at current and target with profit",
      cash: 10000,
      transport: 100,
      currentDrug: "Ludes",
      currentQuantity: 5,
      currentMarkets: [{ drug: "Ludes", drugId: 1, price: 100, weight: 10 }],
      targetMarkets: [{ drug: "Ludes", drugId: 1, price: 300, weight: 10 }],
      expectedType: "sell_only",
      expectedCurrentDrug: "Ludes",
      expectedProfit: 1000, // (300 - 100) * 5
      expectedMessage: "Sell in TargetLocation for profit",
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.name, () => {
      const mockConfigStore = createMockConfigStore() as ConfigStoreClass;

      const currentMarkets = testCase.currentMarkets.map((m) => createMarket(m.drug, m.drugId, m.price, m.weight));
      const targetMarkets = testCase.targetMarkets.map((m) => createMarket(m.drug, m.drugId, m.price, m.weight));

      const mockGame = createMockGame(
        testCase.cash,
        testCase.transport,
        testCase.currentDrug,
        testCase.currentQuantity,
        currentMarkets,
        targetMarkets,
      ) as GameClass;

      const result = calculateBestTrade(mockGame, "CurrentLocation", "TargetLocation", mockConfigStore);

      // Assert type
      expect(result.type).toBe(testCase.expectedType);

      // Assert drug if applicable
      if (testCase.expectedDrug) {
        expect(result.drug?.drug).toBe(testCase.expectedDrug);
      }

      // Assert current drug if applicable
      if (testCase.expectedCurrentDrug) {
        expect(result.currentDrug?.drug).toBe(testCase.expectedCurrentDrug);
      }

      // Assert profit if specified
      if (testCase.expectedProfit !== undefined) {
        const actualProfit =
          result.type === "buy_and_sell" ? (result.currentSellProfit || 0) + (result.profit || 0) : result.profit || 0;
        expect(actualProfit).toBe(testCase.expectedProfit);
      }

      // Assert message if specified
      if (testCase.expectedMessage) {
        expect(result.message).toBe(testCase.expectedMessage);
      }

      // Assert sellLocationName is set for buy_and_sell and sell_only types
      if (result.type === "buy_and_sell" || result.type === "sell_only") {
        expect(result.sellLocationName).toBeDefined();
        expect(result.sellLocationName).toBe("TargetLocation");
      }
    });
  });

  it("Same location returns none", () => {
    const mockConfigStore = createMockConfigStore() as ConfigStoreClass;
    const mockGame = createMockGame(10000, 100, undefined, 0, [], []) as GameClass;

    const result = calculateBestTrade(mockGame, "Queens", "Queens", mockConfigStore);

    expect(result.type).toBe("none");
    expect(result.message).toBe("Select a different destination");
  });
});
