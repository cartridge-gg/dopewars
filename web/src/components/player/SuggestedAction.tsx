import { TradeSuggestion } from "@/dojo/tradeSuggestion";
import { Box, Card, HStack, Text, VStack } from "@chakra-ui/react";

interface SuggestedActionProps {
  suggestion: TradeSuggestion;
  onExecute: () => void;
  isDisabled?: boolean;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toFixed(0);
};

export const SuggestedAction = (
  { suggestion, onExecute, isDisabled = false }: SuggestedActionProps) => {
    const isClickable = suggestion.type !== "none" && !isDisabled;

    const renderMessage = () => {
      if (suggestion.type === "none") {
        return <Text color="neon.600">{suggestion.message}</Text>;
      }

      const textStyle = {
        fontSize: ["12px", "14px"],
        color: "neon.200",
        lineHeight: "1.3",
      };

      const iconSize = "20px";

      // buy_and_sell with currentDrug: Sell [icon] for $X, buy [icon] and sell in Location for $Y profit
      if (suggestion.type === "buy_and_sell" && suggestion.currentDrug && suggestion.drug) {
        const sellRevenue = (suggestion.currentSellPrice || 0) * (suggestion.currentQuantity || 0);
        const totalProfit = (suggestion.currentSellProfit || 0) + (suggestion.profit || 0);
        return (
          <HStack gap="6px" align="center" flexWrap="wrap">
            <Text {...textStyle}>Sell</Text>
            <Box flexShrink={0}>{suggestion.currentDrug.icon({ boxSize: iconSize })}</Box>
            <Text {...textStyle}>for ${formatNumber(sellRevenue)}, buy</Text>
            <Box flexShrink={0}>{suggestion.drug.icon({ boxSize: iconSize })}</Box>
            <Text {...textStyle}>and sell in {suggestion.sellLocation} for ${formatNumber(totalProfit)} profit</Text>
          </HStack>
        );
      }

      // sell_only: Sell [icon] in Location for $X profit
      if (suggestion.type === "sell_only" && suggestion.currentDrug) {
        return (
          <HStack gap="6px" align="center" flexWrap="wrap">
            <Text {...textStyle}>Sell</Text>
            <Box flexShrink={0}>{suggestion.currentDrug.icon({ boxSize: iconSize })}</Box>
            <Text {...textStyle}>in {suggestion.sellLocation} for ${formatNumber(suggestion.profit || 0)} profit</Text>
          </HStack>
        );
      }

      // buy_and_sell without currentDrug: Buy [icon] ($X) and sell in Location for $Y profit
      if (suggestion.type === "buy_and_sell" && suggestion.drug) {
        return (
          <HStack gap="6px" align="center" flexWrap="wrap">
            <Text {...textStyle}>Buy</Text>
            <Box flexShrink={0}>{suggestion.drug.icon({ boxSize: iconSize })}</Box>
            <Text {...textStyle}>(${formatNumber(suggestion.buyPrice || 0)}) and sell in {suggestion.sellLocation} for ${formatNumber(suggestion.profit || 0)} profit</Text>
          </HStack>
        );
      }

      // Fallback to plain message
      return <Text {...textStyle}>{suggestion.message}</Text>;
    };

    return (
      <VStack w="full" align="flex-start" gap="4px">
        <Text textStyle="subheading" fontSize={["9px", "11px"]} color="neon.500">
          ACTIONS
        </Text>

        <Card
          w="full"
          px="12px"
          py="10px"
          cursor={isClickable ? "pointer" : "default"}
          opacity={isDisabled ? 0.5 : 1}
          border="1px solid"
          borderColor={isClickable ? "neon.600" : "neon.700"}
          _hover={
            isClickable
              ? {
                  borderColor: "neon.400",
                  bg: "neon.900",
                }
              : {}
          }
          transition="all 0.2s"
          onClick={() => {
            if (isClickable) {
              onExecute();
            }
          }}
        >
          {renderMessage()}
        </Card>
      </VStack>
    );
  };
