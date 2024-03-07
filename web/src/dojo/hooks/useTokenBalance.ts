import { useCallback, useEffect, useMemo, useState } from "react";
import { Contract, TypedContractV2 } from "starknet";
import { ABI as paperAbi } from "../abis/paperAbi";
import { useDojoContext } from "./useDojoContext";


export const useTokenBalance = ({ address, token, refetchInterval }: { address?: string, token?: string, refetchInterval?: number }) => {
  const { dojoProvider } = useDojoContext();
  const [balance, setBalance] = useState(0n)

  const contract = useMemo(() => {
    if (!token) return undefined
    const contract: TypedContractV2<typeof paperAbi> = new Contract(
      paperAbi,
      token!,
      dojoProvider.provider,
    ).typedv2(paperAbi)
    return contract
  }, [dojoProvider, token])

  const refresh = useCallback(async () => {
    if (!contract || !address) return

    const bal = await contract.balance_of(address);
    //@ts-ignore   returns a bigint
    setBalance(bal)
  }, [contract, address])


  useEffect(() => {
    if (!contract) return

    if (refetchInterval) {
      let handle = setInterval(refresh, refetchInterval);

      return () => {
        clearInterval(handle)
      }
    }
    else {
      refresh()
    }

  }, [address, token, contract, refetchInterval, refresh])


  return {
    balance,
    refresh
  };
};
