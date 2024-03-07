import { PaperIcon } from "@/components/icons/Paper";
import { useTokenBalance } from "@/dojo/hooks/useTokenBalance";
import { formatCash, formatEther } from "@/utils/ui";
import { HStack, Text } from "@chakra-ui/react";

const iconsBySymbol = {
  fPAPER: PaperIcon,
  PAPER: PaperIcon,
};
type iconsBySymbolKeys = keyof typeof iconsBySymbol;

export const TokenBalance = ({ address, token }: { address?: string; token?: string }) => {
  console.log("TokenBalance");
  // infinite loop with sn.js 6
  // const { data: balance } = useBalance({ address, token, /*watch: true, refetchInterval:5_000*/ });
  const { balance } = useTokenBalance({ address, token, refetchInterval:5_000 });

  if (!address || !token || !balance) return null;
  return (
    <HStack>
      {/* {iconsBySymbol[balance?.symbol as iconsBySymbolKeys] && iconsBySymbol[balance?.symbol as iconsBySymbolKeys]({})} */}
      <Text>{formatCash(formatEther(balance)).replace("$","") || 0}</Text>
      {/* <Text>{balance?.symbol || "?"}</Text> */}
      {/* <Text>{token}</Text> */}
    </HStack>
  );
};
