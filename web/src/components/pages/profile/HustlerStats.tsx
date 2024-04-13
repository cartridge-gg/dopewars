import { HealthIndicator } from "@/components/player";
import { useGameStore } from "@/dojo/hooks";
import { Divider, HStack, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

export const HustlerStats = observer(() => {
  const { game } = useGameStore();

  if(!game) return null
  return (
    <HStack flexDirection="row" w="full" px="10px" py="6px" justifyContent="center">
      <Text display="flex" flex="1">
        {game?.items.attack.icon({})} {game?.items.attack.tier.stat}
      </Text>
      <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
      <Text display="flex" flex="1">
        {game?.items.defense.icon({})} {game?.items.defense.tier.stat}
      </Text>
      <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
      <Text display="flex" flex="1">
        {game?.items.speed.icon({})} {game?.items.speed.tier.stat}
      </Text>
      <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
      <HealthIndicator health={game?.player.health} maxHealth={100} flex="1" />
    </HStack>
  );
});
