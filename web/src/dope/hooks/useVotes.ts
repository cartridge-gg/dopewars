import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { AccountInterface, Contract, uint256 } from "starknet";
import { useSystems } from "@/dojo/hooks";
import { useToast } from "@chakra-ui/react";

export const useVotes = (contractAddress: string, account?: AccountInterface) => {
  const [isLoading, setIsLoading] = useState(false);

  const { executeAndReceipt } = useSystems();
  const [votingPower, setVotingPower] = useState(0n);
  const [delegates, setDelegates] = useState("");

  const refresh = async () => {
    if (!account) return;

    const voting = await account.callContract({
      contractAddress,
      entrypoint: "get_votes",
      calldata: [account.address],
    });

    const delegates = await account.callContract({
      contractAddress,
      entrypoint: "delegates",
      calldata: [account.address],
    });

    setVotingPower(
      uint256.uint256ToBN({
        low: voting[0],
        high: voting[1],
      }),
    );
    setDelegates(delegates[0] as string);
  };

  const delegateTo = async (address: string) => {
    if (!account) return;
    if (!address || Number(address) === 0) return;

    const { hash, isError } = await executeAndReceipt({
      contractAddress,
      entrypoint: "delegate",
      calldata: [address],
    });

    await refresh();
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return { isLoading, votingPower, delegateTo, delegates };
};
