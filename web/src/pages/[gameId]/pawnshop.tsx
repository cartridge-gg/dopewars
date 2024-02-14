import Button from "@/components/Button";
import { Footer } from "@/components/Footer";
import Layout from "@/components/Layout";
import { useConfigStore, useDojoContext, useGameStore, useRouterContext } from "@/dojo/hooks";
import { ItemConfigFull } from "@/dojo/stores/config";
import { ItemSlot } from "@/dojo/types";
import { useToast } from "@/hooks/toast";
import { HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";

const PawnShop = observer(() => {
  const { router, gameId } = useRouterContext();

  const { account } = useDojoContext();
  const configStore = useConfigStore();
  const { game } = useGameStore();

  const toaster = useToast();

  const [selectedShopItem, setSelectedShopItem] = useState<ItemConfigFull | undefined>(undefined);

  const selectItem = (shopItem: ItemConfigFull) => {
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
    if (game.player!.cash < selectedShopItem.cost) return;

    game.pushCall({ slot: selectedShopItem.slot_id, cost: selectedShopItem?.cost });

    toaster.toast({
      message: `${selectedShopItem.name} equiped!`,
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
            isDisabled={!selectedShopItem || selectedShopItem.cost > game.player.cash}
            onClick={buy}
          >
            Buy
          </Button>
        </Footer>
      }
    >
      <VStack w="full" pt={["0px", "20px"]} gap="20px" margin="auto">
        <VStack w="full" alignItems="flex-start" mt="10px">
          <Text textStyle="subheading" fontSize="10px" color="neon.500">
            For sale - choose one
          </Text>
        </VStack>

        <SimpleGrid columns={1} w="full" margin="auto" gap={["10px", "16px"]} fontSize={["16px", "20px"]} pr="8px">
          {game.items.attackUpgrade && (
            <ShopItem
              item={game.items.attackUpgrade}
              onClick={() => setSelectedShopItem(game.items.attackUpgrade)}
              isActive={selectedShopItem === game.items.attackUpgrade}
              isDisabled={game.items.attackUpgrade?.cost > game.player.cash}
            />
          )}
          {game.items.defenseUpgrade && (
            <ShopItem
              item={game.items.defenseUpgrade}
              onClick={() => setSelectedShopItem(game.items.defenseUpgrade)}
              isActive={selectedShopItem === game.items.defenseUpgrade}
              isDisabled={game.items.defenseUpgrade?.cost > game.player.cash}
            />
          )}
          {game.items.speedUpgrade && (
            <ShopItem
              item={game.items.speedUpgrade}
              onClick={() => setSelectedShopItem(game.items.speedUpgrade)}
              isActive={selectedShopItem === game.items.speedUpgrade}
              isDisabled={game.items.speedUpgrade?.cost > game.player.cash}
            />
          )}
          {game.items.transportUpgrade && (
            <ShopItem
              item={game.items.transportUpgrade}
              onClick={() => setSelectedShopItem(game.items.transportUpgrade)}
              isActive={selectedShopItem === game.items.transportUpgrade}
              isDisabled={game.items.transportUpgrade?.cost > game.player.cash}
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
    item,
    onClick,
    isActive,
    isDisabled,
  }: {
    item: ItemConfigFull;
    onClick: VoidFunction;
    isActive: bool;
    isDisabled: bool;
  }) => {
    return (
      <Button
        w="full"
        h={["auto", "100px"]}
        position="relative"
        padding="16px"
        variant="selectable"
        justifyContent="stretch"
        onClick={onClick}
        isActive={isActive}
        isDisabled={isDisabled}
      >
        <VStack w="full" gap="10px">
          <HStack w="full" justify="space-between">
            <Text textStyle="heading" textTransform="uppercase" fontSize={["18px", "20px"]}>
              {item.name}
            </Text>
            {item.icon({ width: "40px", height: "40px" })}
          </HStack>
          <HStack w="full" justifyContent="space-between">
            <Text fontSize={["18px", "20px"]}>${item.cost}</Text>
            <Text fontSize={["14px", "16px"]} opacity="0.5">
              {item.statName} +{item.slot_id !== ItemSlot.Transport ? item.stat : item.stat / 100}
            </Text>
          </HStack>
        </VStack>
      </Button>
    );
  },
);
