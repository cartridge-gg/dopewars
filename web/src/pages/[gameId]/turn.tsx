import Content from "@/components/Content";
import { Footer } from "@/components/Footer";
import { Bag, Event } from "@/components/icons";
import { Ludes, Weed } from "@/components/icons/drugs";
import { Manhattan } from "@/components/icons/locations";
import Layout from "@/components/Layout";
import { useGameEntity } from "@/hooks/dojo/entities/useGameEntity";
import { usePlayerEntity } from "@/hooks/dojo/entities/usePlayerEntity";
import { TradeDirection, usePlayerState } from "@/hooks/state";

import { getDrugByName, getEventByName, getLocationByName } from "@/hooks/ui";
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
import { ReactNode, useEffect } from "react";

export default function Turn() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: process.env.NEXT_PUBLIC_PLAYER_ADDRESS!,
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
      title={`Day 1`}
      prefixTitle="End of"
      headerImage="/images/sunset.png"
    >
      <Content gap="30px">
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
                      icon={getDrugByName(drug).icon}
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
        <VStack w="full">
          <HStack w="full">
            <Text fontFamily="broken-console" fontSize="10px" color="neon.500">
              Travel To
            </Text>
          </HStack>
          <UnorderedList w="full" variant="underline">
            <ListItem>
              <HStack>
                {getLocationByName(playerEntity.location_name).icon({})}
                <Text>{playerEntity.location_name}</Text>
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
      </Content>
      <Footer>
        <Button
          w={["full", "auto"]}
          onClick={() => {
            clearState();

            router.push(
              `/${gameId}/${
                getLocationByName(playerEntity.location_name).slug
              })}`,
            );
          }}
        >
          Continue
        </Button>
      </Footer>
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
