import { useCallback, useEffect, useMemo, useState } from "react";
import { Contract, ProviderInterface, TypedContractV2 } from "starknet";
import { ABI as paperAbi } from "../abis/paperAbi";
import { useDojoContext } from "./useDojoContext";

export const useTokenBalance = ({
  address,
  token,
  refetchInterval,
}: {
  address?: string;
  token?: string;
  refetchInterval?: number;
}) => {
  const {
    clients: { dojoProvider },
  } = useDojoContext();
  const [balance, setBalance] = useState(0n);
  const [isInitializing, setIsInitializing] = useState(true);

  const contract = useMemo(() => {
    if (!token || !dojoProvider) return undefined;

    const contract: TypedContractV2<typeof paperAbi> = new Contract(paperAbi, token!, dojoProvider.provider as unknown as ProviderInterface).typedv2(
      paperAbi,
    );
    return contract;
  }, [dojoProvider, token]);

  const refresh = useCallback(async () => {
    if (!contract || !address) return;

    try {
      const bal = await contract.call("balance_of", [address], { blockIdentifier: "latest" });
      //@ts-ignore   returns a bigint
      setBalance(bal);
      setIsInitializing(false);
    } catch (e) {
      console.error("Failed to fetch token balance:", e);
      setBalance(0n);
      setIsInitializing(false);
    }
  }, [contract, address]);

  useEffect(() => {
    if (!contract) return;

    if (refetchInterval) {
      refresh();
      let handle = setInterval(refresh, refetchInterval);

      return () => {
        clearInterval(handle);
      };
    } else {
      refresh();
    }
  }, [address, token, contract, refetchInterval, refresh]);

  return {
    balance,
    isInitializing,
    refresh,
  };
};
