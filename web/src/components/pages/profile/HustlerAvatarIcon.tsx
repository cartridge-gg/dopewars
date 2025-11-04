import { Box, StyleProps } from "@chakra-ui/react";

import colors from "@/theme/colors";
import { HustlerPreviewFromLoot } from "@/dope/components";
import { HustlerPreviewFromGame } from "./HustlerPreviewFromGame";

export const HustlerAvatarIcon = ({
  gameId,
  tokenIdType,
  tokenId,
  color = colors.neon["400"].toString(),
  ...rest
}: { gameId: number; tokenIdType?: string; tokenId?: number } & StyleProps) => {
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
          <HustlerPreviewFromGame gameId={gameId} tokenId={tokenId} renderMode={2} />
        </Box>
      );
    }
  }
  return null;
};
