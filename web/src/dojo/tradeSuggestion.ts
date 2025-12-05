import { GameClass, DrugMarket } from "./class/Game";
import { ConfigStoreClass, DrugConfigFull } from "./stores/config";

export interface TradeSuggestion {
  type: "buy_and_sell" | "sell_only" | "none";
  drug?: DrugConfigFull;
  buyPrice?: number;
  sellPrice?: number;
  quantity?: number;
  profit?: number;
  buyLocation?: string;
  sellLocation?: string;
  // For cases where we need to sell current inventory first
  currentDrug?: DrugConfigFull;
  currentQuantity?: number;
  currentSellPrice?: number;
  currentSellProfit?: number;
  message: string;
}

export function calculateBestTrade(
  game: GameClass,
  currentLocation: string,
  targetLocation: string,
  configStore: ConfigStoreClass
): TradeSuggestion {
  // Can't trade if same location
  if (currentLocation === targetLocation || !currentLocation || !targetLocation) {
    return { type: "none", message: "Select a different destination" };
  }

  const currentMarkets = game.markets.marketsByLocation.get(currentLocation);
  const targetMarkets = game.markets.marketsByLocation.get(targetLocation);

  if (!currentMarkets || !targetMarkets) {
    return { type: "none", message: "No market data available" };
  }

  const playerCash = game.player.cash;
  const transportCapacity = game.items.transport.stat;
  const hasDrugs = game.drugs.quantity > 0 && game.drugs.drug;

  // If player has drugs, calculate the sell + buy opportunity
  if (hasDrugs) {
    const currentDrug = game.drugs.drug!;
    const currentQuantity = game.drugs.quantity;

    // Find sell price at target location for current drug
    const targetDrugMarket = targetMarkets.find((m) => m.drug === currentDrug.drug);
    const currentDrugMarket = currentMarkets.find((m) => m.drug === currentDrug.drug);

    if (!targetDrugMarket || !currentDrugMarket) {
      return { type: "none", message: "No profitable trades available" };
    }

    const sellPrice = targetDrugMarket.price;
    const sellRevenue = sellPrice * currentQuantity;
    const currentValue = currentDrugMarket.price * currentQuantity;
    const sellProfit = sellRevenue - currentValue;

    // After selling, calculate best buy opportunity at current location
    // Cash after selling current inventory (at current location prices for comparison)
    const cashAfterSell = playerCash + currentValue; // We'll have this much cash after selling

    // Find best drug to buy at current location and sell at target
    const bestBuyOpportunity = findBestBuyOpportunity(
      currentMarkets,
      targetMarkets,
      cashAfterSell,
      transportCapacity,
      configStore,
      game
    );

    if (bestBuyOpportunity && bestBuyOpportunity.profit > 0) {
      // Combined: sell current drugs + buy new drugs
      const totalProfit = sellProfit + bestBuyOpportunity.profit;

      return {
        type: "buy_and_sell",
        currentDrug,
        currentQuantity,
        currentSellPrice: sellPrice,
        currentSellProfit: sellProfit,
        drug: bestBuyOpportunity.drug,
        buyPrice: bestBuyOpportunity.buyPrice,
        sellPrice: bestBuyOpportunity.sellPrice,
        quantity: bestBuyOpportunity.quantity,
        profit: bestBuyOpportunity.profit,
        buyLocation: currentLocation,
        sellLocation: targetLocation,
        message: `Sell for $${formatNumber(sellRevenue)}, buy for $${formatNumber(totalProfit)} profit`,
      };
    } else if (sellProfit > 0) {
      // Just sell current inventory
      return {
        type: "sell_only",
        currentDrug,
        currentQuantity,
        currentSellPrice: sellPrice,
        currentSellProfit: sellProfit,
        profit: sellProfit,
        sellLocation: targetLocation,
        message: `Sell in ${targetLocation} for $${formatNumber(sellProfit)} profit`,
      };
    } else {
      return { type: "none", message: "No profitable trades available" };
    }
  }

  // Player has no drugs - find best buy opportunity
  const bestBuyOpportunity = findBestBuyOpportunity(
    currentMarkets,
    targetMarkets,
    playerCash,
    transportCapacity,
    configStore,
    game
  );

  if (bestBuyOpportunity && bestBuyOpportunity.profit > 0) {
    return {
      type: "buy_and_sell",
      drug: bestBuyOpportunity.drug,
      buyPrice: bestBuyOpportunity.buyPrice,
      sellPrice: bestBuyOpportunity.sellPrice,
      quantity: bestBuyOpportunity.quantity,
      profit: bestBuyOpportunity.profit,
      buyLocation: currentLocation,
      sellLocation: targetLocation,
      message: `Buy ($${formatNumber(bestBuyOpportunity.buyPrice)}) and sell in ${targetLocation} for $${formatNumber(bestBuyOpportunity.profit)} profit`,
    };
  }

  return { type: "none", message: "No profitable trades available" };
}

interface BuyOpportunity {
  drug: DrugConfigFull;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  profit: number;
}

function findBestBuyOpportunity(
  currentMarkets: DrugMarket[],
  targetMarkets: DrugMarket[],
  availableCash: number,
  transportCapacity: number,
  configStore: ConfigStoreClass,
  game: GameClass
): BuyOpportunity | null {
  let bestOpportunity: BuyOpportunity | null = null;
  let maxProfit = 0;

  for (const currentDrugMarket of currentMarkets) {
    const targetDrugMarket = targetMarkets.find((m) => m.drug === currentDrugMarket.drug);
    if (!targetDrugMarket) continue;

    const buyPrice = currentDrugMarket.price;
    const sellPrice = targetDrugMarket.price;
    const priceDiff = sellPrice - buyPrice;

    // Skip if not profitable
    if (priceDiff <= 0) continue;

    // Calculate max quantity we can buy
    const maxByPrice = Math.floor(availableCash / buyPrice);
    const maxByWeight = Math.floor(transportCapacity / currentDrugMarket.weight);
    const maxQuantity = Math.min(maxByPrice, maxByWeight);

    if (maxQuantity <= 0) continue;

    const profit = priceDiff * maxQuantity;

    if (profit > maxProfit) {
      maxProfit = profit;
      const drugConfig = configStore.getDrugById(
        game.seasonSettings.drugs_mode,
        currentDrugMarket.drugId
      );
      if (drugConfig) {
        bestOpportunity = {
          drug: drugConfig,
          buyPrice,
          sellPrice,
          quantity: maxQuantity,
          profit,
        };
      }
    }
  }

  return bestOpportunity;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toFixed(0);
}
