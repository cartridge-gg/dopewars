import { HStack, Text } from "@chakra-ui/react";
import { DollarBag } from "../icons";
import { formatCash } from "@/utils/ui";

 const CashIndicator = ({ cash, ...props }: { cash: number }) => {
  return (
    <HStack {...props} >
      <DollarBag /> <Text>{formatCash(cash)}</Text>
    </HStack>
  );
};

export default CashIndicator;
