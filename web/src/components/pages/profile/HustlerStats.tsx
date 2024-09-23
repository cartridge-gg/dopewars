import { HealthIndicator } from "@/components/player";
import { useGameStore } from "@/dojo/hooks";
import { Divider, HStack, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

export const HustlerStats = observer(() => {
  const { game, gameConfig } = useGameStore();


  if(!game || !gameConfig) return null
  return (
    <HStack flexDirection="row" w="full" px="10px" py="6px" justifyContent="center">
      <HStack flex="1">
        {game?.items.attack.icon({})} <Text>{game?.items.attack.tier.stat}</Text> 
      </HStack>
      <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
      <HStack  flex="1">
        {game?.items.defense.icon({})} <Text>{game?.items.defense.tier.stat}</Text>
      </HStack>
      <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
      <HStack  flex="1">
        {game?.items.speed.icon({})} <Text>{game?.items.speed.tier.stat}</Text>
      </HStack>
      <Divider h="26px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
      <HealthIndicator health={game?.player.health} maxHealth={gameConfig?.health} flex="1" />
      config.
    </HStack>
  );
});
