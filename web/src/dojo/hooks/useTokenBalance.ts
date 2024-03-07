import { useCallback, useEffect, useMemo, useState } from "react";
import { Contract } from "starknet";
import { ABI as paperAbi } from "../abis/paperAbi";
import { useDojoContext } from "./useDojoContext";


export const useTokenBalance = ({ address, token, refetchInterval }: { address?: string, token?: string, refetchInterval?: number }) => {
  const { dojoProvider } = useDojoContext();
  const [balance, setBalance] = useState(0)

  const contract = useMemo(() => {
    const contract: TypedContractV2<typeof paperAbi> = new Contract(
      paperAbi,
      token,
      dojoProvider.provider,
    ).typedv2(paperAbi)
    return contract
  }, [dojoProvider, token])

  const refresh = useCallback(async () => {
    const bal = await contract.balance_of(address);
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

  }, [address, token, contract])


  return {
    balance,
    refresh
  };
};
