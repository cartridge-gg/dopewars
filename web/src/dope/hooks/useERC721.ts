import { useCallback, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { Contract, uint256 } from "starknet";
import { checkTxReceipt, errorMessage } from "../helpers";

export const useERC721 = ({
  toast,
  getDojoContract,
  contractTag,
}: {
  toast: any;
  getDojoContract: (tag: string) => Contract;
  contractTag: string

}) => {

  const contract = getDojoContract(contractTag);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { account } = useAccount();

  const transfer = useCallback(
    async (id: number, recipient: string) => {
      if (!account) {
        return (
          toast &&
          toast({
            title: "Not connected",
            description: "Please connect your wallet",
            variant: "destructive",
          })
        );
      }
      setIsLoading(true);

      const id_u256 = uint256.bnToUint256(id);

      try {
        const execution = await account?.execute([
          {
            contractAddress: contract.address,
            entrypoint: "transfer_from",
            calldata: [account.address, recipient, id_u256.low, id_u256.high, ],
          },
        ]);

        let txReceipt = await account.waitForTransaction(
          execution.transaction_hash,
          {
            retryInterval: 200,
          }
        );

        checkTxReceipt(txReceipt);
        setIsLoading(false);
        setIsSuccess(true);
        return toast({
          title: "Success",
          description: `Transfered #${id}!`,
        });
      } catch (e: any) {
        // console.log(e);
        setIsLoading(false);
        return toast({
          title: "Error",
          description: errorMessage(e.message),
          variant: "destructive",
        });
      }
    },
    [account]
  );

  return { transfer, isLoading, isSuccess };
};
