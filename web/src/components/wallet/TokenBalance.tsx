import { PaperIcon } from "@/components/icons/Paper";
import { HStack, Text } from "@chakra-ui/react";
import { useBalance } from "@starknet-react/core";

const iconsBySymbol = {
  fPAPER: PaperIcon,
  PAPER: PaperIcon,
};
type iconsBySymbolKeys = keyof typeof iconsBySymbol;

export const TokenBalance = ({ address, token }: { address?: string; token?: string }) => {
  const { data: balance } = useBalance({ address, token, watch: true });

  if (!address || !token || !balance) return null;
  return (
    <HStack>
      {iconsBySymbol[balance?.symbol as iconsBySymbolKeys] && iconsBySymbol[balance?.symbol as iconsBySymbolKeys]({})}
      <Text>{balance?.formatted || 0}</Text>
      <Text>{balance?.symbol || "?"}</Text>
      {/* <Text>{token}</Text> */}
    </HStack>
  );
};
