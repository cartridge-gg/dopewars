import { HStack, StyleProps, Text } from "@chakra-ui/react";
import { DollarBag } from "../icons";

export const CashIndicator = ({ cash, ...props }: { cash: string } & StyleProps) => {
  return (
    <HStack {...props}>
      <DollarBag /> <Text>{cash}</Text>
    </HStack>
  );
};

