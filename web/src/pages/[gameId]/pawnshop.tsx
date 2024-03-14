import { Button } from "@/components/common";
import { Footer, Layout } from "@/components/layout";
import { statName } from "@/dojo/helpers";
import { useConfigStore, useDojoContext, useGameStore, useRouterContext } from "@/dojo/hooks";
import { HustlerItemConfigFull } from "@/dojo/stores/config";
import { ItemSlot } from "@/dojo/types";
import { Sounds, playSound } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
import { formatCash } from "@/utils/ui";
import { HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";

const PawnShop = observer(() => {
  const { router, gameId } = useRouterContext();

  const { account } = useDojoContext();
  const configStore = useConfigStore();
  const { game } = useGameStore();

  const toaster = useToast();

  const [selectedShopItem, setSelectedShopItem] = useState<HustlerItemConfigFull | undefined>(undefined);

  const selectItem = (shopItem: HustlerItemConfigFull) => {
    if (selectedShopItem === shopItem) {
      setSelectedShopItem(undefined);
    } else {
      setSelectedShopItem(shopItem);
    }
  };

  const onBack = () => {
    if (!game?.player.location) {
      return router.push(`/${gameId}/travel`);
    }
    router.push(`/${gameId}/${game?.player.location.location}`);
  };

  const buy = async () => {
    if (!game || !selectedShopItem) return;
    if (game.player!.cash < selectedShopItem.tier.cost) return;

    playSound(Sounds.Trade)
    game.pushCall({ slot: selectedShopItem.slot as number, cost: selectedShopItem?.tier.cost });

    toaster.toast({
      message: `${selectedShopItem.upgradeName} equiped!`,
      icon: selectedShopItem.icon,
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
            isDisabled={!selectedShopItem || selectedShopItem.tier.cost > game.player.cash}
            onClick={buy}
          >
            Buy
          </Button>
        </Footer>
      }
    >
      <VStack w="full" pt={["0px", "20px"]} gap="20px" margin="auto">
        <VStack w="full" alignItems="flex-start" mt="10px">
          <Text textStyle="subheading" fontSize="12px" color="neon.500">
            For sale - choose one
          </Text>
        </VStack>

        <SimpleGrid columns={1} w="full" margin="auto" gap={["10px", "16px"]} fontSize={["16px", "20px"]} pr="8px">
          {game.items.attackUpgrade && (
            <ShopItem
              title="Weapon Upgrade"
              item={game.items.attackUpgrade}
              onClick={() => setSelectedShopItem(game.items.attackUpgrade)}
              isActive={selectedShopItem === game.items.attackUpgrade}
              isDisabled={game.items.attackUpgrade?.tier.cost > game.player.cash}
            />
          )}
          {game.items.defenseUpgrade && (
            <ShopItem
              title="Clothes Upgrade"
              item={game.items.defenseUpgrade}
              onClick={() => setSelectedShopItem(game.items.defenseUpgrade)}
              isActive={selectedShopItem === game.items.defenseUpgrade}
              isDisabled={game.items.defenseUpgrade?.tier.cost > game.player.cash}
            />
          )}
          {game.items.speedUpgrade && (
            <ShopItem
              title="Feet Upgrade"
              item={game.items.speedUpgrade}
              onClick={() => setSelectedShopItem(game.items.speedUpgrade)}
              isActive={selectedShopItem === game.items.speedUpgrade}
              isDisabled={game.items.speedUpgrade?.tier.cost > game.player.cash}
            />
          )}
          {game.items.transportUpgrade && (
            <ShopItem
              title="Transport Upgrade"
              item={game.items.transportUpgrade}
              onClick={() => setSelectedShopItem(game.items.transportUpgrade)}
              isActive={selectedShopItem === game.items.transportUpgrade}
              isDisabled={game.items.transportUpgrade?.tier.cost > game.player.cash}
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
    onClick,
    isActive,
    isDisabled,
  }: {
    title: string;
    item: HustlerItemConfigFull;
    onClick: VoidFunction;
    isActive: boolean;
    isDisabled: boolean;
  }) => {
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
        <HStack w="full" gap="20px">
          {item.icon({ width: "40px", height: "40px" })}

          <HStack w="full" justify="space-between">
            <VStack w="full" alignItems="flex-start">
              <Text textStyle="subheading" fontSize="12px" opacity="0.5">
                {title}
              </Text>
              <Text textStyle="heading" textTransform="uppercase" fontSize={["16px", "18px"]}>
                {/* {item.base.name} */}
                {item.upgradeName}
              </Text>
            </VStack>

            <VStack w="full" alignItems="flex-end">
              <Text fontSize={["14px", "16px"]} opacity="0.5">
                +{item.slot !== ItemSlot.Transport ? item.tier.stat : item.tier.stat / 100} {statName[item.slot]}
              </Text>
              <Text fontSize={["16px", "18px"]}>{formatCash(item.tier.cost)}</Text>
            </VStack>
          </HStack>
        </HStack>
      </Button>
    );
  },
);
