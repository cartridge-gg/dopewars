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

export default function Turn() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { account } = useDojo();
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });
  const { game: gameEntty } = useGameEntity({
    gameId,
  });

  const { trades, lastEncounter, resetTurn } = usePlayerStore();

  if (!playerEntity || !gameEntty) {
    return <></>;
  }

  const locationInfo = getLocationById(playerEntity.locationId)!;

  return (
    <Layout
      leftPanelProps={{
        title: `Day ${gameEntty.maxTurns - playerEntity.turnsRemaining}`,
        prefixTitle: "End of",
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
                {locationInfo.icon({})}
                <Text>{locationInfo.name}</Text>
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
              router.push(`/${gameId}/${locationInfo.slug}`);
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
