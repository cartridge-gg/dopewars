import { TradeDirection } from "@/hooks/state";
import { SCALING_FACTOR } from "@/hooks/dojo";
import { Market } from "@/generated/graphql";

export const calculateSlippage = (
  market: Market,
  tradeAmount: number,
  tradeDirection: TradeDirection,
) => {
  const k = market.cash * market.quantity;
  const currentPrice = market.cash / market.quantity;

  const newQuantity =
    tradeDirection === TradeDirection.Buy
      ? market.quantity - tradeAmount
      : market.quantity + tradeAmount;
  const newCash = k / newQuantity;
  const newPrice = newCash / newQuantity;

  const priceImpact = Math.abs((newPrice - currentPrice) / currentPrice);
  return { priceImpact, newPrice: newPrice / SCALING_FACTOR };
};

export const calculateMaxQuantity = (market: Market, maxCash: number) => {
  const k = market.cash * market.quantity;
  const maxQuantity =
    market.quantity - k / (Number(market.cash) + maxCash * SCALING_FACTOR);

  return Math.floor(maxQuantity);
};
