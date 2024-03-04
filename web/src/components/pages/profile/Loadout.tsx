import { itemUpgrades, slotName, slotNameKeys, statName, statNameKeys } from "@/dojo/helpers";
import { useGameStore } from "@/dojo/hooks";
import { HustlerItemConfigFull } from "@/dojo/stores/config";
import { HStack, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

export const Loadout = () => {
  const { game, gameInfos } = useGameStore();

  if (!game || !gameInfos) return null;

  return (
    <VStack w="full" gap={6}>
      <Item item={game.items.attack} />
      <Item item={game.items.defense} />
      <Item item={game.items.speed} />
      <Item item={game.items.transport} />
    </VStack>
  );
};

const Item = observer(({ item }: { item: HustlerItemConfigFull }) => {
  /// @ts-ignore
  const upgrades = itemUpgrades[item.slot][Number(item.base.id)];

  return (
    <HStack w="full" gap={9} fontSize="14px">
      {item.icon({ boxSize: "48px", marginLeft: "-20px" })}

      <VStack w="260px" alignItems="flex-start" gap={0}>
        <HStack
          w="170px"
          fontSize="12px"
          justifyContent="space-between"
          fontFamily="broken-console"
          color="neon.500"
          gap={0}
        >
          <Text>{slotName[item.slot as slotNameKeys]}</Text>
          <Text>{statName[item.slot as statNameKeys]}</Text>
        </HStack>
        <Text>{item.base.name}</Text>
      </VStack>

      <VStack w="full" alignItems="flex-start" gap={0} mt={1}>
        {[1, 2, 3].map((i) => (
          <Text key={i} color={item.level >= i ? "yellow.400" : "neon.500"}>
            + {upgrades[i]}
          </Text>
        ))}
      </VStack>
    </HStack>
  );
});
