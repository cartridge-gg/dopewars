// started from https://github.com/Provable-Games/death-mountain/blob/main/client/src/api/ekubo.ts

import { waitForTransaction } from "@/dojo/hooks";
import { useAccount } from "@starknet-react/core";
import { useCallback, useEffect, useState } from "react";
import { num, uint256 } from "starknet";
import { formatUnits, parseUnits } from "viem";

export const EKUBO_ROUTER_3_0_13 = "0x0199741822c2dc722f6f605204f35e56dbc23bceed54818168c4c49e4fb8737e";
export const EKUBO_ROUTER_3_0_3 = "0x04505a9f06f2bd639b6601f37a4dc0908bb70e8e0e0c34b1220827d64f4fc066";

export const STRK: TokenInfos = {
  address: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  decimals: 18,
};
export const USDC: TokenInfos = {
  address: "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
  decimals: 6,
};
export const ETH: TokenInfos = {
  address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  decimals: 18,
};
export const PAPER: TokenInfos = {
  address: "0x0410466536b5ae074f7fea81e5533b8134a9fa08b3dd077dd9db08f64997d113",
  decimals: 18,
};

export interface TokenInfos {
  address: string;
  decimals: number;
}

export interface SwapQuote {
  isExactOutput: boolean;
  tokenIn: TokenInfos;
  tokenOut: TokenInfos;
  amountIn: number;
  amountOut: number;
  scaledAmountOut: bigint;
  scaledAmountIn: bigint;
  impact: number;
  splits: SwapSplit[];
}

interface SwapSplit {
  amount_specified: string;
  route: RouteNode[];
}

interface RouteNode {
  pool_key: {
    token0: string;
    token1: string;
    fee: string;
    tick_spacing: string;
    extension: string;
  };
  sqrt_ratio_limit: string;
  skip_ahead: string;
}

interface SwapCall {
  contractAddress: string;
  entrypoint: string;
  calldata: string[];
}

export const useEkubo = ({
  amount,
  isExactOutput,
  tokenIn,
  tokenOut,
  slippage = 10n, // 1%
}: {
  amount: number;
  isExactOutput: boolean;
  tokenIn: TokenInfos;
  tokenOut: TokenInfos;
  slippage?: bigint;
}) => {
  const { account } = useAccount();
  const [quote, setQuote] = useState<SwapQuote | undefined>();
  const [value, setValue] = useState<string>("");
  const [swapCalls, setSwapCalls] = useState<SwapCall[] | undefined>();

  const refetch = useCallback(() => {
    getSwapQuote(amount, tokenIn, tokenOut, isExactOutput)
      .then((quote) => {
        setQuote(quote);

        const value = isExactOutput ? quote.amountIn : quote.amountOut;
        setValue(`${value}`);

        const calls = generateSwapCalls(EKUBO_ROUTER_3_0_3, quote, slippage);
        setSwapCalls(calls);

        // console.log(isExactOutput, quote);
        // console.log(calls);
      })
      .catch((e) => {
        console.log("error: ", e);
        setTimeout(refetch, 5_000);
        setSwapCalls([]);
      });
  }, [amount, tokenIn, tokenOut, isExactOutput]);

  const ape = useCallback(async () => {
    await refetch();

    if (!swapCalls || !account) return;

    const tx = await account?.execute(swapCalls);
    const receipt = await waitForTransaction(account, tx?.transaction_hash);
    console.log(receipt);
  }, [swapCalls, account]);

  useEffect(() => {
    refetch();
  }, [amount, tokenOut, tokenIn, refetch]);

  // useInterval(() => {
  //   refetch();
  // }, 20_000);

  return { quote, value, swapCalls, ape, refetch };
};

export const getSwapQuote = async (
  amount: number,
  tokenIn: TokenInfos,
  tokenOut: TokenInfos,
  isExactOutput: boolean,
): Promise<SwapQuote> => {
  // exact USDC -> PAPER   /+exactUSDC/USDC/PAPER  *
  // USDC -> exact PAPER   /-exactPAPER/PAPER/USDC *
  // exact PAPER -> USDC   /+exactPAPER/PAPER/USDC
  // PAPER -> exact USDC   /-exactUSDC/USDC/PAPER

  const scaledAmount = isExactOutput
    ? -parseUnits(amount.toString(), tokenOut.decimals)
    : parseUnits(amount.toString(), tokenIn.decimals);

  const exactToken = isExactOutput ? tokenOut : tokenIn;
  const otherToken = isExactOutput ? tokenIn : tokenOut;

  const response = await fetch(
    `https://prod-api-quoter.ekubo.org/23448594291968334/${scaledAmount}/${exactToken.address}/${otherToken.address}`,
  );

  const data = await response.json();

  const amountIn = isExactOutput
    ? Number(formatUnits(data?.total_calculated?.toString() ?? "0", tokenIn.decimals)) || 0
    : amount;
  const amountOut = isExactOutput
    ? amount
    : Number(formatUnits(data?.total_calculated?.toString() ?? "0", tokenOut.decimals)) || 0;
  const scaledAmountIn = parseUnits(amountIn.toString(), tokenIn.decimals);
  const scaledAmountOut = parseUnits(amountOut.toString(), tokenOut.decimals);

  return {
    isExactOutput,
    tokenIn,
    tokenOut,
    amountIn,
    amountOut,
    scaledAmountIn,
    scaledAmountOut,
    impact: data?.price_impact || 0,
    splits: data?.splits || [],
  };
};

