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
  configStore: ConfigStoreClass,
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
      game,
    );

    // Check if the best buy opportunity is the same drug we're selling
    // If so, just treat it as sell_only (no point buying the same drug)
    if (bestBuyOpportunity && bestBuyOpportunity.profit > 0 && bestBuyOpportunity.drug.drug === currentDrug.drug) {
      // Same drug - just sell at target
      if (sellProfit > 0) {
        const locationName = configStore.getLocation(targetLocation)?.name || targetLocation;
        return {
          type: "sell_only",
          currentDrug,
          currentQuantity,
          currentSellPrice: sellPrice,
          currentSellProfit: sellProfit,
          profit: sellProfit,
          sellLocation: targetLocation,
          message: `Sell in ${locationName} for profit`,
        };
      }
    }

    // Only do buy_and_sell if:
    // 1. There's a buy opportunity with profit > 0
    // 2. The total profit (sell + buy) is positive
    // 3. The combined action is worth it
    // 4. It's a different drug than what we're selling
    if (bestBuyOpportunity && bestBuyOpportunity.profit > 0) {
      const totalProfit = sellProfit + bestBuyOpportunity.profit;

      // Only return buy_and_sell if the total is profitable
      if (totalProfit > 0) {
        const sellLocationName = configStore.getLocation(targetLocation)?.name || targetLocation;
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
          message: `Sell and buy then sell in ${sellLocationName} for profit`,
        };
      }
    }

    // If we get here, either there's no buy opportunity or the combined action isn't worth it
    if (sellProfit > 0) {
      // Just sell current inventory
      const locationName = configStore.getLocation(targetLocation)?.name || targetLocation;
      return {
        type: "sell_only",
        currentDrug,
        currentQuantity,
        currentSellPrice: sellPrice,
        currentSellProfit: sellProfit,
        profit: sellProfit,
        sellLocation: targetLocation,
        message: `Sell in ${locationName} for profit`,
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
    game,
  );

  if (bestBuyOpportunity && bestBuyOpportunity.profit > 0) {
    const sellLocationName = configStore.getLocation(targetLocation)?.name || targetLocation;
    return {
      type: "buy_and_sell",
      drug: bestBuyOpportunity.drug,
      buyPrice: bestBuyOpportunity.buyPrice,
      sellPrice: bestBuyOpportunity.sellPrice,
      quantity: bestBuyOpportunity.quantity,
      profit: bestBuyOpportunity.profit,
      buyLocation: currentLocation,
      sellLocation: targetLocation,
      message: `Buy and sell in ${sellLocationName} for profit`,
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
  game: GameClass,
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
      const drugConfig = configStore.getDrugById(game.seasonSettings.drugs_mode, currentDrugMarket.drugId);
      if (drugConfig) {
        maxProfit = profit;
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

export interface GlobalTradeSuggestion extends TradeSuggestion {
  optimalDestination: string;
  optimalOrigin?: string;
}

export function calculateGlobalBestTrade(
  game: GameClass,
  currentLocation: string,
  configStore: ConfigStoreClass,
): GlobalTradeSuggestion {
  const locations = configStore.config?.location || [];

  let bestSuggestion: TradeSuggestion = { type: "none", message: "No profitable trades available" };
  let bestProfit = -Infinity;
  let optimalDestination = "";

  for (const location of locations) {
    // Skip current location
    if (location.location === currentLocation) continue;

    const suggestion = calculateBestTrade(game, currentLocation, location.location, configStore);

    // Calculate total profit for this suggestion
    let totalProfit = 0;
    if (suggestion.type === "buy_and_sell") {
      totalProfit = (suggestion.currentSellProfit || 0) + (suggestion.profit || 0);
    } else if (suggestion.type === "sell_only") {
      totalProfit = suggestion.profit || 0;
    }

    if (totalProfit > bestProfit) {
      bestProfit = totalProfit;
      bestSuggestion = suggestion;
      optimalDestination = location.location;
    }

    // If no optimal destination has been set yet, set it to the first valid location
    if (!optimalDestination) {
      optimalDestination = location.location;
    }
  }

  return {
    ...bestSuggestion,
    optimalDestination,
  };
}

export function calculateAbsoluteBestTrade(game: GameClass, configStore: ConfigStoreClass): GlobalTradeSuggestion {
  const locations = configStore.config?.location || [];

  let bestSuggestion: TradeSuggestion = { type: "none", message: "No profitable trades available" };
  let bestProfit = -Infinity;
  let optimalOrigin = "";
  let optimalDestination = "";

  // Compare all possible location pairs
  for (const origin of locations) {
    for (const destination of locations) {
      // Skip same location pairs
      if (origin.location === destination.location) continue;

      const suggestion = calculateBestTrade(game, origin.location, destination.location, configStore);

      // Calculate total profit for this suggestion
      let totalProfit = 0;
      if (suggestion.type === "buy_and_sell") {
        totalProfit = (suggestion.currentSellProfit || 0) + (suggestion.profit || 0);
      } else if (suggestion.type === "sell_only") {
        totalProfit = suggestion.profit || 0;
      }

      if (totalProfit > bestProfit) {
        bestProfit = totalProfit;
        bestSuggestion = suggestion;
        optimalOrigin = origin.location;
        optimalDestination = destination.location;
      }

      // If no optimal pair has been set yet, set it to the first valid pair
      if (!optimalOrigin && !optimalDestination) {
        optimalOrigin = origin.location;
        optimalDestination = destination.location;
      }
    }
  }

  return {
    ...bestSuggestion,
    optimalOrigin,
    optimalDestination,
  };
}
