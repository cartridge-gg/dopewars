import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Spacer,
  Divider,
  Card,
  CardBody,
} from "@chakra-ui/react";
import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import Content from "@/components/Content";
import { Footer } from "@/components/Footer";
import { ArrowEnclosed, Cart } from "@/components/icons";
import Image from "next/image";
import { DrugProps, getDrugBySlug, getLocationBySlug } from "@/hooks/ui";

import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from "@chakra-ui/react";

import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
} from "@chakra-ui/react";
import { Sounds } from "@/hooks/sound";
import { TradeDirection, TradeType, usePlayerState } from "@/hooks/state";
import AlertMessage from "@/components/AlertMessage";
import { cardPixelatedStyle } from "@/theme/styles";
import {
  DrugMarket,
  useLocationEntity,
} from "@/hooks/dojo/entities/useLocationEntity";
import {
  PlayerEntity,
  usePlayerEntity,
} from "@/hooks/dojo/entities/usePlayerEntity";
import { formatQuantity, formatCash } from "@/utils/ui";
import { useRyoSystems } from "@/hooks/dojo/systems/useRyoSystems";

export default function Market() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const location = getLocationBySlug(router.query.locationSlug as string);
  const drug = getDrugBySlug(router.query.drugSlug as string);

  const [market, setMarket] = useState<DrugMarket>();
  const [tradeDirection, setTradeDirection] = useState(TradeDirection.Buy);

  const [quantityBuy, setQuantityBuy] = useState(1);
  const [quantitySell, setQuantitySell] = useState(1);

  const [canSell, setCanSell] = useState(false);
  const [canBuy, setCanBuy] = useState(false);

  const isBagFull = false;

  const { location: locationEntity } = useLocationEntity({
    gameId,
    locationName: location.name,
  });
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: process.env.NEXT_PUBLIC_PLAYER_ADDRESS!,
  });

  // market price and quantity can fluctuate as players trade
  useEffect(() => {
    if (!locationEntity || !playerEntity) return;

    const market = locationEntity.drugMarkets.find((d) => d.name === drug.name);
    if (!market) return;

    const playerDrug = playerEntity.drugs.find((d) => d.name === drug.name);
    if (playerDrug) {
      setCanSell(playerDrug.quantity > 0);
    }

    setCanBuy(playerEntity.cash > market.price);
    setMarket(market);
  }, [locationEntity, playerEntity, drug]);

  const onTabsChange = (index: number) => {
    setTradeDirection(index as TradeDirection);
  };

  const { buy, sell, isPending, error: txError } = useRyoSystems();
  const { addTrade } = usePlayerState();

  const onTrade = useCallback(async () => {
    if (tradeDirection === TradeDirection.Buy) {
      await buy(gameId, location.name, drug.name, quantityBuy);
    } else if (tradeDirection === TradeDirection.Sell) {
      await sell(gameId, location.name, drug.name, quantitySell);
    }

    const quantity =
      tradeDirection === TradeDirection.Buy ? quantityBuy : quantitySell;
    addTrade(drug.name, {
      direction: tradeDirection,
      quantity,
    } as TradeType);

    router.push(`/${gameId}/${location.slug}`);
  }, [
    tradeDirection,
    quantityBuy,
    quantitySell,
    gameId,
    location,
    drug,
    router,
    sell,
    addTrade,
  ]);

  if (!playerEntity || !drug || !market) return <></>;

  return (
    <Layout
      title={drug.name}
      prefixTitle="The market"
      headerImage="/images/dealer.png"
    >
      <Content>
        <VStack w="100%" h="100%">
          <Card variant="pixelated" p={6} mb={6} _hover={{}}>
            <VStack w="full">
              <Box position="relative" my={6} w={[180, 240]} h={[180, 240]}>
                <Image
                  src={`/images/drugs/${drug.slug}.png`}
                  alt={drug.name}
                  fill={true}
                  objectFit="contain"
                  style={{ margin: "auto" }}
                />
              </Box>
              <HStack w="100%" justifyContent="space-between" fontSize="16px">
                <HStack>
                  {drug.icon({ boxSize: "36px" })}
                  <Text>{formatCash(market.price)}</Text>
                </HStack>
                <HStack>
                  <Cart mr={1} size="lg" />
                  <Text>{formatQuantity(market.marketPool.quantity)}</Text>
                </HStack>
              </HStack>
            </VStack>
          </Card>

          <Tabs
            w="100%"
            isFitted
            variant="unstyled"
            index={tradeDirection}
            onChange={onTabsChange}
          >
            <TabList>
              <Tab>BUY</Tab>
              <Tab>SELL</Tab>
            </TabList>

            <TabPanels mt={6}>
              <TabPanel>
                {!isBagFull && (
                  <QuantitySelector
                    drug={drug}
                    player={playerEntity}
                    marketPrice={market.price}
                    marketQuantity={market.marketPool.quantity}
                    type={TradeDirection.Buy}
                    onChange={setQuantityBuy}
                  />
                )}

                {!canBuy && <AlertMessage message="YOU ARE BROKE" />}
                {isBagFull && <AlertMessage message="YOUR BAG IS FULL" />}
              </TabPanel>
              <TabPanel>
                {canSell ? (
                  <QuantitySelector
                    drug={drug}
                    player={playerEntity}
                    marketPrice={market.price}
                    marketQuantity={market.marketPool.quantity}
                    type={TradeDirection.Sell}
                    onChange={setQuantitySell}
                  />
                ) : (
                  <Box>
                    <AlertMessage
                      textTransform="uppercase"
                      message={`YOU HAVE NO ${drug.name} TO SELL`}
                    />
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Content>
      <Footer>
        {tradeDirection === TradeDirection.Buy && canBuy && (
          <Button
            w={["50%", "auto"]}
            isLoading={isPending && !txError}
            onClick={onTrade}
          >
            Buy ({quantityBuy})
          </Button>
        )}
        {tradeDirection === TradeDirection.Sell && canSell && (
          <Button
            w={["50%", "auto"]}
            isLoading={isPending && !txError}
            onClick={onTrade}
          >
            Sell ({quantitySell})
          </Button>
        )}
      </Footer>
    </Layout>
  );
}

const QuantitySelector = ({
  type,
  player,
  drug,
  marketPrice,
  marketQuantity,
  onChange,
}: {
  type: TradeDirection;
  drug: DrugProps;
  player: PlayerEntity;
  marketPrice: number;
  marketQuantity: number;
  onChange: (quantity: number) => void;
}) => {
  const [totalPrice, setTotalPrice] = useState<number>(marketPrice);
  const [quantity, setQuantity] = useState(1);
  const [max, setMax] = useState(0);

  useEffect(() => {
    if (type === TradeDirection.Buy) {
      setMax(Math.floor(player.cash / marketPrice));
    } else if (type === TradeDirection.Sell) {
      const playerQuantity = player.drugs.find(
        (d) => d.name === drug.name,
      )?.quantity;
      setMax(playerQuantity || 0);
    }
  }, [type, drug, marketQuantity, player, marketPrice]);

  useEffect(() => {
    setTotalPrice(quantity * marketPrice);
    onChange(quantity);
  }, [quantity, marketPrice, onChange]);

  const onDown = useCallback(() => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }, [quantity]);

  const onUp = useCallback(() => {
    if (quantity < max) {
      setQuantity(quantity + 1);
    }
  }, [quantity, max]);

  const onSlider = useCallback((value: number) => {
    setQuantity(value);
  }, []);

  const onMax = useCallback(() => {
    setQuantity(max);
  }, [max]);

  const on50 = useCallback(() => {
    setQuantity(Math.max(1, Math.floor(max / 2)));
  }, [max]);

  return (
    <VStack
      opacity={max === 0 ? "0.2" : "1"}
      pointerEvents={max === 0 ? "none" : "all"}
    >
      <HStack w="100%" justifyContent="space-between">
        <Text>
          {quantity} for {formatCash(totalPrice)}
        </Text>

        <HStack gap="8px">
          <Text textDecoration="underline" cursor="pointer" onClick={on50}>
            50%
          </Text>
          <Text textDecoration="underline" cursor="pointer" onClick={onMax}>
            MAX
          </Text>
        </HStack>
      </HStack>

      <HStack w="100%">
        <Box
          cursor="pointer"
          onClick={onDown}
          color="neon.500"
          _hover={{
            color: "neon.300",
          }}
          p={2}
        >
          <ArrowEnclosed direction="down" size="lg" />
        </Box>

        <Slider
          aria-label="slider-quantity"
          w="100%"
          min={1}
          max={max}
          step={1}
          defaultValue={1}
          value={quantity}
          onChange={onSlider}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
        </Slider>

        <Box
          cursor="pointer"
          onClick={onUp}
          color="neon.500"
          _hover={{
            color: "neon.300",
          }}
          p={2}
        >
          <ArrowEnclosed direction="up" size="lg" />
        </Box>
      </HStack>
    </VStack>
  );
};
