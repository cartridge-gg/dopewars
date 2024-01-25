import { Divider, HStack, StyleProps, Text, VStack, Card, Tooltip, Spacer } from "@chakra-ui/react";

import BorderImage from "@/components/icons/BorderImage";
import colors from "@/theme/colors";

import React from "react";
import { useRouter } from "next/router";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { getDrugById, getShopItem, getShopItemStatname } from "@/dojo/helpers";
import { Bag } from "./icons";
import { Ring } from "./icons/Ring";
import { usePlayerStore } from "@/hooks/player";

export const Inventory = ({ ...props }: StyleProps) => {
  const router = useRouter();
  const { gameId } = router.query as { gameId: string };
  const { account } = useDojoContext();

  const { playerEntity }= usePlayerStore()

  return (
    <VStack {...props} w="full" align="flex-start" pb="0" gap={[0, "6px"]}>
      <HStack w="full" justify={"space-between"}>
        {/* <HStack color={playerEntity?.items.length === 0 ? "neon.500" : "yellow.400"} justify="center">
          <Ring />
          <Text>
            {playerEntity?.items.length || 0}/{playerEntity?.maxItems}
          </Text>
        </HStack> */}

        <HStack color={playerEntity?.drugCount === 0 ? "neon.500" : "yellow.400"} justify="center">
          <Bag />
          <Text>
            {playerEntity?.drugCount}/{playerEntity?.getTransport()}
          </Text>
        </HStack>
      </HStack>

      <HStack w="full" flexWrap="wrap" justify="space-between">
        <Card h="40px" px="20px" justify="center">
          <HStack gap="10px" justify="flex-end">
            {playerEntity?.items.map((item, key) => {
              return (
                <>
                  <HStack gap="10px" key={`item-${key * 2}`}>
                    <Tooltip label={`${item.name} (+${item.value} ${getShopItemStatname(item.id)})`}>
                      <HStack color="yellow.400">
                        <>
                          {getShopItem(item.id, item.level)?.icon({
                            boxSize: "26",
                          })}
                        </>
                      </HStack>
                    </Tooltip>
                  </HStack>
                  <Divider
                    key={`item-${key * 2 + 1}`}
                    _last={{ display: "none" }}
                    h="10px"
                    orientation="vertical"
                    borderWidth="1px"
                    borderColor="neon.600"
                  />
                </>
              );
            })}
            {playerEntity?.items.length === 0 && <Text color="neon.500">No gear</Text>}
          </HStack>
        </Card>

        <Card h="40px" px="20px" justify="center">
          <HStack gap="10px" justify="flex-start">
            {playerEntity?.drugCount === 0 ? (
              <Text color="neon.500">No product</Text>
            ) : (
              playerEntity?.drugs.map((drug, key) => {
                return (
                  drug.quantity > 0 && (
                    <>
                      <HStack gap="10px" key={`item-${key * 2}`}>
                        <HStack color="yellow.400">
                          {getDrugById(drug.id)?.icon({ boxSize: "26" })}
                          <Text>{drug.quantity}</Text>
                        </HStack>
                      </HStack>
                      <Divider
                        key={`item-${key * 2 + 1}`}
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
      </HStack>
    </VStack>
  );
};
