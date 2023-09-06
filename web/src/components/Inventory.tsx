import {
  Divider,
  HStack,
  StyleProps,
  Text,
  VStack,
  Card,
} from "@chakra-ui/react";

import React from "react";
import { usePlayerEntity } from "@/hooks/dojo/entities/usePlayerEntity";
import { useRouter } from "next/router";
import { getDrugById } from "@/hooks/ui";
import { useDojo } from "@/hooks/dojo";

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
        variant="pixelated"
        sx={{
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <HStack gap="10px" justify="center">
          {playerEntity?.drugs.length === 0 ? (
            <Text color="neon.500">Your bag is empty</Text>
          ) : (
            playerEntity?.drugs.map((drug, index) => {
              return (
                drug.quantity > 0 && (
                  <>
                    <HStack key={index} gap="10px">
                      <HStack color="yellow.400">
                        {getDrugById(drug.id).icon({ boxSize: "26" })}
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
                    </HStack>
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
