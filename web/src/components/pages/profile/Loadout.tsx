import { itemUpgrades, slotName, slotNameKeys, statName, statNameKeys } from "@/dojo/helpers";
import { useGameStore } from "@/dojo/hooks";
import { HustlerItemConfigFull } from "@/dojo/stores/config";
import { IsMobile } from "@/utils/ui";
import { Flex, HStack, Text, VStack } from "@chakra-ui/react";
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
  const isMobile = IsMobile();

  return (
    <HStack
      w="full"
      gap={[2, 9]}
      fontSize="14px"
      borderBottom="solid 1px"
      borderColor="neon.800"
      paddingBottom="20px"
      marginLeft="-20px"
      _last={{
        borderBottom: "none",
      }}
    >
      <Flex w="50%" flexDirection={["column", "row"]} gap={[2, 9]}>
        {item.icon && item.icon({ boxSize: isMobile ? "36px" : "48px" })}

        <VStack alignItems="flex-start" gap={0}>
          <HStack
            w={["120px", "160px"]}
            fontSize="12px"
            justifyContent="space-between"
            fontFamily="broken-console"
            color="neon.500"
            gap={0}
          >
            <Text>{slotName[item.slot as slotNameKeys]}</Text>
            {!isMobile && <Text>{statName[item.slot as statNameKeys]}</Text>}
          </HStack>
          <Text>{item.base.name}</Text>
        </VStack>
      </Flex>

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
