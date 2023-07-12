import {
  Divider,
  HStack,
  StyleProps,
  Text,
  VStack,
  Box,
  Card,
} from "@chakra-ui/react";
import { Bag, IconProps } from "./icons";
import { Acid, Cocaine, Heroin, Ludes, Speed, Weed } from "./icons/drugs";
import { Drugs } from "@/hooks/state";
import { Component } from "react";
import React from "react";
import { usePlayerEntity } from "@/hooks/dojo/entities/usePlayerEntity";
import { useRouter } from "next/router";
import { getDrugByName } from "@/hooks/ui";

// const getItem = (inventory: InventoryType, drug: Drugs, icon: React.FC) => {
//   const quantity = inventory.drugs[drug].quantity;

//   return (
//     <HStack title={drug}>
//       {icon({
//         boxSize: "24px",
//         color: quantity > 0 ? "neon.100" : "neon.500",
//       })}
//       {quantity > 0 && <Text>{quantity}</Text>}
//     </HStack>
//   );
// };

export const Inventory = ({ ...props }: StyleProps) => {
  const router = useRouter();
  const { gameId } = router.query as { gameId: string };
  const { player: playerEntity, isFetched: isFetchedPlayer } = usePlayerEntity({
    gameId,
    address: process.env.NEXT_PUBLIC_PLAYER_ADDRESS!,
  });

  return (
    <VStack {...props} w="full" align="flex-start">
      <Text textStyle="subheading" fontSize="10px" color="neon.500">
        Inventory
      </Text>
      <Card
        w="full"
        h="50px"
        px="20px"
        justify="center"
        variant="pixelated"
        sx={{
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <HStack gap="10px">
          {playerEntity?.drugs.map((drug, index) => {
            return (
              drug.quantity > 0 && (
                <>
                  <HStack color="yellow.400">
                    {getDrugByName(drug.name).icon({ boxSize: "26" })}
                    <Text>{drug.quantity}</Text>
                  </HStack>
                  {index < playerEntity.drugs.length - 1 && (
                    <HStack>
                      <Divider
                        h="10px"
                        orientation="vertical"
                        borderWidth="1px"
                        borderColor="neon.600"
                      />
                    </HStack>
                  )}
                </>
              )
            );
          })}
        </HStack>
      </Card>
    </VStack>
  );
};
