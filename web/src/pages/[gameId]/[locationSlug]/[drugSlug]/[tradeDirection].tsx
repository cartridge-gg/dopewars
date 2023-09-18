import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Card,
  Button,
  Flex,
} from "@chakra-ui/react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { Alert, ArrowEnclosed, Cart } from "@/components/icons";
import Image from "next/image";
import { Footer } from "@/components/Footer";

import { Slider, SliderTrack, SliderFilledTrack } from "@chakra-ui/react";

import { Sounds, playSound } from "@/hooks/sound";
import { TradeDirection, TradeType, usePlayerStore } from "@/hooks/state";
import AlertMessage from "@/components/AlertMessage";
import { useLocationEntity } from "@/dojo/entities/useLocationEntity";
import { PlayerEntity, usePlayerEntity } from "@/dojo/entities/usePlayerEntity";
import { formatQuantity, formatCash } from "@/utils/ui";
import { useSystems } from "@/dojo/systems/useSystems";
import { calculateMaxQuantity, calculateSlippage } from "@/utils/market";
import { useToast } from "@/hooks/toast";
import { getDrugBySlug, getLocationBySlug } from "@/dojo/helpers";
import { DrugInfo, DrugMarket } from "@/dojo/types";
import { useDojo } from "@/dojo";
import { cardPixelatedStyle } from "@/theme/styles";

