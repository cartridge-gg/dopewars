import { PaperIcon } from "@/components/icons/Paper";
import { useTokenBalance } from "@/dojo/hooks/useTokenBalance";
import { formatCash, formatEther } from "@/utils/ui";
import { HStack, Skeleton, Text } from "@chakra-ui/react";

const iconsBySymbol = {
  fPAPER: PaperIcon,
  PAPER: PaperIcon,
};
type iconsBySymbolKeys = keyof typeof iconsBySymbol;

export const TokenBalance = ({ address, token }: { address?: string; token?: string }) => {
  // infinite loop with sn.js 6
  // const { data: balance } = useBalance({ address, token, /*watch: true, refetchInterval:5_000*/ });
  const { balance, isInitializing } = useTokenBalance({ address, token, refetchInterval: 5_000 });

  if (!address || !token ) return null;
  return (
    <HStack>
      {isInitializing ? (
        <Skeleton startColor='neon.800' endColor='neon.700' height='20px' w="80px" />
      ) : (
        <Text>{formatCash(formatEther(balance)).replace("$", "") || 0}</Text>
      )}
      {/* {iconsBySymbol[balance?.symbol as iconsBySymbolKeys] && iconsBySymbol[balance?.symbol as iconsBySymbolKeys]({})} */}
      {/* <Text>{balance?.symbol || "?"}</Text> */}
      {/* <Text>{token}</Text> */}
    </HStack>
  );
};
