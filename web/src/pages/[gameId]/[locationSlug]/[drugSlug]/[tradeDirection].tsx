import { useCallback, useEffect, useState } from "react";
import { Box, Text, VStack, HStack, Card, Button, Flex, Image } from "@chakra-ui/react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { Alert, ArrowEnclosed, Cart } from "@/components/icons";
import { Footer } from "@/components/Footer";
import { Slider, SliderTrack, SliderFilledTrack } from "@chakra-ui/react";
import { Sounds, playSound } from "@/hooks/sound";
import AlertMessage from "@/components/AlertMessage";
import { PlayerEntity } from "@/dojo/queries/usePlayerEntity";
import { formatQuantity, formatCash } from "@/utils/ui";
import { useSystems } from "@/dojo/hooks/useSystems";
import { calculateMaxQuantity, calculateSlippage } from "@/utils/market";
import { useToast } from "@/hooks/toast";
import { getDrugBySlug, getLocationBySlug } from "@/dojo/helpers";
import { DrugInfo, DrugMarket, TradeDirection } from "@/dojo/types";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { usePlayerStore } from "@/hooks/player";

export default function Market() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const tradeDirection = (router.query.tradeDirection as string) === "buy" ? TradeDirection.Buy : TradeDirection.Sell;
  const location = getLocationBySlug(router.query.locationSlug as string);
  const drug = getDrugBySlug(router.query.drugSlug as string);

  const [market, setMarket] = useState<DrugMarket>();
  const [quantityBuy, setQuantityBuy] = useState(0);
  const [quantitySell, setQuantitySell] = useState(0);
  const [canSell, setCanSell] = useState(false);
  const [canBuy, setCanBuy] = useState(false);

  const { account } = useDojoContext();
  const { buy, sell, isPending } = useSystems();

  const { playerEntity }= usePlayerStore()

  const { toast } = useToast();

  // market price and quantity can fluctuate as players trade
  useEffect(() => {
    if (!playerEntity || isPending) return;

    const markets = playerEntity.markets.get(location!.id) || [];
    const market = markets.find((d) => d.id === drug?.id);
    if (!market) return;

    const playerDrug = playerEntity.drugs.find((d) => d.id === drug?.id);
    if (playerDrug) {
      setCanSell(playerDrug.quantity > 0);
    }

    setCanBuy(playerEntity.cash > market.price);
    setMarket(market);
  }, [location, playerEntity, drug, isPending]);

  const onTrade = useCallback(async () => {
    playSound(Sounds.Trade);

    router.push(`/${gameId}/${location!.slug}`);

    let toastMessage = "",
      hash = "",
      quantity,
      total;

    try {
      if (tradeDirection === TradeDirection.Buy) {
        ({ hash } = await buy(gameId, location!.type, drug!.type, quantityBuy));
        toastMessage = `You bought ${quantityBuy} ${drug!.name}`;
        quantity = quantityBuy;
      } else if (tradeDirection === TradeDirection.Sell) {
        ({ hash } = await sell(gameId, location!.type, drug!.type, quantitySell));
        toastMessage = `You sold ${quantitySell} ${drug!.name}`;
        quantity = quantitySell;
      }

      // toast({
      //   message: toastMessage,
      //   icon: Cart,
      //   link: `http://amazing_explorer/${hash}`,
      // });
    } catch (e) {
      console.log(e);
    }
  }, [tradeDirection, quantityBuy, quantitySell, gameId, location, drug, router, buy, sell]);

  if (!router.isReady || !playerEntity || !drug || !market) return <></>;

  return (
    <Layout
      leftPanelProps={{
        title: drug.name,
        prefixTitle: "The market",
        imageSrc: "/images/dealer.png",
      }}
      footer={
        <Footer>
          <Button w={["full", "auto"]} px={["auto", "20px"]} onClick={() => router.back()}>
            Back
          </Button>

          {tradeDirection == TradeDirection.Buy && canBuy && (
            <Button
              w={["full", "auto"]}
              px={["auto", "20px"]}
              isLoading={isPending /* && !txError*/}
              isDisabled={quantityBuy === 0}
              onClick={onTrade}
            >
              Buy ({quantityBuy})
            </Button>
          )}

          {tradeDirection == TradeDirection.Sell && canSell && (
            <Button
              w={["full", "auto"]}
              px={["auto", "20px"]}
              isLoading={isPending /*&& !txError*/}
              isDisabled={quantitySell === 0}
              onClick={onTrade}
            >
              Sell ({quantitySell})
            </Button>
          )}
        </Footer>
      }
    >
      <Box w="full" margin="auto">
        <Card variant="pixelated" p={6} mb={6} _hover={{}} align="center">
          <Image src={`/images/drugs/${drug.slug}.png`} alt={drug.name} h={[140, 300]} maxH="40vh" />
          <HStack w="100%" justifyContent="space-between" fontSize="16px">
            <HStack>
              {drug.icon({ boxSize: "36px" })}
              <Text>{formatCash(market.price)}</Text>
            </HStack>
          </HStack>
        </Card>
        {((tradeDirection == TradeDirection.Buy && canBuy) || (tradeDirection == TradeDirection.Sell && canSell)) && (
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

        {tradeDirection == TradeDirection.Buy && !canBuy && <AlertMessage message="You can't afford this" />}

        {tradeDirection == TradeDirection.Sell && !canSell && (
          <AlertMessage message={`You have no ${drug.name} to sell`} />
        )}
      </Box>
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
      //let max_buyable = calculateMaxQuantity(market, player.cash);
      let max_buyable = Math.floor(player.cash / market.price);
      let bag_space = player.getTransport() - player.drugCount;
      setMax(Math.min(max_buyable, bag_space));
    } else if (type === TradeDirection.Sell) {
      const playerQuantity = player.drugs.find((d) => d.id === drug.id)?.quantity;
      setMax(playerQuantity || 0);
      setQuantity(playerQuantity || 0);
    }
  }, [type, drug, player, market]);

  useEffect(() => {
    // const slippage = calculateSlippage(market.marketPool, quantity, type);

    // if (slippage.priceImpact > 0.2) {
    //   // >20%
    //   setAlertColor("red");
    // } else if (slippage.priceImpact > 0.05) {
    //   // >5%
    //   setAlertColor("neon.200");
    // } else {
    //   setAlertColor("neon.500");
    // }

    // setPriceImpact(slippage.priceImpact);
    setTotalPrice(quantity * market.price);
    onChange(quantity, market.price);
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
    <VStack opacity={max === 0 ? "0.2" : "1"} pointerEvents={max === 0 ? "none" : "all"} w="full">
      <Flex w="100%" direction={["column", "row"]} justifyContent="space-between" align="center" gap={["10px", "20px"]}>
        {/* <Text color={alertColor}>
          <Alert size="sm" /> {priceImpact ? (priceImpact * 100).toFixed(2) : "0"}% slippage ($
          {totalPrice ? (totalPrice / quantity).toFixed(0) : market.price.toFixed(0)} per)
        </Text> */}
        <HStack fontSize="13px">
          <Text textStyle="subheading" color="neon.500">
            Total:
          </Text>
          <Text textStyle="subheading">{totalPrice ? formatCash(totalPrice) : "$0"}</Text>
        </HStack>
      </Flex>

      <HStack w="100%" py={2}>
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
            boxSize={["36px", "48px"]}
            cursor="pointer"
            onClick={onDown}
            color="neon.500"
            _hover={{
              color: "neon.300",
            }}
          />
          <ArrowEnclosed
            direction="up"
            boxSize={["36px", "48px"]}
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
          marginInlineStart={0}
          // display={["none", "block"]}
          onClick={() => setQuantity(max)}
        >
          Max
        </Button>
      </HStack>
    </VStack>
  );
};
