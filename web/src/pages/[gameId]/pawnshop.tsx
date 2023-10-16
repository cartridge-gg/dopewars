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
import { GameMode, ShopItemInfo, ItemEnum } from "@/dojo/types";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { useSystems } from "@/dojo/hooks/useSystems";
import { usePlayerEntity } from "@/dojo/queries/usePlayerEntity";
import { playSound, Sounds } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
import {
  Trenchcoat,
  Kevlar,
  Shoes,
  Glock,
  Knife,
  Uzi,
  Backpack,
  Bicycle,
  Dufflebag,
  Fannypack,
  Kneepads,
  Leatherjacket,
  Skateboard,
} from "@/components/icons/items";
import { Truck } from "@/components/icons/Truck";
import { useGameEntity } from "@/dojo/queries/useGameEntity";
import { getLocationById, getLocationByType } from "@/dojo/helpers";

export const descByType = {
  Attack: "* Gives you some extra firepower *",
  Transport: "* Allows you to carry more product *",
  Defense: "* Allows you to absorb some damage *",
  Speed: "* Allows you to escape more easily *",
};

export const iconByTypeAndLevel = {
  Attack: {
    1: Knife,
    2: Glock,
    3: Uzi,
  },
  Transport: {
    1: Fannypack,
    2: Backpack,
    3: Dufflebag,
  },
  Defense: {
    1: Kneepads,
    2: Leatherjacket,
    3: Kevlar,
  },
  Speed: {
    1: Shoes,
    2: Skateboard,
    3: Bicycle,
  },
};

export default function PawnShop() {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const { account } = useDojoContext();
  const { buyItem, dropItem, getAvailableItems, isPending } = useSystems();
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });
  const { game: gameEntity } = useGameEntity({
    gameId,
  });

  const { toast } = useToast();

  const [selectedShopItem, setSelectedShopItem] = useState<ShopItemInfo>(null);
  const [availableItems, setAvailableItems] = useState<ShopItemInfo[]>([]);

  useEffect(() => {
    const update = async () => {
      const { items } = (await getAvailableItems(gameId)) || [];
      const shopItems = items.map((i) => ({
        desc: descByType[i.item_type],
        icon: iconByTypeAndLevel[i.item_type][i.level],
        ...i,
      }));
      setAvailableItems(shopItems);
    };

    if (gameId) {
      update();
    }
  }, [gameId, getAvailableItems]);

  const selectItem = (shopItem: ShopItemInfo) => {
    // do checks
    if (selectedShopItem === shopItem) {
      setSelectedShopItem(null);
    } else {
      setSelectedShopItem(shopItem);
    }
  };

  const onContinue = () => {
    if (playerEntity?.turn === 0) {
      // first turn --> redirect to travel
      router.push(`/${gameId}/travel`);
    } else {
      // redirect to location
      router.push(
        `/${gameId}/${getLocationById(playerEntity?.locationId)?.slug}`,
      );
    }
  };

  const buy = async () => {
    if (!selectedShopItem) return;

    try {
      const { hash } = await buyItem(gameId, selectedShopItem.item_id);
      toast({
        message: "Was it a wise choice...",
        icon: Alert,
        link: `http://amazing_explorer/${hash}`,
      });

      onContinue();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Layout
      leftPanelProps={{
        prefixTitle: "Welcome to the ...",
        title: "Pawn Shop",
        imageSrc: "/images/pawnshop.png",
      }}
    >
      <VStack
        w="full"
        pt={["0px", "20px"]}
        gap="20px"
        sx={{
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
        margin="auto"
      >
        <Text>You can buy an item, or not...</Text>

        <SimpleGrid
          columns={1}
          w="full"
          maxW="420px"
          margin="auto"
          gap={["10px", "16px"]}
          fontSize={["16px", "20px"]}
        >
         
          {availableItems &&
            availableItems.map((shopItem, index) => {
              return (
                <Button
                  w="full"
                  h={["auto", "110px"]}
                  key={index}
                  position="relative"
                  padding="16px"
                  onClick={() => selectItem(shopItem)}
                  variant="selectable"
                  isActive={shopItem === selectedShopItem}
                >
                  <HStack w="full" gap="20px">
                    <VStack>
                    <Text display="inline" fontSize="11px" >LVL {shopItem.level}</Text>
                      {shopItem.icon({ width: "56px", height: "56px" })}
                    </VStack>
                    <VStack w="full" alignItems="flex-start">
                      <HStack w="full" justifyContent="space-between">
                        <Text
                          textStyle="heading"
                          textTransform="uppercase"
                          fontSize={["16px", "20px"]}
                        >
                          {shopItem.name} 
                        </Text>
                        <Text fontSize={["16px", "20px"]}>
                          ${shopItem.cost}
                        </Text>
                      </HStack>
                      <Text
                        opacity={0.4}
                        w="full"
                        h="40px"
                        maxW="280px"
                        textAlign="left"
                        fontSize={["12px", "16px"]}
                        whiteSpace="pre-wrap"
                        justifyContent="center"
                        textTransform="none"
                      >
                        {shopItem.desc}
                      </Text>
                    </VStack>
                  </HStack>
                </Button>
              );
            })}
        </SimpleGrid>
        <Box minH="60px" />
      </VStack>

      <Footer>
        <Button w={["full", "auto"]} onClick={onContinue}>
          Continue
        </Button>
        <Button
          w={["full", "auto"]}
          isLoading={isPending}
          isDisabled={
            !selectedShopItem || selectedShopItem.cost > playerEntity.cash
          }
          onClick={buy}
        >
          Buy
        </Button>
      </Footer>
    </Layout>
  );
}
