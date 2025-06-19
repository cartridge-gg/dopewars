import { ParsedToken, useDopeLootClaim, useERC721 } from "@/dope/hooks";
import { useEffect, useMemo, useState } from "react";
import { HustlerPreviewFromLoot } from "@/dope/components";
import { useDopeStore } from "@/dope/store";
import { useDojoContext } from "@/dojo/hooks";
import CardAnim from "./CardAnim";
import { Box, GridItem } from "@chakra-ui/react";
import { Button } from "@/components/common";
import { Cartridge } from "@/components/icons/branding/Cartridge";
import { useConnect } from "@starknet-react/core";
import { ControllerConnector } from "@cartridge/connector";

export default function LootItem({ token }: { token: ParsedToken }) {
  const { connector } = useConnect();

  const {
    contracts: { getDojoContract },
  } = useDojoContext();

  const { onOpen, onRelease, isLoading: isOpening, isSuccess } = useDopeLootClaim({ getDojoContract });
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

  const lootAddress = getDojoContract("dope-DopeLoot").address!;
  const onOpenController = (e: any) => {
    e.preventDefault();
    (connector as unknown as ControllerConnector).controller.openProfileTo(
      `inventory/collection/${lootAddress}/token/0x${token.token_id.toString(16).padStart(64, "0")}`,
    );
  };

  return (
    // @ts-ignore
    <CardAnim onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <GridItem
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer"
        border="solid 1px"
        borderColor="neon.700"
      >
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
            isDisabled={isOpening || !isReleased}
            isLoading={isOpening}
          >
            Open
          </Button>
        </Box>
      )}

      {isHovered && (
        <Box position="absolute" right={1} top={1} cursor="pointer" onClick={onOpenController} bg="#33333366">
          <Cartridge />
        </Box>
      )}
    </CardAnim>
  );
}
