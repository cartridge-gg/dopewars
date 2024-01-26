import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import { Alert } from "@/components/icons";
import { InputNumber } from "@/components/InputNumber";
import {
  VStack,
  HStack,
  Text,
  Card,
  CardFooter,
  CardBody,
  CardHeader,
  SimpleGrid,
  Box,
  Heading,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode, useState, useEffect } from "react";
import { GameMode, ShopItemInfo, ItemEnum, ItemTextEnum } from "@/dojo/types";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { useSystems } from "@/dojo/hooks/useSystems";
import { playSound, Sounds } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";

import { Truck } from "@/components/icons/Truck";
import { getLocationById, getLocationByType, getShopItem, getShopItemStatname } from "@/dojo/helpers";
import { useAvailableShopItems } from "@/dojo/hooks/useAvailableShopItems";
import { Inventory } from "@/components/Inventory";
import { MarketEventData, displayMarketEvents } from "@/dojo/events";
import { usePlayerStore } from "@/dojo/hooks/usePlayerStore";

export default function PawnShop() {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const { account } = useDojoContext();
  const { buyItem, dropItem, skipShop, isPending } = useSystems();
  const { availableShopItems } = useAvailableShopItems(gameId);

  const { playerEntity }= usePlayerStore()

  const [isBuying, setIsBuying] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  const toaster = useToast();

  const [selectedShopItem, setSelectedShopItem] = useState<ShopItemInfo | undefined>(undefined);

  const selectItem = (shopItem: ShopItemInfo) => {
    // do checks
    if (selectedShopItem === shopItem) {
      setSelectedShopItem(undefined);
    } else {
      setSelectedShopItem(shopItem);
    }
  };

  const onSkip = async () => {
    setIsSkipping(true);
    try {
      const { hash, events } = await skipShop(gameId);

      if (events) {
        displayMarketEvents(events as MarketEventData[], toaster);
      }

      router.push(`/${gameId}/${getLocationById(playerEntity?.nextLocationId)?.slug}`);
    } catch (e) {
      console.log(e);
    }
    setIsSkipping(false);
  };

  const buy = async () => {
    if (!selectedShopItem) return;

    setIsBuying(true);

    try {
      const icon = selectedShopItem.icon;
      playSound(Sounds.Trade);
      const { hash, events } = await buyItem(gameId, selectedShopItem.type);

      toaster.toast({
        message: `${selectedShopItem.name} equiped!`,
        link: `http://amazing_explorer/${hash}`,
        icon,
      });

      if (events) {
        displayMarketEvents(events as MarketEventData[], toaster);
      }
      router.push(`/${gameId}/${getLocationById(playerEntity?.nextLocationId)?.slug}`);
    } catch (e) {
      console.log(e);
    }

    setIsBuying(false);
  };

  if (!playerEntity) {
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
          <Button w="full" px={["auto", "20px"]} isLoading={isSkipping} isDisabled={isPending} onClick={onSkip}>
            Skip
          </Button>
          <Button
            w="full"
            px={["auto", "20px"]}
            isLoading={isBuying}
            isDisabled={
              isPending ||
              !selectedShopItem ||
              selectedShopItem.cost > playerEntity.cash 
              // ||(playerEntity?.items.length === playerEntity?.maxItems &&
              //   playerEntity?.items.find((i) => i.id === selectedShopItem?.typeText) === undefined)
            }
            onClick={buy}
          >
            Buy
          </Button>
        </Footer>
      }
    >
      <VStack w="full" pt={["0px", "20px"]} gap="20px" margin="auto">
        <Inventory />

        <VStack w="full" alignItems="flex-start" mt="10px">
          <Text textStyle="subheading" fontSize="10px" color="neon.500">
            For sale - choose one
          </Text>
        </VStack>

        <SimpleGrid columns={[1, 2]} w="full" margin="auto" gap={["10px", "16px"]} fontSize={["16px", "20px"]} pr="8px">
          {availableShopItems &&
            availableShopItems.map((shopItem, index) => {
              return (
                <Button
                  w="full"
                  h={["auto", "100px"]}
                  key={index}
                  position="relative"
                  padding="16px"
                  onClick={() => selectItem(shopItem)}
                  variant="selectable"
                  isActive={shopItem === selectedShopItem}
                  justifyContent="stretch"
                  isDisabled={
                    shopItem.cost > playerEntity.cash 
                    // || (playerEntity?.items.length === playerEntity?.maxItems &&
                    //   playerEntity?.items.find((i) => i.id === shopItem?.typeText) === undefined)
                  }
                >
                  <VStack w="full" gap="10px">
                    <HStack w="full" justify="space-between">
                      <Text textStyle="heading" textTransform="uppercase" fontSize={["18px", "20px"]}>
                        {shopItem.name}
                      </Text>
                      {shopItem.icon({ width: "40px", height: "40px" })}
                    </HStack>
                    <HStack w="full" justifyContent="space-between">
                      <Text fontSize={["18px", "20px"]}>${shopItem.cost}</Text>
                      <Text fontSize={["14px", "16px"]} opacity="0.5">
                        {getShopItemStatname(shopItem.typeText)} +{shopItem.value}
                      </Text>
                    </HStack>
                  </VStack>
                </Button>
              );
            })}
        </SimpleGrid>
      </VStack>
    </Layout>
  );
}
