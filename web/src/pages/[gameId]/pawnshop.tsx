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
import { usePlayerEntity } from "@/dojo/queries/usePlayerEntity";
import { playSound, Sounds } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";

import { Truck } from "@/components/icons/Truck";
import { useGameEntity } from "@/dojo/queries/useGameEntity";
import { getLocationById, getLocationByType, getShopItem } from "@/dojo/helpers";
import { useAvailableShopItems } from "@/dojo/hooks/useAvailableShopItems";


export default function PawnShop() {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const { account } = useDojoContext();
  const { buyItem, dropItem, isPending } = useSystems();
  const { availableShopItems } = useAvailableShopItems(gameId);
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });
  const { game: gameEntity } = useGameEntity({
    gameId,
  });

  const { toast } = useToast();

  const [selectedShopItem, setSelectedShopItem] = useState<ShopItemInfo| undefined>(undefined);

  const selectItem = (shopItem: ShopItemInfo) => {
    // do checks
    if (selectedShopItem === shopItem) {
      setSelectedShopItem(undefined);
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
      const { hash } = await buyItem(gameId, selectedShopItem.type);
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

  if(!playerEntity || !gameEntity){
    return null
  }

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
        <VStack w="full">
        <Text>You can buy an item, or not...</Text>
        <Text fontSize="12px">Max items : {playerEntity && playerEntity.maxItems}</Text>
        </VStack>

        <SimpleGrid
          columns={1}
          w="full"
          maxW="420px"
          margin="auto"
          gap={["10px", "16px"]}
          fontSize={["16px", "20px"]}
        >
         
          {availableShopItems &&
            availableShopItems.map((shopItem, index) => {
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
            !selectedShopItem || selectedShopItem.cost > playerEntity.cash || (
              playerEntity?.items.length === playerEntity?.maxItems && !playerEntity?.items.find(i => i.id === selectedShopItem.id)
              )
          }
          onClick={buy}
        >
          Buy
        </Button>
      </Footer>
     </Layout>
  );
}
