import { Footer } from "@/components/Footer";
import { Bag, Event } from "@/components/icons";
import Layout from "@/components/Layout";
import { useDojo } from "@/dojo";
import { useGameEntity } from "@/dojo/entities/useGameEntity";
import { usePlayerEntity } from "@/dojo/entities/usePlayerEntity";
import { getDrugByType, getLocationById, getOutcomeInfo } from "@/dojo/helpers";
import { TradeDirection, usePlayerStore } from "@/hooks/state";

import {
  HStack,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import { useEffect } from "react";

export default function Turn() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { account } = useDojo();
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });
  const { game: gameEntity } = useGameEntity({
    gameId,
  });

  const { trades, lastEncounter, resetTurn } = usePlayerStore();

  useEffect(() => {
    if (gameEntity && playerEntity) {
      // initial move, just forward user to location
      if (gameEntity.maxTurns - playerEntity.turnsRemaining === 0) {
        router.push(
          `/${gameId}/${getLocationById(playerEntity.locationId)?.slug}`,
        );
      }
    }
  }, [gameEntity, playerEntity]);

  if (!playerEntity || !gameEntity) {
    return <></>;
  }

  if (gameEntity.maxTurns - playerEntity.turnsRemaining === 0) {
    return <></>;
  }

  return (
    <Layout
      leftPanelProps={{
        prefixTitle: "End of",
        title: `Day ${gameEntity.maxTurns - playerEntity.turnsRemaining}`,
        imageSrc: "/images/sunset.png",
      }}
    >
      <VStack w="full" my={["none", "auto"]}>
        {trades.size > 0 && (
          <VStack w="full">
            <Product
              product="Product"
              quantity="Qty"
              cost="Value"
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
                      cost={"$$$"}
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
          <Button
            w={["full", "auto"]}
            onClick={() => {
              resetTurn();
              router.push(
                `/${gameId}/${getLocationById(playerEntity.locationId)?.slug}`,
              );
            }}
          >
            Continue
          </Button>
        </Footer>
      </VStack>
    </Layout>
  );
}

const Product = ({
  icon,
  product,
  quantity,
  cost,
  isHeader,
}: {
  icon: React.FC | undefined;
  product: string;
  quantity: number | string;
  cost: number | string;
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
      <Text flex="3" textAlign="right">
        {cost}
      </Text>
      <HStack flex="3" justify="right">
        <Bag />
        <Text>{quantity}</Text>
      </HStack>
    </HStack>
  );
};
