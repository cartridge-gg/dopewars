import {
  Divider,
  HStack,
  StyleProps,
  Text,
  VStack,
  Card,
} from "@chakra-ui/react";

import React from "react";
import { usePlayerEntity } from "@/dojo/entities/usePlayerEntity";
import { useRouter } from "next/router";
import { useDojo } from "@/dojo";
import { getDrugById } from "@/dojo/helpers";

export const Inventory = ({ ...props }: StyleProps) => {
  const router = useRouter();
  const { gameId } = router.query as { gameId: string };
  const { account } = useDojo();
  const { player: playerEntity, isFetched: isFetchedPlayer } = usePlayerEntity({
    gameId,
    address: account?.address,
  });

  return (
    <VStack {...props} w="full" align="flex-start">
      <Text textStyle="subheading" fontSize="10px" color="neon.500">
        Inventory
      </Text>
      <Card
        w="full"
        h="40px"
        px="20px"
        justify="center"
        sx={{
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <HStack gap="5px" justify="center">
          {playerEntity?.drugCount === 0 ? (
            <Text color="neon.500">Your bag is empty</Text>
          ) : (
            playerEntity?.drugs.map((drug) => {
              return (
                drug.quantity > 0 && (
                  <>
                    <HStack gap="10px">
                      <HStack color="yellow.400">
                        {getDrugById(drug.id).icon({ boxSize: "26" })}
                        <Text>{drug.quantity}</Text>
                      </HStack>
                    </HStack>
                    <Divider
                      _last={{ display: "none" }}
                      h="10px"
                      orientation="vertical"
                      borderWidth="1px"
                      borderColor="neon.600"
                    />
                  </>
                )
              );
            })
          )}
        </HStack>
      </Card>
    </VStack>
  );
};
