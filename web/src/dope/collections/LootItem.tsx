import { ParsedToken, useDopeLootClaim, useERC721 } from "@/dope/hooks";
import { useMemo, useState } from "react";
import { HustlerPreviewFromLoot } from "@/dope/components";

import { useDopeStore } from "@/dope/store";
import { useToast } from "@/hooks/toast";
import { useDojoContext } from "@/dojo/hooks";
import CardAnim from "./CardAnim";
import { Box, GridItem } from "@chakra-ui/react";
import { Button } from "@/components/common";

export default function LootItem({ token }: { token: ParsedToken }) {
  const { toast } = useToast();

  const {
    contracts: { getDojoContract },
  } = useDojoContext();

  const { onOpen, onRelease, isLoading: isOpening, isSuccess } = useDopeLootClaim({ toast, getDojoContract });

  //   const {
  //     transfer,
  //     isLoading: isTransfering,
  //     isSuccess: isTransferSuccess,
  //   } = useERC721({ toast, getDojoContract, contractTag: "dope-DopeLoot" });

  const [isFlipped, setIsFlipped] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [recipient, setRecipient] = useState("");

  const dopeLootClaimState = useDopeStore((state) => state.dopeLootClaimState);

  const { isOpened, isReleased } = useMemo(() => {
    const tokenState = dopeLootClaimState[Number(token.token_id)];
    const isOpened = tokenState ? tokenState.isOpened : false;
    const isReleased = tokenState ? tokenState.isReleased : false;
    return { isOpened, isReleased };
  }, [dopeLootClaimState, dopeLootClaimState[Number(token.token_id)]]);

  return (
    <CardAnim onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <GridItem onClick={() => setIsFlipped(!isFlipped)} className="cursor-pointer">
        {isFlipped ? (
          <img
            className="aspect-square w-full pointer-events-none select-none"
            src={token.metadata.image}
            loading="lazy"
          />
        ) : (
          <HustlerPreviewFromLoot tokenId={Number(token.token_id)} />
        )}
      </GridItem>

      {/* {!isReleased && (
        <div className="absolute bottom-0 left-0 z-10">
          <Button
            className="w-[100px]"
            onClick={async () => {
              const game_id = prompt("game id ?");
              await onRelease(Number(token.token_id), Number(game_id));
              // await initDopeLootClaimState();
            }}
          >
            release
          </Button>
        </div>
      )}
*/}
      {!isOpened && isHovered && (
        <Box position="absolute" bottom={0} right={0} zIndex={10}>
          <Button
            w="80px"
            onClick={async () => {
              await onOpen(Number(token.token_id));
              // await initDopeLootClaimState();
            }}
            disabled={isOpening}
            isLoading={isOpening}
          >
            Open
          </Button>
        </Box>
      )}
    </CardAnim>
  );
}
