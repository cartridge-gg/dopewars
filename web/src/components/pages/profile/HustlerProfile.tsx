import { Hustler, Hustlers } from "@/components/hustlers";
import { PowerMeter } from "@/components/player";
import { useConfigStore, useGameStore, useRouterContext } from "@/dojo/hooks";
import { ItemSlot } from "@/dojo/types";
import { useToast } from "@/hooks/toast";
import { Box, Button, HStack, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import ShareButton from "./ShareButton";

export const HustlerProfile = observer(() => {
  const { gameId} = useRouterContext()
  const { game, gameInfos } = useGameStore();
  const configStore = useConfigStore();
  const [hustlerStats, setHustlerStats] = useState<any>();
  const { toast } = useToast();

  useEffect(() => {
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

    setHustlerStats(stats);
  }, [configStore, gameInfos?.hustler_id]);

  if (!configStore || !hustlerStats || !game) return null;

  return (
    <VStack w="full" gap={6}>
      <HStack w="full" p="20px" justifyContent="center" gap={6}>
        <Box alignItems="center" h="300px" w="150px" position="relative" zIndex={99}>
          <Hustler hustler={gameInfos?.hustler_id as Hustlers} w="150px" h="300px" />
          {/* <OG id={97} /> */}
        </Box>

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
      </HStack>

      <HStack>
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

      {/* <Card p="10px 20px">
        <VStack gap={2} alignItems="flex-start">
          <HStack>
            <Siren ml={-1} /> <Text>Met {game?.encounters.copsLevel} COPS</Text>
          </HStack>
          <Divider borderColor="neon.700"/>
          <HStack>
            <Knife ml={-1} /> <Text>Met {game?.encounters.gangLevel} GANG</Text>
          </HStack>
        </VStack>
      </Card> */}

      {/* <Inventory /> */}
    </VStack>
  );
});
