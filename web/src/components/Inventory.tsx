import {
  Divider,
  HStack,
  StyleProps,
  Text,
  VStack,
  Card,
  Tooltip,
  Spacer,
} from "@chakra-ui/react";

import BorderImage from "@/components/icons/BorderImage";
import colors from "@/theme/colors";

import React from "react";
import { usePlayerEntity } from "@/dojo/queries/usePlayerEntity";
import { useRouter } from "next/router";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { getDrugById, getShopItem } from "@/dojo/helpers";
import { Bag } from "./icons";


export const Inventory = ({ ...props }: StyleProps) => {
  const router = useRouter();
  const { gameId } = router.query as { gameId: string };
  const { account } = useDojoContext();
  const { player: playerEntity, isFetched: isFetchedPlayer } = usePlayerEntity({
    gameId,
    address: account?.address,
  });

  return (
    <VStack {...props} w="full" align="flex-start" pb="5px">
      <HStack w="full" justify={["flex-end", "space-between"]}>
        <Text
          textStyle="subheading"
          fontSize="10px"
          display={["none", "flex"]}
          color="neon.500"
        >
          Your Inventory
        </Text>
        <HStack color="yellow.400">
          <HStack gap="5px" justify="center">
            {playerEntity?.items.map((item) => {
              return (
                <>
                  <HStack gap="10px">
                  <Tooltip label={`${item.name} (+${item.value})`}>
                    <HStack color="yellow.400" >
                     <>
                     {getShopItem(item.id,item.level)?.icon({
                        boxSize: "26",
                      })} 
                     </>
                    </HStack>
                    </Tooltip>
                  </HStack>
                </>
              );
            })}
          </HStack>

          <Divider
            h="10px"
            mx="10px"
            orientation="vertical"
            borderWidth="1px"
            borderColor="neon.600"
          />

          <Bag />
          <Text>
            {playerEntity?.drugCount}/{playerEntity?.getTransport()}
          </Text>
        </HStack>
      </HStack>
      <Card
        w="full"
        h="40px"
        px="20px"
        justify="center"
        sx={{
          borderImageSource: `url("data:image/svg+xml,${BorderImage({
            color: colors.neon["700"].toString(),
          })}")`,
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
                        {getDrugById(drug.id)?.icon({ boxSize: "26" })}
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
