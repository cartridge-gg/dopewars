import { HStack, StyleProps, Text } from "@chakra-ui/react";
import { cardPixelatedStyle } from "@/theme/styles";

const tierNames = ["", "LATE", "MID", "EARLY"];

export const TierIndicator = ({ tier, ...props }: { tier: number } & StyleProps) => {
  const tierName = tierNames[tier];
  return (
    <HStack
      {...cardPixelatedStyle({ pixelSize: 4, radius: 2 })}
      w="56px"
      py="2px"
      justifyContent={"center"}
      visibility={tierName ? "visible" : "hidden"}
      {...props}
    >
      <Text fontSize={["12px", "14px"]}>{tierName}</Text>
    </HStack>
  );
};
