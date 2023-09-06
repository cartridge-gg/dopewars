import { Footer } from "@/components/Footer";
import { Bag, Event } from "@/components/icons";
import Layout from "@/components/Layout";
import { useDojo } from "@/hooks/dojo";
import { useGameEntity } from "@/hooks/dojo/entities/useGameEntity";
import { usePlayerEntity } from "@/hooks/dojo/entities/usePlayerEntity";
import { TradeDirection, usePlayerState } from "@/hooks/state";

import { getDrugById, getEventByName, getLocationById } from "@/hooks/ui";
import {
  Box,
  Button,
  HStack,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

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

  const { trades, events, clearState } = usePlayerState();

  if (!playerEntity || !gameEntty) {
    return <></>;
  }

  return (
    <Layout
      title={`Day ${gameEntty.maxTurns - playerEntity.turnsRemaining}`}
      prefixTitle="End of"
      imageSrc="/images/sunset.png"
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
                return (
                  <ListItem key={drug}>
                    <Product
                      icon={getDrugById(drug).icon}
                      product={drug}
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
                {getLocationById(playerEntity.locationId).icon({})}
                <Text>{getLocationById(playerEntity.locationId).name}</Text>
              </HStack>
            </ListItem>
            {events.map((event, index) => (
              <ListItem key={index}>
                <HStack>
                  <HStack flex="1">
                    <Event />
                    <Text>{event}</Text>
                  </HStack>
                  <Text flex="2" color="yellow.400">
                    {getEventByName(event).description}
                  </Text>
                </HStack>
              </ListItem>
            ))}
            ;
          </UnorderedList>
        </VStack>
        <Footer position={["absolute", "relative"]}>
          <Button
            w={["full", "auto"]}
            onClick={() => {
              clearState();
              router.push(
                `/${gameId}/${getLocationById(playerEntity.locationId).slug})}`,
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
