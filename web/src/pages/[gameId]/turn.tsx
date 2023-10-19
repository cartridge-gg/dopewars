import { Footer } from "@/components/Footer";
import { Bag, Event } from "@/components/icons";
import Layout from "@/components/Layout";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { useGameEntity } from "@/dojo/queries/useGameEntity";
import { usePlayerEntity } from "@/dojo/queries/usePlayerEntity";
import { getDrugByType, getLocationById, getOutcomeInfo } from "@/dojo/helpers";
import { TradeDirection, usePlayerStore } from "@/hooks/state";
import { useSystems } from "@/dojo/hooks/useSystems";

import {
  HStack,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { useAvailableShopItems } from "@/dojo/hooks/useAvailableShopItems";
import { formatCash } from "@/utils/ui";
import Image from "next/image";

export default function Turn() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { account } = useDojoContext();
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });
  const { game: gameEntity } = useGameEntity({
    gameId,
  });

  const { availableShopItems } = useAvailableShopItems(gameId);
  const { trades, lastEncounter, resetTurn } = usePlayerStore();

  if (
    !playerEntity ||
    !gameEntity ||
    playerEntity.turn === playerEntity.maxTurns
  ) {
    return <></>;
  }

  return (
    <Layout
      leftPanelProps={{
        prefixTitle: "End of",
        title: `Day ${playerEntity.turn}`,
        imageSrc: "/images/sunset.png",
      }}
    >
      <VStack w="full" my={["none", "auto"]}>
        {trades.size > 0 && (
          <VStack w="full">
            <Product
              product="Product"
              quantity="Qty"
              total="Value"
              icon={undefined}
              isHeader
            />
            <UnorderedList w="full" variant="underline">
              {Array.from(trades).map(([drug, trade]) => {
                const change =
                  trade.direction === TradeDirection.Buy ? "+" : "-";
                const drugInfo = getDrugByType(drug)!;
                return (
                  <ListItem key={drug}>
                    <Product
                      icon={drugInfo.icon}
                      product={drugInfo.name}
                      quantity={`${change}${trade.quantity}`}
                      total={formatCash(Math.abs(trade.total))}
                    />
                  </ListItem>
                );
              })}
            </UnorderedList>
          </VStack>
        )}
        <VStack w="full" pt="20px" align="flex-start">
          <Text fontFamily="broken-console" fontSize="10px" color="neon.500">
            Travel To
          </Text>
          <UnorderedList w="full" variant="underline">
            <ListItem>
              <HStack>
                {getLocationById(playerEntity.locationId)?.icon({})}
                <Text>{getLocationById(playerEntity.locationId)?.name}</Text>
              </HStack>
            </ListItem>
            {lastEncounter && (
              <ListItem>
                <HStack
                  color={
                    getOutcomeInfo(lastEncounter.status, lastEncounter.outcome)
                      .color
                  }
                >
                  <HStack flex="1">
                    <Event />
                    <Text>
                      {
                        getOutcomeInfo(
                          lastEncounter.status,
                          lastEncounter.outcome,
                        ).name
                      }
                    </Text>
                  </HStack>
                  <Text flex="1">
                    {
                      getOutcomeInfo(
                        lastEncounter.status,
                        lastEncounter.outcome,
                      ).description
                    }
                  </Text>
                </HStack>
              </ListItem>
            )}
          </UnorderedList>
        </VStack>
        <Footer position={["absolute", "relative"]}>
          <VStack w="full" mt="20px">
            <HStack mb="20px">
              {availableShopItems && availableShopItems.length > 0 && (
                <Button
                  onClick={() => {
                    router.push(`/${gameId}/pawnshop`);
                  }}
                  h="100px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  leftIcon={
                    <Image src="/images/pawnshop.png" width={60} height={60} />
                  }
                >
                  <Text>Visit Pawnshop</Text>
                </Button>
              )}
            </HStack>
            <HStack gap="20px">
              <Button
                w={["full", "auto"]}
                onClick={() => {
                  resetTurn();
                  router.push(
                    `/${gameId}/${
                      getLocationById(playerEntity.locationId)?.slug
                    }`,
                  );
                }}
              >
                Continue
              </Button>
            </HStack>
          </VStack>
        </Footer>
      </VStack>
    </Layout>
  );
}

const Product = ({
  icon,
  product,
  quantity,
  total,
  isHeader,
}: {
  icon: React.FC | undefined;
  product: string;
  quantity: number | string;
  total: number | string;
  isHeader?: boolean;
}) => {
  const header = isHeader && {
    fontFamily: "broken-console",
    fontSize: "10px",
    color: "neon.500",
  };

  return (
    <HStack w="full" {...header}>
      <HStack flex="4">
        {icon && icon({ boxSize: "24px" })}
        <Text>{product}</Text>
      </HStack>

      <HStack flex="3" justify="right">
        <Text>{quantity}</Text>
      </HStack>

      <Text flex="3" textAlign="right">
        {total}
      </Text>
    </HStack>
  );
};
