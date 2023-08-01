import { ReactNode, useCallback, useEffect, useState } from "react";
import { Box, Text, VStack, HStack, Card, Button } from "@chakra-ui/react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { Alert, ArrowEnclosed, Cart } from "@/components/icons";
import Image from "next/image";
import { Footer } from "@/components/Footer";
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
import { Sounds, playSound } from "@/hooks/sound";
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
import { useSystems } from "@/hooks/dojo/systems/useSystems";
import { calculateMaxQuantity, calculateSlippage } from "@/utils/market";
import { useToast } from "@/hooks/toast";
import { useDojo } from "@/hooks/dojo";

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

  const { account } = useDojo();

  const { location: locationEntity } = useLocationEntity({
    gameId,
    locationName: location.name,
  });
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });

  const { toast } = useToast();

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

  const { buy, sell, isPending, error: txError } = useSystems();
  const { addTrade } = usePlayerState();

  const onTrade = useCallback(async () => {
    playSound(Sounds.Trade);

    router.push(`/${gameId}/${location.slug}`);

    let toastMessage = "",
      hash = "",
      quantity;

    if (tradeDirection === TradeDirection.Buy) {
      ({ hash } = await buy(gameId, location.name, drug.name, quantityBuy));
      toastMessage = `You bought ${quantityBuy} ${drug.name}`;
      quantity = quantityBuy;
    } else if (tradeDirection === TradeDirection.Sell) {
      ({ hash } = await sell(gameId, location.name, drug.name, quantitySell));
      toastMessage = `You sold ${quantitySell} ${drug.name}`;
      quantity = quantitySell;
    }

    addTrade(drug.name, {
      direction: tradeDirection,
      quantity,
    } as TradeType);

    toast(toastMessage, Cart, `http://amazing_explorer/${hash}`);
  }, [
    tradeDirection,
    quantityBuy,
    quantitySell,
    gameId,
    location,
    drug,
    router,
    buy,
    sell,
    toast,
    addTrade,
  ]);

  if (!playerEntity || !drug || !market) return <></>;

  return (
    <Layout
      title={drug.name}
      prefixTitle="The market"
      imageSrc="/images/dealer.png"
      showBack={true}
    >
      <VStack
        w="full"
        sx={{
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Card variant="pixelated" p={6} mb={6} _hover={{}} align="center">
          <Box position="relative" my={6} w={[180, 240]} h={[180, 240]}>
            <Image
              src={`/images/drugs/${drug.slug}.png`}
              alt={drug.name}
              fill={true}
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
          <TabPanels>
            <TabPanel>
              {canBuy ? (
                <QuantitySelector
                  drug={drug}
                  player={playerEntity}
                  market={market}
                  type={TradeDirection.Buy}
                  onChange={setQuantityBuy}
                />
              ) : (
                <AlertMessage message="You can't afford this" />
              )}
            </TabPanel>
            <TabPanel>
              {canSell ? (
                <QuantitySelector
                  drug={drug}
                  player={playerEntity}
                  market={market}
                  type={TradeDirection.Sell}
                  onChange={setQuantitySell}
                />
              ) : (
                <Box>
                  <AlertMessage message={`You have no ${drug.name} to sell`} />
                </Box>
              )}
            </TabPanel>
          </TabPanels>
          <Box h="40px" />
        </Tabs>
      </VStack>
      <Footer>
        <Button
          w={["full", "auto"]}
          isLoading={isPending && !txError}
          onClick={onTrade}
          display={
            (tradeDirection === TradeDirection.Buy && canBuy) ||
            (tradeDirection === TradeDirection.Sell && canSell)
              ? "flex"
              : "none"
          }
        >
          {tradeDirection === TradeDirection.Buy
            ? `Buy (${quantityBuy})`
            : `Sell (${quantitySell})`}
        </Button>
      </Footer>
    </Layout>
  );
}

const QuantitySelector = ({
  type,
  player,
  drug,
  market,
  onChange,
}: {
  type: TradeDirection;
  drug: DrugProps;
  player: PlayerEntity;
  market: DrugMarket;
  onChange: (quantity: number, newPrice: number) => void;
}) => {
  const [totalPrice, setTotalPrice] = useState<number>(market.price);
  const [priceImpact, setPriceImpact] = useState<number>(0);
  const [alertColor, setAlertColor] = useState<string>("neon.500");
  const [quantity, setQuantity] = useState(1);
  const [max, setMax] = useState(0);

  useEffect(() => {
    if (type === TradeDirection.Buy) {
      setMax(calculateMaxQuantity(market.marketPool, player.cash));
    } else if (type === TradeDirection.Sell) {
      const playerQuantity = player.drugs.find(
        (d) => d.name === drug.name,
      )?.quantity;
      setMax(playerQuantity || 0);
    }
  }, [type, drug, player, market]);

  useEffect(() => {
    const slippage = calculateSlippage(market.marketPool, quantity, type);

    if (slippage.priceImpact > 0.2) {
      // >20%
      setAlertColor("red");
    } else if (slippage.priceImpact > 0.05) {
      // >5%
      setAlertColor("neon.200");
    } else {
      setAlertColor("neon.500");
    }

    setPriceImpact(slippage.priceImpact);
    setTotalPrice(quantity * slippage.newPrice);
    onChange(quantity, slippage.newPrice);
  }, [quantity, market, type, onChange]);

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
        <VStack align="flex-start">
          <Text textStyle="subheading" fontSize="13px">
            ({quantity}) for {formatCash(totalPrice)}
          </Text>
          <Text color={alertColor}>
            <Alert size="sm" /> {(priceImpact * 100).toFixed(2)}% slippage
            (estimate)
          </Text>
        </VStack>

        <HStack gap="8px" textStyle="subheading" fontSize="13px">
          <Text textDecoration="underline" cursor="pointer" onClick={on50}>
            50%
          </Text>
          <Text textDecoration="underline" cursor="pointer" onClick={onMax}>
            MAX
          </Text>
        </HStack>
      </HStack>

      <HStack w="100%" py={2} gap="10px">
        <ArrowEnclosed
          direction="down"
          size="lg"
          cursor="pointer"
          onClick={onDown}
          color="neon.500"
          _hover={{
            color: "neon.300",
          }}
        />
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
        <ArrowEnclosed
          direction="up"
          size="lg"
          cursor="pointer"
          onClick={onUp}
          color="neon.500"
          _hover={{
            color: "neon.300",
          }}
        />
      </HStack>
    </VStack>
  );
};
