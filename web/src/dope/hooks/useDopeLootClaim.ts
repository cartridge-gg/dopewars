import { toast } from "react-hot-toast";
import { useCallback, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { Contract, uint256 } from "starknet";
import { checkTxReceipt } from "../helpers";
import { useToast } from "@/hooks/toast";
import { tryBetterErrorMsg, waitForTransaction } from "@/dojo/hooks";

export const useDopeLootClaim = ({ getDojoContract }: { getDojoContract: (tag: string) => Contract }) => {
  const { account } = useAccount();

  const dopeLootClaimContract = getDojoContract("dope-DopeLootClaim");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { toast } = useToast();

  const onOpen = useCallback(
    async (id: number) => {
      if (!account) {
        return (
          toast &&
          toast({
            message: "Please connect your wallet",
            isError: true,
          })
        );
      }
      setIsLoading(true);

      const id_u256 = uint256.bnToUint256(id);

      try {
        const execution = await account?.execute([
          {
            contractAddress: dopeLootClaimContract.address,
            entrypoint: "open",
            calldata: [0x1, id_u256.low, id_u256.high],
          },
        ]);

        const txReceipt = await waitForTransaction(account!, execution.transaction_hash);

        checkTxReceipt(txReceipt);
        setIsLoading(false);
        setIsSuccess(true);
        return toast({
          message: `You opened #${id}!`,
        });
      } catch (e: any) {
        console.log(e);
        setIsLoading(false);
        return toast({
          message: tryBetterErrorMsg(e.message),
          isError: true,
        });
      }
    },
    [account, dopeLootClaimContract.address, toast],
  );

  const onRelease = useCallback(
    async (id: number, dwGameId: number) => {
      if (!account) {
        return (
          toast &&
          toast({
            message: "Please connect your wallet",
            isError: true,
          })
        );
      }
      setIsLoading(true);

      const id_u256 = uint256.bnToUint256(id);

      try {
        const execution = await account?.execute([
          {
            contractAddress: dopeLootClaimContract.address,
            entrypoint: "release",
            calldata: [id_u256.low, id_u256.high, dwGameId],
          },
        ]);

        const txReceipt = await waitForTransaction(account!, execution.transaction_hash);

        checkTxReceipt(txReceipt);
        setIsLoading(false);
        // setIsSuccess(true);
        return toast({
          message: `You released #${id}!`,
        });
      } catch (e: any) {
        // console.log(e);
        setIsLoading(false);
        return toast({
          message: tryBetterErrorMsg(e.message),
          isError: true,
        });
      }
    },
    [account, dopeLootClaimContract.address, toast],
  );

  return { onOpen, onRelease, isLoading, isSuccess };
};
