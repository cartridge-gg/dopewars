import { HStack, StyleProps, Text } from "@chakra-ui/react";
import { PaperCashIcon } from "../icons";

export const CashIndicator = ({ cash, ...props }: { cash: string } & StyleProps) => {
  return (
    <HStack {...props}>
      <PaperCashIcon /> <Text>{cash}</Text>
    </HStack>
  );
};
