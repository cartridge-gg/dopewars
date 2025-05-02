import { Hustler, Hustlers } from "@/components/hustlers";
import { PowerMeter } from "@/components/player";
import { useConfigStore, useGameStore, useRouterContext } from "@/dojo/hooks";
import { ItemSlot } from "@/dojo/types";
import { useToast } from "@/hooks/toast";
import { Box, Button, HStack, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import ShareButton from "./ShareButton";
import { HustlerPreviewFromLoot, HustlerPreviewFromHustler } from "@dope/dope-sdk/components";
import { HustlerAvatarIcon } from "./HustlerAvatarIcon";

export const HustlerProfile = observer(() => {
  const { gameId } = useRouterContext();
  const { game, gameInfos, gameWithTokenId } = useGameStore();
  const configStore = useConfigStore();
  const { toast } = useToast();

  const hustlerStats = useMemo(() => {
    const hustler = configStore?.getHustlerById(gameInfos?.hustler_id);
    if (!hustler) return;

    const stats = {
      [ItemSlot.Weapon]: {
        //name: shortString.decodeShortString(hustler.weapon.base.name),
        name: hustler.weapon.base.name,
        initialTier: Number(hustler.weapon.base.initial_tier),
      },
      [ItemSlot.Clothes]: {
        // name: shortString.decodeShortString(hustler.clothes.base.name),
        name: hustler.clothes.base.name,
        initialTier: Number(hustler.clothes.base.initial_tier),
      },
      [ItemSlot.Feet]: {
        // name: shortString.decodeShortString(hustler.feet.base.name),
        name: hustler.feet.base.name,
        initialTier: Number(hustler.feet.base.initial_tier),
      },
      [ItemSlot.Transport]: {
        // name: shortString.decodeShortString(hustler.transport.base.name),
        name: hustler.transport.base.name,
        initialTier: Number(hustler.transport.base.initial_tier),
      },
    };

    return stats;
  }, [configStore, gameInfos?.hustler_id]);

  if (!configStore || !game) return null;

  return (
    <VStack w="full" gap={6}>
      <HStack w="full" p="20px" justifyContent="center" gap={6}>
        <Box
          alignItems="center"
          h={["190px", "260px"]}
          w={["190px", "260px"]}
          position="relative"
          transform={"scale(2)"}
          zIndex={99}
          pointerEvents="none"
        >
          {/* <HustlerAvatarIcon
            hustlerId={420}
            tokenIdType={gameWithTokenId?.token_id_type}
            tokenId={gameWithTokenId?.token_id}
          /> */}
          {gameWithTokenId &&
            (gameWithTokenId.token_id_type === "LootId" || gameWithTokenId.token_id_type === "GuestLootId") && (
              <HustlerPreviewFromLoot tokenId={gameWithTokenId.token_id} renderMode={1} />
            )}
          {gameWithTokenId && gameWithTokenId.token_id_type === "HustlerId" && (
            <HustlerPreviewFromHustler tokenId={gameWithTokenId.token_id} renderMode={1} />
          )}
        </Box>

        {!gameWithTokenId && hustlerStats && (
          <Box alignItems="center" h={["190px", "300px"]} w="150px" position="relative" zIndex={99}>
            <Hustler hustler={gameInfos?.hustler_id as Hustlers} w="150px" h={["190px", "300px"]} />
            <VStack gap={3}>
              <PowerMeter
                basePower={hustlerStats[ItemSlot.Weapon].initialTier}
                maxPower={hustlerStats[ItemSlot.Weapon].initialTier + 3}
                power={hustlerStats[ItemSlot.Weapon].initialTier + game?.items.attack.level}
                displayedPower={6}
                text="ATK"
              />

              <PowerMeter
                basePower={hustlerStats[ItemSlot.Clothes].initialTier}
                maxPower={hustlerStats[ItemSlot.Clothes].initialTier + 3}
                power={hustlerStats[ItemSlot.Clothes].initialTier + game?.items.defense.level}
                displayedPower={6}
                text="DEF"
              />

              <PowerMeter
                basePower={hustlerStats[ItemSlot.Feet].initialTier}
                maxPower={hustlerStats[ItemSlot.Feet].initialTier + 3}
                power={hustlerStats[ItemSlot.Feet].initialTier + game?.items.speed.level}
                displayedPower={6}
                text="SPD"
              />

              <PowerMeter
                basePower={hustlerStats[ItemSlot.Transport].initialTier}
                maxPower={hustlerStats[ItemSlot.Transport].initialTier + 3}
                power={hustlerStats[ItemSlot.Transport].initialTier + game?.items.transport.level}
                displayedPower={6}
                text="INV"
              />
            </VStack>
          </Box>
        )}
      </HStack>

      {/* <Card>
        <HustlerStats />
      </Card> */}

      <HStack w="100%" maxW={["260px", "360px"]}>
        <Button
          variant="pixelated"
          w="full"
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/${gameId}/logs`);

            toast({
              message: "Copied to clipboard",
            });
          }}
        >
          Game Link
        </Button>
        <ShareButton variant="pixelated" />
      </HStack>
    </VStack>
  );
});
