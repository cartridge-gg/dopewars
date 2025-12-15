import { TradeSuggestion } from "@/dojo/tradeSuggestion";
import { Box, Card, HStack, Text, VStack } from "@chakra-ui/react";
import { Button } from "../common";

interface SuggestedActionProps {
  suggestion: TradeSuggestion;
  onExecute: () => void;
  isDisabled?: boolean;
  isMobile?: boolean;
}

const formatNumber = (num: number): string => {
  const absNum = Math.abs(num);
  if (absNum >= 1000000) {
    return (absNum / 1000000).toFixed(1) + "M";
  } else if (absNum >= 1000) {
    return (absNum / 1000).toFixed(1) + "K";
  }
  return absNum.toFixed(0);
};

const formatProfitOrLoss = (amount: number): string => {
  const formatted = formatNumber(amount);
  return amount >= 0 ? `$${formatted} profit` : `$${formatted} loss`;
};

export const SuggestedAction = ({
  suggestion,
  onExecute,
  isDisabled = false,
  isMobile = false,
}: SuggestedActionProps) => {
  // Check if this is a pawn shop action (none type with specific message)
  const isPawnShopAction = suggestion.type === "none" && suggestion.message === "Visit Pawn Shop";
  const isClickable = (suggestion.type !== "none" || isPawnShopAction) && !isDisabled;

  const renderMessage = () => {
    if (suggestion.type === "none") {
      return (
        <Text
          color={isPawnShopAction ? "neon.200" : "neon.600"}
          fontSize={isPawnShopAction ? ["12px", "15px"] : undefined}
        >
          {suggestion.message}
        </Text>
      );
    }

    const textStyle = {
      fontSize: ["12px", "15px"],
      color: "neon.200",
      lineHeight: "1.3",
    };

    const iconSize = "24px";

    // buy_and_sell with currentDrug: Sell [icon], buy [icon] and sell in [Location] for $Y profit/loss
    if (suggestion.type === "buy_and_sell" && suggestion.currentDrug && suggestion.drug) {
      const totalProfit = (suggestion.currentSellProfit || 0) + (suggestion.profit || 0);
      const locationName = suggestion.sellLocationName || "";

      return (
        <HStack gap="6px" align="center" flexWrap="nowrap">
          <Text {...textStyle}>Sell</Text>
          <Box flexShrink={0}>{suggestion.currentDrug.icon({ boxSize: iconSize })}</Box>
          <Text {...textStyle}>, buy</Text>
          <Box flexShrink={0}>{suggestion.drug.icon({ boxSize: iconSize })}</Box>
          <Text {...textStyle}>
            {isMobile
              ? `for ${formatProfitOrLoss(totalProfit)}`
              : `and sell in ${locationName} for ${formatProfitOrLoss(totalProfit)}`}
          </Text>
        </HStack>
      );
    }

    // sell_only: Sell [icon] in [Location] for $X profit/loss
    if (suggestion.type === "sell_only" && suggestion.currentDrug) {
      const locationName = suggestion.sellLocationName || "";

      return (
        <HStack gap="6px" align="center" flexWrap="nowrap">
          <Text {...textStyle}>Sell</Text>
          <Box flexShrink={0}>{suggestion.currentDrug.icon({ boxSize: iconSize })}</Box>
          <Text {...textStyle}>
            {isMobile
              ? `for ${formatProfitOrLoss(suggestion.profit || 0)}`
              : `in ${locationName} for ${formatProfitOrLoss(suggestion.profit || 0)}`}
          </Text>
        </HStack>
      );
    }

    // buy_and_sell without currentDrug: Buy [icon] and sell in [Location] for $Y profit/loss
    if (suggestion.type === "buy_and_sell" && suggestion.drug) {
      const locationName = suggestion.sellLocationName || "";

      return (
        <HStack gap="6px" align="center" flexWrap="nowrap">
          <Text {...textStyle}>Buy</Text>
          <Box flexShrink={0}>{suggestion.drug.icon({ boxSize: iconSize })}</Box>
          <Text {...textStyle}>
            {isMobile
              ? `for ${formatProfitOrLoss(suggestion.profit || 0)}`
              : `and sell in ${locationName} for ${formatProfitOrLoss(suggestion.profit || 0)}`}
          </Text>
        </HStack>
      );
    }

    // Fallback to plain message
    return <Text {...textStyle}>{suggestion.message}</Text>;
  };

  return (
    <Button
      px="10px"
      py="8px"
      w="full"
      isDisabled={isDisabled}
      onClick={() => {
        if (isClickable) {
          onExecute();
        }
      }}
      justifyContent="center"
    >
      {renderMessage()}
    </Button>
  );
};
