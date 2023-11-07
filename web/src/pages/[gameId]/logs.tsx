import Layout from "@/components/Layout";
import { Footer } from "@/components/Footer";

import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import {
  getDrugById,
  getDrugByType,
  getLocationById,
  getOutcomeInfo,
  getShopItem,
  getShopItemByType,
} from "@/dojo/helpers";
import { TradeDirection, usePlayerStore } from "@/hooks/state";
import { useSystems } from "@/dojo/hooks/useSystems";

import { HStack, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { formatCash } from "@/utils/ui";
import { Bag, Event } from "@/components/icons";
import { usePlayerLogs } from "@/dojo/queries/usePlayerLogs";
import { WorldEvents } from "@/dojo/generated/contractEvents";
import {
  AdverseEventData,
  BoughtEventData,
  BoughtItemEventData,
  GameOverEventData,
  SoldEventData,
  TraveledEventData,
} from "@/dojo/events";

export default function Logs() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const playerId = router.query.playerId as string;

  const { account, playerEntityStore } = useDojoContext();
  const { playerEntity } = playerEntityStore;

  const { playerLogs } = usePlayerLogs({ gameId, playerId: playerId || account?.address });

  if (!playerLogs) {
    return <></>;
  }

  return (
    <Layout
      leftPanelProps={{
        prefixTitle: "",
        title: `Hustler Logs`,
        imageSrc: "/images/will-smith-with-attitude.png",
      }}
      footer={
        <Footer>
          <Button onClick={() => router.back()}>
            Back
          </Button>
          </Footer>
      }
    >
      <VStack h="full" w="full">
        <UnorderedList listStyleType="none" w="full">
          {playerLogs.parsedLogs &&
            playerLogs.parsedLogs.map((i) => {
              if (
                [WorldEvents.Consequence, WorldEvents.Decision, WorldEvents.AtPawnshop].includes(i.parsed.eventType)
              ) {
                return;
              }

              return (
                <ListItem key={`key-${i}`} py="6px" mt={i.parsed.eventType === WorldEvents.Traveled ? "20px" : "0"}>
                  <HStack fontSize="12px">
                    <Text pr="10px">{i.log.node?.created_at}</Text>
                    <Text>{i.parsed.eventName}</Text>

                    {i.parsed.eventType === WorldEvents.AdverseEvent && (
                      <Text>{(i.parsed as AdverseEventData).playerStatus}</Text>
                    )}
                    {i.parsed.eventType === WorldEvents.Traveled && (
                      <Text>
                        to {(i.parsed as TraveledEventData).toLocation} ( DAY {(i.parsed as TraveledEventData).turn})
                      </Text>
                    )}

                    {i.parsed.eventType === WorldEvents.GameOver && (
                      <Text>$ {(i.parsed as GameOverEventData).cash} </Text>
                    )}

                    {i.parsed.eventType === WorldEvents.Bought && (
                      <Text>
                        x {(i.parsed as BoughtEventData).quantity}{" "}
                        {getDrugByType(Number((i.parsed as BoughtEventData).drugId))?.name}
                      </Text>
                    )}
                    {i.parsed.eventType === WorldEvents.Sold && (
                      <Text>
                        x {(i.parsed as SoldEventData).quantity}{" "}
                        {getDrugByType(Number((i.parsed as SoldEventData).drugId))?.name}
                      </Text>
                    )}
                    {i.parsed.eventType === WorldEvents.BoughtItem && (
                      <Text>
                        +{" "}
                        {
                          getShopItemByType(
                            Number((i.parsed as BoughtItemEventData).itemId),
                            Number((i.parsed as BoughtItemEventData).level),
                          )?.icon.name
                        }
                      </Text>
                    )}
                  </HStack>
                </ListItem>
              );
            })}
        </UnorderedList>
      </VStack>
    </Layout>
  );
}
