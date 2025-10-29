import { Gem } from "@/components/icons";
import { HeaderButton, MakeItRain } from "@/components/layout";
import { useClaimable } from "@/dojo/hooks";
import { IsMobile } from "@/utils/ui";
import { Button } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { ClaimModal } from "./ClaimModal";

export interface Claimable {
  totalClaimable: number;
  tokenIds: Array<number>;
}

export const ClaimReward = () => {
  const { account } = useAccount();

  const { claimable: claimableData, refetch: refetchClaimable } = useClaimable(account?.address || "0x0");

  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isRainning, setIsRainning] = useState(false);

  const [claimable, setClaimable] = useState<Claimable>({
    totalClaimable: 0,
    tokenIds: [],
  });

  useEffect(() => {
    const tokenIds = claimableData
      .map((i: any) => Number(i.minigame_token_id || 0))
      .filter((id: number) => Number.isFinite(id) && id > 0);
    const totalClaimable = claimableData.map((i: any) => i.claimable).reduce((p: number, c: number) => p + c, 0);

    setClaimable({
      totalClaimable,
      tokenIds,
    });
  }, [claimableData]);

  const isMobile = IsMobile();

  const onClose = (claimed: boolean) => {
    if (claimed) {
      setIsRainning(true);

      setTimeout(() => {
        setIsRainning(false);
      }, 10_000);
    }

    setIsClaimModalOpen(false);

    setTimeout(() => {
      refetchClaimable();
    }, 1000);
  };

  return (
    <>
      {claimable.totalClaimable > 0 && (
        <>
          <Button
            h={["40px", "48px"]}
            variant="pixelated"
            bg="yellow.600"
            borderColor="yellow.600"
            color="yellow.400"
            _hover={{
              bg: "yellow.500",
            }}
            onClick={() => setIsClaimModalOpen(true)}
          >
            <Gem /> {!isMobile ? "CLAIM" : ""}
          </Button>
          <ClaimModal claimable={claimable} claimableData={claimableData} isOpen={isClaimModalOpen} onClose={onClose} />
        </>
      )}
      {isRainning && <MakeItRain />}
    </>
  );
};
