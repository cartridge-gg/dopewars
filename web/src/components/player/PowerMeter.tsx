import { generatePixelBorderPath } from "@/utils/ui";
import { Box, HStack, Text } from "@chakra-ui/react";

interface PowerMeterProps {
  text?: string;
  basePower: number;
  power?: number;
  maxPower: number;
  displayedPower?: number;
}

export const PowerMeter = ({ text, basePower, power, maxPower, displayedPower }: PowerMeterProps) => {
  return (
    <HStack p={2} bg="neon.800" clipPath={`polygon(${generatePixelBorderPath(4, 2)})`} alignItems="center" spacing={3}>
      {text && text !== "" && (
        <Text fontFamily="broken-console" fontSize="10px" color="neon.500" lineHeight="14px" marginBottom={-1} w="30px">
          {text}
        </Text>
      )}
      <HStack spacing={1.5} flexGrow={1}>
        {Array.from({ length: basePower }).map((_, index) => (
          <Box key={index} h={4} w={3} clipPath={`polygon(${generatePixelBorderPath(2, 2)})`} bg="neon.400" />
        ))}
        {power !== undefined &&
          Array.from({ length: power - basePower }).map((_, index) => (
            <Box key={index} h={4} w={3} clipPath={`polygon(${generatePixelBorderPath(2, 2)})`} bg="yellow.400" />
          ))}
        {Array.from({ length: maxPower - (power ? Math.max(basePower, power) : basePower) }).map((_, index) => (
          <Box key={index} h={4} w={3} clipPath={`polygon(${generatePixelBorderPath(2, 2)})`} bg="neon.600" />
        ))}
        {displayedPower !== undefined && displayedPower > maxPower && (
          <Box
            h={4}
            w={`${
              12 * (displayedPower - maxPower) + 6 * Math.min(displayedPower - maxPower, displayedPower - maxPower - 1)
            }px`}
            clipPath={`polygon(${generatePixelBorderPath(2, 2)})`}
            bg="neon.700"
            flexGrow={1}
          />
        )}
      </HStack>
    </HStack>
  );
};
