import { Button } from "@/components/common";
import { Footer, Layout } from "@/components/layout";
import { DopeGearItem } from "@/components/pages/profile/DopeGearItem";
import { TierIndicator } from "@/components/player";
import { statName } from "@/dojo/helpers";
import { useConfigStore, useGameStore, useRouterContext } from "@/dojo/hooks";
import { GearItemFull } from "@/dojo/stores/config";
import { ItemSlot } from "@/dojo/types";
import { Sounds, playSound } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
import { IsMobile, formatCash } from "@/utils/ui";
import { Box, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { getGearItem } from "@/dope/helpers";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";

const PawnShop = observer(() => {
  const { router, gameId } = useRouterContext();
  const configStore = useConfigStore();
  const { config } = configStore;
  const { game, gameConfig, gameInfos } = useGameStore();

  const toaster = useToast();

  const [selectedShopItemsSlot, setSelectedShopItemSlot] = useState<ItemSlot | undefined>(undefined);

  const gearItems = useMemo(() => {
    return (gameInfos?.equipment_by_slot || []).map((i) => {
      return configStore.getGearItemFull(getGearItem(BigInt(i)));
    });
  }, [gameInfos, configStore]);

  const selectItem = (shopItemSlot: ItemSlot) => {
    if (selectedShopItemsSlot === shopItemSlot) {
      setSelectedShopItemSlot(undefined);
    } else {
      setSelectedShopItemSlot(shopItemSlot);
    }
  };

  const onBack = () => {
    playSound(Sounds.Door, 0.3);
    router.push(`/${gameId}/travel`);
  };

  const buy = async () => {
    if (!game || selectedShopItemsSlot === undefined) return;

    let selectedItem = gearItems![selectedShopItemsSlot as keyof typeof gearItems] as unknown as GearItemFull;
    let cost = selectedItem.levels[game.items.levelByItemSlot[selectedShopItemsSlot] + 1].cost;
    let slot = selectedShopItemsSlot;

    if (game.player!.cash < cost) return;
    playSound(Sounds.Trade);
    game.pushCall({ slot, cost });
    toaster.toast({
      message: `${selectedItem.name} upgraded! +${gameConfig!.rep_buy_item} REP!`,
      // icon: selectedShopItem.icon,
    });
    onBack();
  };

  if (!game) {
    return null;
  }

  return (
    <Layout
      leftPanelProps={{
        prefixTitle: "Welcome to the ...",
        title: "Pawn Shop",
        imageSrc: "/images/pawnshop.png",
      }}
      footer={
        <Footer>
          <Button w="full" px={["auto", "20px"]} onClick={onBack}>
            Back
          </Button>
          <Button
            w="full"
            px={["auto", "20px"]}
            isDisabled={!gearItems![selectedShopItemsSlot as keyof typeof gearItems]}
            onClick={buy}
          >
            Buy
          </Button>
        </Footer>
      }
    >
      <VStack w="full" pt={["0px", "20px"]} gap="20px" margin="auto">
        <VStack w="full" alignItems="flex-start" mt="10px">
          <Text textStyle="subheading" fontSize={["9px", "11px"]} color="neon.500">
            For sale - choose one
          </Text>
        </VStack>

        <SimpleGrid columns={1} w="full" margin="auto" gap={["10px", "16px"]} fontSize={["16px", "20px"]} pr="8px">
          {game.items.attackLevel < 3 && (
            <ShopItem
              title="Weapon Upgrade"
              item={gearItems![ItemSlot.Weapon]}
              slot={ItemSlot.Weapon}
              level={game.items.attackLevel}
              onClick={() => setSelectedShopItemSlot(ItemSlot.Weapon)}
              isActive={selectedShopItemsSlot === ItemSlot.Weapon}
              isDisabled={gearItems![ItemSlot.Weapon].levels[game.items.attackLevel + 1].cost > game.player.cash}
            />
          )}
          {game.items.defenseLevel < 3 && (
            <ShopItem
              title="Clothes Upgrade"
              item={gearItems![ItemSlot.Clothes]}
              slot={ItemSlot.Clothes}
              level={game.items.defenseLevel}
              onClick={() => setSelectedShopItemSlot(ItemSlot.Clothes)}
              isActive={selectedShopItemsSlot === ItemSlot.Clothes}
              isDisabled={gearItems![ItemSlot.Clothes].levels[game.items.defenseLevel + 1].cost > game.player.cash}
            />
          )}
          {game.items.speedLevel < 3 && (
            <ShopItem
              title="Feet Upgrade"
              item={gearItems![ItemSlot.Feet]}
              slot={ItemSlot.Feet}
              level={game.items.speedLevel}
              onClick={() => setSelectedShopItemSlot(ItemSlot.Feet)}
              isActive={selectedShopItemsSlot === ItemSlot.Feet}
              isDisabled={gearItems![ItemSlot.Feet].levels[game.items.speedLevel + 1].cost > game.player.cash}
            />
          )}
          {game.items.transportLevel < 3 && (
            <ShopItem
              title="Transport Upgrade"
              item={gearItems![ItemSlot.Transport]}
              slot={ItemSlot.Transport}
              level={game.items.transportLevel}
              onClick={() => setSelectedShopItemSlot(ItemSlot.Transport)}
              isActive={selectedShopItemsSlot === ItemSlot.Transport}
              isDisabled={gearItems![ItemSlot.Transport].levels[game.items.transportLevel + 1].cost > game.player.cash}
            />
          )}
        </SimpleGrid>
      </VStack>
    </Layout>
  );
});
export default PawnShop;

const ShopItem = observer(
  ({
    title,
    item,
    slot,
    level,
    onClick,
    isActive,
    isDisabled,
  }: {
    title: string;
    item: GearItemFull;
    slot: ItemSlot;
    level: number;
    onClick: VoidFunction;
    isActive: boolean;
    isDisabled: boolean;
  }) => {
    const isMobile = IsMobile();
    return (
      <Button
        w="full"
        h={["auto", "90px"]}
        position="relative"
        padding="16px"
        variant="selectable"
        justifyContent="stretch"
        onClick={onClick}
        isActive={isActive}
        isDisabled={isDisabled}
      >
        <HStack w="full" gap={3}>
          {/* {item.icon({ width: isMobile ? "32px" : "40px", height: isMobile ? "32px" : "40px" })} */}
          <Box flexShrink={0}>
            <DopeGearItem itemSlot={slot} id={item.gearItem.item} />
          </Box>
          <VStack w="full" alignItems="flex-start" gap={1}>
            <HStack w="full" justify="space-between" alignItems={"center"}>
              <Text textStyle="subheading" fontSize={["9px", "11px"]} opacity="0.5">
                {title}
              </Text>
              <TierIndicator tier={item.tier} />
            </HStack>

            <HStack w="full" justify="space-between" alignItems={"center"}>
              <Text textStyle="heading" textTransform="uppercase" fontSize={["14px", "16px"]}>
                {item.name}
              </Text>
              <Text fontSize={["12px", "14px"]} opacity="0.5">
                <span
                // style={{ textDecoration: "line-through" }}
                >
                  {item.levels[level].stat}
                </span>
                {" -> "}
                {item.levels[level + 1].stat} {statName[slot]}
              </Text>
            </HStack>

            <HStack w="full" justify="space-between" alignItems={"center"}>
              <Text textStyle="subheading" fontSize={["7px", "9px"]}>
                LVL {level + 1}
              </Text>
              <Text fontSize={["14px", "16px"]}>{formatCash(item.levels[level + 1].cost)}</Text>
            </HStack>
          </VStack>
        </HStack>
      </Button>
    );
  },
);
