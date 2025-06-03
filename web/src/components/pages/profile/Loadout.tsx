import { PowerMeter, TierIndicator } from "@/components/player";
import {  slotName, slotNameKeys, statName, statNameKeys } from "@/dojo/helpers";
import { useGameStore } from "@/dojo/hooks";
import { IsMobile } from "@/utils/ui";
import { Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { DopeGearItem } from "./DopeGearItem";
import { ItemSlot } from "@/dojo/types";
import { ItemInfos } from "@/dojo/class/Items";

export const Loadout = () => {
  const { game, gameInfos, configStore } = useGameStore();

  if (!game || !gameInfos) return null;

  return (
    <VStack w="full" gap={6}>
      <GearItemInfos slot={ItemSlot.Weapon} item={game?.items.attack} level={game?.items.attackLevel} />
      <GearItemInfos slot={ItemSlot.Clothes} item={game?.items.defense} level={game?.items.defenseLevel} />
      <GearItemInfos slot={ItemSlot.Feet} item={game?.items.speed} level={game?.items.speedLevel} />
      <GearItemInfos slot={ItemSlot.Transport} item={game?.items.transport} level={game?.items.transportLevel} />
    </VStack>
  );
};

const GearItemInfos = observer(({ slot, item, level }: { slot: ItemSlot; item: ItemInfos; level: number }) => {
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
      <Flex w="full" flexDirection={"row"} gap={[2, 9]} justifyContent={"space-between"}>
        <HStack w="full" gap={[3, 9]}>
          <DopeGearItem itemSlot={slot} id={item.id!} />
          <VStack alignItems="flex-start" gap={1}>
            <HStack
              w={["120px", "180px"]}
              fontSize="12px"
              justifyContent="space-between"
              fontFamily="broken-console"
              color="neon.500"
              gap={0}
            >
              <Text>{slotName[item.slot as slotNameKeys]}</Text>
            </HStack>
            <Text>{item.name}</Text>
            <Text color="neon.500" fontFamily="broken-console" fontSize="11px">
              {item.stat} {statName[item.slot as statNameKeys]}
            </Text>
          </VStack>
        </HStack>

        <VStack alignItems={"center"}>
          <TierIndicator tier={item.tier!} />
          <PowerMeter basePower={0} maxPower={3} displayedPower={3} power={level} text={`LVL`} />
        </VStack>
      </Flex>
    </HStack>
  );
});

