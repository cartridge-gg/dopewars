import { StyleProps, HStack, Text } from "@chakra-ui/react";
import { DollarBag } from "../icons";
import { formatCash } from "@/utils/ui";

const CashIndicator = ({ cash, ...props }: { cash: string } & StyleProps) => {
  return (
    <HStack {...props}>
      <DollarBag /> <Text>{cash}</Text>
    </HStack>
  );
};

export default CashIndicator;
