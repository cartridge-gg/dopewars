import AlertMessage from "@/components/AlertMessage";
import { Footer } from "@/components/Footer";
import Layout from "@/components/Layout";
import { ArrowEnclosed } from "@/components/icons";
import { Player } from "@/dojo/class/Game";
import { useDojoContext, useGameStore, useRouterContext, useSystems } from "@/dojo/hooks";
import { DrugInfo, DrugMarket, TradeDirection } from "@/dojo/types";
import { Sounds, playSound } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
import { formatCash } from "@/utils/ui";
import {
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Image,
  Slider,
  SliderFilledTrack,
  SliderTrack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

export default function Market() {
  const { router, gameId, location, drug, tradeDirection } = useRouterContext();

  const [market, setMarket] = useState<DrugMarket>();
  const [quantityBuy, setQuantityBuy] = useState(0);
  const [quantitySell, setQuantitySell] = useState(0);
  const [canSell, setCanSell] = useState(false);
  const [canBuy, setCanBuy] = useState(false);

  const { account } = useDojoContext();
  const { buy, sell, isPending } = useSystems();

  const { game } = useGameStore()

  const { toast } = useToast();

  // market price and quantity can fluctuate as players trade
  useEffect(() => {
    if (!game || isPending || !location) return;

    const markets = game.markets.marketsByLocation.get(location!.location) || [];
    const market = markets.find((d) => d.drug === drug?.drug);
    if (!market) return;

    // const playerDrug = playerEntity.drugs.find((d) => d.id === drug?.drug);
    // if (playerDrug) {
    //   setCanSell(playerDrug.quantity > 0);
    // }

    setCanBuy(game.player.cash > market.price);
    setMarket(market);
  }, [location, game, drug, isPending]);

  const onTrade = useCallback(async () => {
    playSound(Sounds.Trade);

    let toastMessage = "",
      hash = "",
      quantity,
      total;

    try {
      if (tradeDirection === TradeDirection.Buy) {
        ({ hash } = await buy(gameId, location!.location_id, drug!.drug_id, quantityBuy));
        toastMessage = `You bought ${quantityBuy} ${drug!.name}`;
        quantity = quantityBuy;
      } else if (tradeDirection === TradeDirection.Sell) {
        ({ hash } = await sell(gameId, location!.location_id, drug!.drug_id, quantitySell));
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

    router.push(`/${gameId}/${location!.location.toLowerCase()}`);
  }, [tradeDirection, quantityBuy, quantitySell, gameId, location, drug, router, buy, sell]);

  if (!router.isReady || !game || !drug || !market) return <></>;

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
          <Image src={`/images/drugs/${drug.drug.toLowerCase()}.png`} alt={drug.name} h={[140, 300]} maxH="40vh" />
          <HStack w="100%" justifyContent="space-between" fontSize="16px">
            <HStack>
              {drug.icon({ boxSize: "36px" })}
              <Text>{formatCash(market.price)}</Text>
            </HStack>
            <HStack>
              <Text>{market.weight} LBS</Text>
            </HStack>
          </HStack>
        </Card>
        {((tradeDirection == TradeDirection.Buy && canBuy) || (tradeDirection == TradeDirection.Sell && canSell)) && (
          <QuantitySelector
            drug={drug}
            player={game.player}
            market={market}
            tradeDirection={tradeDirection}
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
  tradeDirection,
  player,
  drug,
  market,
  onChange,
}: {
  tradeDirection: TradeDirection;
  drug: DrugInfo;
  player: Player;
  market: DrugMarket;
  onChange: (quantity: number, newPrice: number) => void;
}) => {
  const [totalPrice, setTotalPrice] = useState(market.price);
  const [priceImpact, setPriceImpact] = useState(0);
  const [alertColor, setAlertColor] = useState("neon.500");
  const [quantity, setQuantity] = useState(0);
  const [max, setMax] = useState(0);

  useEffect(() => {
    if (tradeDirection === TradeDirection.Buy) {
      //let max_buyable = calculateMaxQuantity(market, player.cash);
      let max_buyable = Math.floor(player.cash / market.price);
      //let bag_space = player.getTransport() - player.drugCount;
      //setMax(Math.min(max_buyable, bag_space));
    } else if (tradeDirection === TradeDirection.Sell) {
      // const playerQuantity = player.drugs.find((d) => d.id === drug.drug)?.quantity;
      // setMax(playerQuantity || 0);
      // setQuantity(playerQuantity || 0);
    }
  }, [tradeDirection, drug, player, market]);

  useEffect(() => {
       setTotalPrice(quantity * market.price);
    onChange(quantity, market.price);
  }, [quantity, market, tradeDirection, onChange]);

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
        <HStack fontSize="13px">
          <Text textStyle="subheading" color="neon.500">
            Weight:
          </Text>
          <Text textStyle="subheading">{Number(quantity * market.weight).toFixed(2)} LBS</Text>
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