export const generateSwapCalls = (routerAddress: string, swapQuote: SwapQuote, slippage: bigint): SwapCall[] => {
  const { tokenIn, tokenOut, splits, isExactOutput } = swapQuote;

  const token = isExactOutput ? tokenOut : tokenIn;
  let minimumAmountIn = isExactOutput
    ? (swapQuote.scaledAmountIn * (1000n + slippage)) / 100n // exact output
    : swapQuote.scaledAmountIn; // exact input
  minimumAmountIn = minimumAmountIn < 0n ? -minimumAmountIn : minimumAmountIn;

  const amountInU256 = uint256.bnToUint256(minimumAmountIn);
  const transferCall: SwapCall = {
    contractAddress: tokenIn.address,
    entrypoint: "transfer",
    calldata: [routerAddress, num.toHex(amountInU256.low), num.toHex(amountInU256.high)],
  };

  const clearCall: SwapCall = {
    contractAddress: routerAddress,
    entrypoint: "clear",
    calldata: [tokenIn.address],
  };

  if (splits.length === 0) {
    return [];
    // return [transferCall, clearCall];
  }

  let clearAmountOut = isExactOutput
    ? swapQuote.scaledAmountOut // exact output
    : (swapQuote.scaledAmountOut * (1000n - slippage)) / 1000n; // exact input

  clearAmountOut = clearAmountOut < 0n ? -clearAmountOut : clearAmountOut;
  const clearAmountOutU256 = uint256.bnToUint256(clearAmountOut);

  const clearProfitsCall: SwapCall = {
    contractAddress: routerAddress,
    entrypoint: "clear_minimum",
    calldata: [tokenOut.address, num.toHex(clearAmountOutU256.low), num.toHex(clearAmountOutU256.high)],
  };

  let swapCalls: SwapCall[];

  if (splits.length === 1) {
    const split = splits[0];

    swapCalls = [
      {
        contractAddress: routerAddress,
        entrypoint: "multihop_swap",
        calldata: [
          num.toHex(split.route.length),
          ...split.route.reduce(
            (memo: { token: string; encoded: string[] }, routeNode: RouteNode) => {
              const isToken1 = BigInt(memo.token) === BigInt(routeNode.pool_key.token1);

              return {
                token: isToken1 ? routeNode.pool_key.token0 : routeNode.pool_key.token1,
                encoded: memo.encoded.concat([
                  routeNode.pool_key.token0,
                  routeNode.pool_key.token1,
                  routeNode.pool_key.fee,
                  num.toHex(routeNode.pool_key.tick_spacing),
                  routeNode.pool_key.extension,
                  num.toHex(BigInt(routeNode.sqrt_ratio_limit) % 2n ** 128n),
                  num.toHex(BigInt(routeNode.sqrt_ratio_limit) >> 128n),
                  routeNode.skip_ahead,
                ]),
              };
            },
            {
              token: token.address,
              encoded: [],
            },
          ).encoded,
          token.address,
          num.toHex(
            BigInt(split.amount_specified) < 0n ? -BigInt(split.amount_specified) : BigInt(split.amount_specified),
          ),
          isExactOutput ? "0x1" : "0x0", // amount sign
        ],
      },
      clearProfitsCall,
    ];
  } else {
    swapCalls = [
      {
        contractAddress: routerAddress,
        entrypoint: "multi_multihop_swap",
        calldata: [
          num.toHex(splits.length),
          ...splits.reduce((memo: string[], split: SwapSplit) => {
            return memo.concat([
              num.toHex(split.route.length),
              ...split.route.reduce(
                (memo: { token: string; encoded: string[] }, routeNode: RouteNode) => {
                  const isToken1 = BigInt(memo.token) === BigInt(routeNode.pool_key.token1);

                  return {
                    token: isToken1 ? routeNode.pool_key.token0 : routeNode.pool_key.token1,
                    encoded: memo.encoded.concat([
                      routeNode.pool_key.token0,
                      routeNode.pool_key.token1,
                      routeNode.pool_key.fee,
                      num.toHex(routeNode.pool_key.tick_spacing),
                      routeNode.pool_key.extension,
                      num.toHex(BigInt(routeNode.sqrt_ratio_limit) % 2n ** 128n),
                      num.toHex(BigInt(routeNode.sqrt_ratio_limit) >> 128n),
                      routeNode.skip_ahead,
                    ]),
                  };
                },
                {
                  token: token.address,
                  encoded: [],
                },
              ).encoded,
              token.address,
              num.toHex(
                BigInt(split.amount_specified) < 0n ? -BigInt(split.amount_specified) : BigInt(split.amount_specified),
              ),
              isExactOutput ? "0x1" : "0x0", // amount sign
            ]);
          }, []),
        ],
      },
      clearProfitsCall,
    ];
  }

  return [transferCall, ...swapCalls, clearCall];
};

export const getPriceChart = async (token: string, otherToken: string) => {
  const response = await fetch(
    `https://starknet-mainnet-api.ekubo.org/price/${token}/${otherToken}/history?interval=7000`,
  );

  const data = await response.json();

  return {
    data: data?.data || [],
  };
};
