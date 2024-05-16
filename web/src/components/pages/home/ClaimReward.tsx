import { Gem } from "@/components/icons";
import { MakeItRain } from "@/components/layout";
import { useClaimable } from "@/dojo/hooks";
import { IsMobile } from "@/utils/ui";
import { Button } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { ClaimModal } from "./ClaimModal";

export interface Claimable {
  totalClaimable: number;
  gameIds: Array<number>;
}

export const ClaimReward = () => {
  const { account } = useAccount();

  const { claimable: claimableData, refetchClaimable } = useClaimable(account?.address || "0x0");

  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isRainning, setIsRainning] = useState(false);

  const [claimable, setClaimable] = useState<Claimable>({
    totalClaimable: 0,
    gameIds: [],
  });

  useEffect(() => {
    const gameIds = claimableData.map((i) => i.game_id);
    const totalClaimable = claimableData.map((i) => i.claimable).reduce((p, c) => p + c, 0);

    setClaimable({
      totalClaimable,
      gameIds,
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
            h="48px"
            variant="pixelated"
            bg="yellow.600"
            borderColor="yellow.600"
            color="yellow.400"
            _hover={{
              bg: "yellow.500",
            }}
            onClick={() => setIsClaimModalOpen(true)}
          >
            <Gem /> {!isMobile ? "Claim" : ""}
          </Button>
          <ClaimModal claimable={claimable} claimableData={claimableData} isOpen={isClaimModalOpen} onClose={onClose} />
        </>
      )}
      {isRainning && <MakeItRain />}
    </>
  );
};
