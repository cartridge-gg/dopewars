import { toast } from "react-hot-toast";
import { useCallback, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { Contract, uint256 } from "starknet";
import { checkTxReceipt, errorMessage } from "../helpers";
import { useToast } from "@/hooks/toast";

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

        let txReceipt = await account.waitForTransaction(execution.transaction_hash, {
          retryInterval: 200,
        });

        checkTxReceipt(txReceipt);
        setIsLoading(false);
        setIsSuccess(true);
        return toast({
          message: `You opened #${id}!`,
        });
      } catch (e: any) {
        // console.log(e);
        setIsLoading(false);
        return toast({
          message: errorMessage(e.message),
          isError: true,
        });
      }
    },
    [account],
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

        let txReceipt = await account.waitForTransaction(execution.transaction_hash, {
          retryInterval: 200,
        });

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
          message: errorMessage(e.message),
          isError: true,
        });
      }
    },
    [account],
  );

  return { onOpen, onRelease, isLoading, isSuccess };
};
