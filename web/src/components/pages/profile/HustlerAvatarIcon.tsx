import { GameWithTokenId } from "@/dojo/stores/game";
import { Box, StyleProps } from "@chakra-ui/react";

import colors from "@/theme/colors";
import { HustlerIcon, Hustlers } from "@/components/hustlers";
import { HustlerPreviewFromLoot, HustlerPreviewFromHustler } from "@dope/dope-sdk/components";
import { HustlerPreviewFromGame } from "./HustlerPreviewFromGame";

export const HustlerAvatarIcon = ({
  gameId,
  hustlerId,
  tokenIdType,
  tokenId,
  color = colors.neon["400"].toString(),
  ...rest
}: { gameId: number; hustlerId: number; tokenIdType?: string; tokenId?: number } & StyleProps) => {
  if (!tokenIdType) {
    return <HustlerIcon hustler={hustlerId as Hustlers} color={color} {...rest} />;
  }
  if (tokenIdType && tokenId !== undefined) {
    if (tokenIdType === "LootId" || tokenIdType === "GuestLootId") {
      return (
        <Box w="30px" h="30px" {...rest}>
          {/* @ts-ignore */}
          <HustlerPreviewFromLoot tokenId={tokenId} renderMode={2} />
        </Box>
      );
    } else if (tokenIdType === "HustlerId") {
      return (
        <Box w="30px" h="30px" {...rest}>
          {/* <HustlerPreviewFromHustler tokenId={tokenId} renderMode={2} /> */}
          <HustlerPreviewFromGame gameId={gameId} tokenId={tokenId} renderMode={2} />
        </Box>
      );
    }
  }
  return null;
};
