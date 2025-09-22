import { Token, TokenBalance, ToriiClient } from "@dojoengine/torii-client";
import { useEffect, useRef, useState } from "react";
import { num } from "starknet";

export interface ParsedToken {
  token_id: bigint;
  contract_address: string;
  name: string;
  symbol: string;
  decimals: number;
  metadata: TokenMetadata;
}

export interface TokenMetadata {
  attributes?: any[];
  name?: string;
  description?: string;
  image?: string;
}

export interface ParsedTokenBalance {
  balance: bigint;
  account_address: string;
  contract_address: string;
  token_id: bigint;
}

export const useDojoTokens = (
  toriiClient: ToriiClient,
  addresses: string[],
  accountAddress?: string,
  tokenIds?: string[],
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState<undefined | ParsedToken[]>();
  const [accountTokens, setAccountTokens] = useState<undefined | ParsedToken[]>();
  const [tokensBalances, setTokensBalances] = useState<undefined | ParsedTokenBalance[]>();

  const timeout = useRef<any>({});

  const refetch = async () => {
    setTokens([]);
    setTokensBalances([]);
    try {
      setIsLoading(true);
      // const tokens = await toriiClient.getTokens(addresses, tokenIds || []);
      const tokens = await toriiClient.getTokens({
        contract_addresses: addresses,
        token_ids: tokenIds || [],
        pagination: {
          cursor: undefined,
          direction: "Backward",
          limit: 1_000,
          order_by: [],
        },
      });

      // const tokensBalances = await toriiClient.getTokenBalances(
      //   addresses,
      //   accountAddress ? [accountAddress] : [],
      //   tokenIds || [],
      // );
      const tokensBalances = await toriiClient.getTokenBalances({
        contract_addresses: addresses,
        account_addresses: accountAddress ? [num.toHex64(accountAddress)] : [],
        token_ids: tokenIds || [],
        pagination: {
          cursor: undefined,
          direction: "Backward",
          limit: 1_000,
          order_by: [],
        },
      });

      const parsedTokens = tokens.items.map((t: Token) => {
        let metadata = {};
        try {
          metadata = JSON.parse(t.metadata);
        } catch (e) {}
        return {
          ...t,
          token_id: BigInt(t.token_id || 0),
          metadata: metadata,
        } as ParsedToken;
      });

      setTokens(parsedTokens);

      const parsedTokensBalances = tokensBalances.items.map((tb: TokenBalance) => {
        return {
          ...tb,
          token_id: BigInt(tb.token_id || 0),
          balance: BigInt(tb.balance),
        };
      });

      setTokensBalances(parsedTokensBalances);

      if (accountAddress) {
        const accountTokens = parsedTokensBalances
          .flatMap((i) => {
            return parsedTokens.filter(
              (t) => t.contract_address === i.contract_address && t.token_id === i.token_id && i.balance > 0,
            );
          })
          .sort((a: ParsedToken, b: ParsedToken) => Number(a.token_id - b.token_id));
        setAccountTokens(accountTokens);
      } else {
        setAccountTokens([]);
      }

      // console.log("parsedTokens", parsedTokens);
      // console.log("parsedTokensBalances", parsedTokensBalances);

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log("useDojoTokens: error");
      console.log(e);
    }
    clearTimeout(timeout.current);
  };

  useEffect(() => {
    if (toriiClient) {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      timeout.current = setTimeout(() => {
        refetch();
      }, 500);
    }
    // array as dep = rip
  }, [toriiClient, addresses, accountAddress, tokenIds]);

  return {
    tokens,
    tokensBalances,
    accountTokens,
    isLoading,
    refetch,
  };
};