export default function Market() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const tradeDirection =
    (router.query.tradeDirection as string) === "buy"
      ? TradeDirection.Buy
      : TradeDirection.Sell;
  const location = getLocationBySlug(router.query.locationSlug as string);
  const drug = getDrugBySlug(router.query.drugSlug as string);

  const [market, setMarket] = useState<DrugMarket>();
  const [quantityBuy, setQuantityBuy] = useState(0);
  const [quantitySell, setQuantitySell] = useState(0);
  const [canSell, setCanSell] = useState(false);
  const [canBuy, setCanBuy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { buy, sell, error: txError } = useSystems();
  const { addTrade } = usePlayerStore();
  const { account } = useDojo();

  const { location: locationEntity } = useLocationEntity({
    gameId,
    locationId: location?.id,
  });
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });

  const { toast } = useToast();

  // market price and quantity can fluctuate as players trade
  useEffect(() => {
    if (!locationEntity || !playerEntity || isSubmitting) return;

    const market = locationEntity.drugMarkets.find((d) => d.id === drug?.id);
    if (!market) return;

    const playerDrug = playerEntity.drugs.find((d) => d.id === drug?.id);
    if (playerDrug) {
      setCanSell(playerDrug.quantity > 0);
    }

    setCanBuy(playerEntity.cash > market.price);
    setMarket(market);
  }, [locationEntity, playerEntity, drug, isSubmitting]);

  const onTrade = useCallback(async () => {
    setIsSubmitting(true);
    playSound(Sounds.Trade);

    router.push(`/${gameId}/${location!.slug}`);

    let toastMessage = "",
      hash = "",
      quantity;

    if (tradeDirection === TradeDirection.Buy) {
      ({ hash } = await buy(gameId, location!.name, drug!.name, quantityBuy));
      toastMessage = `You bought ${quantityBuy} ${drug!.name}`;
      quantity = quantityBuy;
    } else if (tradeDirection === TradeDirection.Sell) {
      ({ hash } = await sell(gameId, location!.name, drug!.name, quantitySell));
      toastMessage = `You sold ${quantitySell} ${drug!.name}`;
      quantity = quantitySell;
    }

    toast(toastMessage, Cart, `http://amazing_explorer/${hash}`);

    addTrade(drug!.type, {
      direction: tradeDirection,
      quantity,
    } as TradeType);
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

  if (!router.isReady || !playerEntity || !drug || !market) return <></>;

  return (
    <Layout
      leftPanelProps={{
        title: drug.name,
        prefixTitle: "The market",
        imageSrc: "/images/dealer.png",
      }}
      showBack={true}
    >
      <VStack boxSize="full" justify="center">
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
        {((tradeDirection == TradeDirection.Buy && canBuy) ||
          (tradeDirection == TradeDirection.Sell && canSell)) && (
          <QuantitySelector
            drug={drug}
            player={playerEntity}
            market={market}
            type={tradeDirection}
            onChange={(quantity, _) => {
              if (tradeDirection == TradeDirection.Buy) {
                setQuantityBuy(quantity);
              } else {
                setQuantitySell(quantity);
              }
            }}
          />
        )}

        {tradeDirection == TradeDirection.Buy && !canBuy && (
          <AlertMessage message="You can't afford this" />
        )}

        {tradeDirection == TradeDirection.Sell && !canSell && (
          <AlertMessage message={`You have no ${drug.name} to sell`} />
        )}

        <Footer alignItems={["flex-end", "flex-start"]}>
          {tradeDirection == TradeDirection.Buy && canBuy && (
            <Button
              w={["full", "auto"]}
              isLoading={isSubmitting && !txError}
              isDisabled={quantityBuy === 0}
              onClick={onTrade}
            >
              Buy ({quantityBuy})
            </Button>
          )}

          {tradeDirection == TradeDirection.Sell && canSell && (
            <Button
              w={["full", "auto"]}
              isLoading={isSubmitting && !txError}
              isDisabled={quantitySell === 0}
              onClick={onTrade}
            >
              Sell ({quantitySell})
            </Button>
          )}
        </Footer>
      </VStack>
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
  drug: DrugInfo;
  player: PlayerEntity;
  market: DrugMarket;
  onChange: (quantity: number, newPrice: number) => void;
}) => {
  const [totalPrice, setTotalPrice] = useState<number>(market.price);
  const [priceImpact, setPriceImpact] = useState<number>(0);
  const [alertColor, setAlertColor] = useState<string>("neon.500");
  const [quantity, setQuantity] = useState(0);
  const [max, setMax] = useState(0);

  useEffect(() => {
    if (type === TradeDirection.Buy) {
      let max_buyable = calculateMaxQuantity(market.marketPool, player.cash);
      let bag_space = player.bagLimit - player.drugCount;
      setMax(Math.min(max_buyable, bag_space));
    } else if (type === TradeDirection.Sell) {
      const playerQuantity = player.drugs.find(
        (d) => d.id === drug.id,
      )?.quantity;
      setMax(playerQuantity || 0);
      setQuantity(playerQuantity || 0);
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

  return (
    <VStack
      opacity={max === 0 ? "0.2" : "1"}
      pointerEvents={max === 0 ? "none" : "all"}
      w="full"
    >
      <Flex
        w="100%"
        direction={["column", "row"]}
        justifyContent="space-between"
        align="center"
        gap="20px"
      >
        <Text color={alertColor}>
          <Alert size="sm" />{" "}
          {priceImpact ? (priceImpact * 100).toFixed(2) : "0"}% slippage ($
          {totalPrice
            ? (totalPrice / quantity).toFixed(0)
            : market.price.toFixed(0)}{" "}
          per)
        </Text>
        <HStack fontSize="13px">
          <Text textStyle="subheading" color="neon.500">
            Total:
          </Text>
          <Text textStyle="subheading">
            {totalPrice ? formatCash(totalPrice) : "$0"}
          </Text>
        </HStack>
      </Flex>

      <HStack w="100%" py={2} gap="10px">
        <Box />
        <Slider
          aria-label="slider-quantity"
          w="100%"
          min={0}
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
        <HStack spacing="0">
          <ArrowEnclosed
            direction="down"
            boxSize="48px"
            cursor="pointer"
            onClick={onDown}
            color="neon.500"
            _hover={{
              color: "neon.300",
            }}
          />
          <ArrowEnclosed
            direction="up"
            boxSize="48px"
            cursor="pointer"
            onClick={onUp}
            color="neon.500"
            _hover={{
              color: "neon.300",
            }}
          />
        </HStack>
        <Button
          h="36px"
          w="100px"
          variant="pixelated"
          display={["none", "block"]}
          onClick={() => setQuantity(max)}
        >
          Max
        </Button>
      </HStack>
    </VStack>
  );
};
