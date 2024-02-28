import { PaperIcon } from "@/components/icons/Paper";
import { HStack, Text } from "@chakra-ui/react";
import { useBalance } from "@starknet-react/core";

const iconsBySymbol = {
  fPAPER: PaperIcon,
  PAPER: PaperIcon,
};

export const TokenBalance = ({ address, token }: { address: string; token: string }) => {
  const { data: balance } = useBalance({ address, token, watch:true });

  if (!address) return null
  return (
    <HStack>
      {iconsBySymbol[balance?.symbol] && iconsBySymbol[balance?.symbol]()}
      <Text>{balance?.formatted || 0}</Text>
      <Text>{balance?.symbol || "?"}</Text>
      {/* <Text>{token}</Text> */}
    </HStack>
  );
};
