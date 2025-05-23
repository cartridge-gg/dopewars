import { Flex, Grid } from "@chakra-ui/react";
import { ParsedToken, ParsedTokenBalance } from "@dope/dope-sdk/hooks";

export default function CollectionGrid({
  tokens,
  tokensBalances,
  ItemComponent,
}: {
  tokens?: ParsedToken[];
  tokensBalances?: ParsedTokenBalance[];
  ItemComponent: React.ComponentType<{
    token: ParsedToken;
    balance?: number;
  }>;
}) {
  if (!tokens || tokens.length === 0) {
    return <div className="container m-auto">No items yet!</div>;
  }
  return (
    <Grid w="full" templateColumns={["repeat(2, 1fr)", "repeat(4, 1fr)"]} gap={3}>
      {tokens?.map((t: ParsedToken) => {
        const balance = Number(
          tokensBalances?.find((tb) => tb.contract_address === t.contract_address && tb.token_id === t.token_id)
            ?.balance || 0n,
        );
        return <ItemComponent token={t} balance={balance} key={t.token_id} />;
      })}
    </Grid>
  );
}
