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
import { playSound, Sounds } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
import { Trenchcoat, Kevlar, Kicks, Glock } from "@/components/icons/items";

// TODO: retrieve form world
const shopItems: ShopItemInfo[] = [
  {
    type: ItemEnum.Attack,
    name: "Glock",
    desc: "* Gives you some extra firepower *",
    cost: "750",
    icon: Glock,
  },
  {
    type: ItemEnum.Transport,
    name: "Trenchcoat",
    desc: "* Allows you to carry more product *",
    cost: "750",
    icon: Trenchcoat,
  },
  {
    type: ItemEnum.Defense,
    name: "Kevlar",
    desc: "* Allows you to absorb some damage *",
    cost: "750",
    icon: Kevlar,
  },
  {
    type: ItemEnum.Speed,
    name: "Kicks",
    desc: "* Allows you to escape more easily *",
    cost: "750",
    icon: Kicks,
  },
];

export default function PawnShop() {
  const router = useRouter();

  const { account } = useDojoContext();
  const { buyItem, dropItem } = useSystems();

  const { toast } = useToast();

  const gameId = router.query.gameId as string;
  const [selectedShopItem, setSelectedShopItem] = useState<ShopItemInfo>(null);

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

      const { hash } = await buyItem(gameId, selectedShopItem.type);
    //   toast(
    //     "Created Game",
    //     Alert,
    //     `http://amazing_explorer/${hash}`,
    //   );
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
          {shopItems.map((shopItem, index) => {
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
                // color={shopItem === selectedShopItem ? "yellow.400 !important" : "neon:400"}
              >
                {/* <Card
                  w="full"
                  h={["auto", "100px"]}
                  key={index}
                  position="relative"
                  padding="16px"
                >
                  <CardBody w="full"> */}

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
                {/* </CardBody>
                </Card> */}
              </Button>
            );
          })}
        </SimpleGrid>
        <Box minH="60px" />
      </VStack>

      <Footer>
        <Button w={["full", "auto"]}>Continue</Button>
        <Button
          w={["full", "auto"]}
          isDisabled={!selectedShopItem}
          onClick={buy}
        >
          Buy
        </Button>
      </Footer>
    </Layout>
  );
}
