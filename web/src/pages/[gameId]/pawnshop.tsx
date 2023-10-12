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
import { Trenchcoat, Kevlar, Kicks, Glock, Knife, Uzi } from "@/components/icons/items";
import { Truck } from "@/components/icons/Truck";

export const descByType = {
  "Attack": "* Gives you some extra firepower *",
  "Transport" : "* Allows you to carry more product *",
  "Defense" : "* Allows you to absorb some damage *",
  "Speed" : "* Allows you to escape more easily *",
}

export const iconByTypeAndLevel = {
  "Attack": {
    1:Knife,
    2:Glock,
    3:Uzi,
  },
  "Transport" : {
    1:Trenchcoat,
    2:Truck,
    3:Trenchcoat,
  },
  "Defense" :{
    1:Kevlar,
    2:Kevlar,
    3:Kevlar,
  },
  "Speed" : {
    1:Kicks,
    2:Kicks,
    3:Kicks,
  },
}

export default function PawnShop() {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const { account } = useDojoContext();
  const { buyItem, dropItem, getAvailableItems } = useSystems();
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });

  const { toast } = useToast();

  const [selectedShopItem, setSelectedShopItem] = useState<ShopItemInfo>(null);
  const [availableItems, setAvailableItems] = useState<ShopItemInfo[]>([]);

  useEffect(() => {
const update = async()=> {
  const {items} = (await getAvailableItems(gameId)) || []
  const shopItems = items.map(i => ({
    desc: descByType[i.item_type],
    icon: iconByTypeAndLevel[i.item_type][i.level],
    ...i
  }))
  setAvailableItems(shopItems)
}

if(gameId){
  update();
}

  }, [gameId])

  const selectItem = (shopItem: ShopItemInfo) => {
    // do checks
    if (selectedShopItem === shopItem) {
      setSelectedShopItem(null);
    } else {
      setSelectedShopItem(shopItem);
    }
  };

  const buy = async () => {
    if (!selectedShopItem) return

      const { hash } = await buyItem(gameId, selectedShopItem.item_id);
      toast(
        "Was it a wise choice...",
        Alert,
        `http://amazing_explorer/${hash}`,
      );
      router.push(`/${gameId}/travel`);
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
        <HStack>
          </HStack>
          {availableItems && availableItems.map((shopItem, index) => {
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
                  <Box>{shopItem.icon({ width: "56px", height: "56px" })}</Box>
                  <VStack w="full" w="300px" alignItems="flex-start">
                    <HStack w="full" justifyContent="space-between">
                      <Text
                        textStyle="heading"
                        textTransform="uppercase"
                        fontSize={["16px", "20px"]}
                      >
                        {shopItem.name}
                      </Text>
                      <Text fontSize={["16px", "20px"]}>${shopItem.cost}</Text>
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
        <Button w={["full", "auto"]} onClick={()=> {
          router.push( `/${gameId}/travel`)
        }}>Continue</Button>
        <Button
          w={["full", "auto"]}
          isDisabled={!selectedShopItem || selectedShopItem.cost > playerEntity.cash}
          onClick={buy}
        >
          Buy
        </Button>
      </Footer>
    </Layout>
  );
}
