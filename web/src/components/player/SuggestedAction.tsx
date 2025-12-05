import { TradeSuggestion } from "@/dojo/tradeSuggestion";
import { Card, HStack, Text, VStack } from "@chakra-ui/react";
import colors from "@/theme/colors";
import { keyframes } from "@emotion/react";

const pulseAnim = keyframes`
  0% {border-color: ${colors.neon[600]};}
  50% {border-color: ${colors.neon[400]};}
  100% {border-color: ${colors.neon[600]};}
`;

interface SuggestedActionProps {
  suggestion: TradeSuggestion;
  onExecute: () => void;
  isDisabled?: boolean;
}

export const SuggestedAction = (
  { suggestion, onExecute, isDisabled = false }: SuggestedActionProps) => {
    const isClickable = suggestion.type !== "none" && !isDisabled;

    return (
      <VStack w="full" align="flex-start" gap={1}>
        <Text textStyle="subheading" fontSize={["9px", "11px"]} color="neon.500">
          ACTIONS
        </Text>

        <Card
          w="full"
          px="16px"
          py="12px"
          cursor={isClickable ? "pointer" : "default"}
          opacity={isDisabled ? 0.5 : 1}
          border="1px solid"
          borderColor={isClickable ? "neon.600" : "neon.700"}
          animation={isClickable ? `${pulseAnim} 3s ease-in-out infinite` : "none"}
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
          <HStack gap="12px" justify="flex-start" align="center">
            {suggestion.type !== "none" && (suggestion.drug || suggestion.currentDrug) && (
              <>{(suggestion.drug || suggestion.currentDrug)!.icon({ boxSize: "24px" })}</>
            )}
            <Text
              fontSize={["12px", "14px"]}
              color={suggestion.type === "none" ? "neon.600" : "neon.200"}
              lineHeight="1.3"
            >
              {suggestion.message}
            </Text>
          </HStack>
        </Card>
      </VStack>
    );
  };
