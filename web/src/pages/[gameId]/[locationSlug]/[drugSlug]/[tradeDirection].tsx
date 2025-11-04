import { AlertMessage } from "@/components/common";
import { ArrowEnclosed } from "@/components/icons";
import { WeightIcon } from "@/components/icons/Weigth";
import { Footer, Layout } from "@/components/layout";
import { ChildrenOrConnect } from "@/components/wallet";
import { GameClass } from "@/dojo/class/Game";
import { useGameStore, useRouterContext } from "@/dojo/hooks";
import { DrugConfigFull } from "@/dojo/stores/config";
import { DrugMarket, TradeDirection } from "@/dojo/types";
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
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";

const Market = observer(() => {
  const { router, gameId, location, /* drug, */ drugSlug, tradeDirection } = useRouterContext();

  const [drug, setDrug] = useState<DrugConfigFull>();
  const [market, setMarket] = useState<DrugMarket>();
  const [quantityBuy, setQuantityBuy] = useState(0);
  const [quantitySell, setQuantitySell] = useState(0);
  const [canSell, setCanSell] = useState(false);
  const [canBuy, setCanBuy] = useState(false);

  const { account } = useAccount();
  const { game } = useGameStore();

  const { toast } = useToast();

  useEffect(() => {
    if (!game || !location || !drugSlug) return;

    const drug = game.configStore.getDrug(game.seasonSettings.drugs_mode, drugSlug);
    setDrug(drug);

    const markets = game.markets.marketsByLocation.get(location!.location) || [];
    const market = markets.find((d) => d.drug === drug?.drug);
    if (!market) return;

    setCanSell((game.drugs.quantity > 0 && game.drugs?.drug && game.drugs?.drug?.drug === drug!.drug) as boolean);
    setCanBuy((game.drugs.quantity === 0 || !game.drugs?.drug || game.drugs?.drug?.drug === drug!.drug) as boolean);

    setMarket(market);
  }, [location, game, drugSlug]);

  const onTrade = useCallback(async () => {
    playSound(Sounds.Trade);

    try {
      const quantity = tradeDirection === TradeDirection.Buy ? quantityBuy : quantitySell;

      const marketAction = {
        direction: tradeDirection!,
        drug: drug?.drug_id,
        quantity,
        cost: quantity * market!.price,
      };
      game?.pushCall(marketAction);
    } catch (e) {
      console.log(e);
    }

    router.push(`/${gameId}/${location!.location}`);
  }, [tradeDirection, quantityBuy, quantitySell, gameId, location, drug, router, game, market]);

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
          <ChildrenOrConnect>
            <Button w={["full", "auto"]} px={["auto", "20px"]} onClick={() => router.back()}>
              Back
            </Button>

            {tradeDirection == TradeDirection.Buy && canBuy && (
              <Button w={["full", "auto"]} px={["auto", "20px"]} isDisabled={quantityBuy === 0} onClick={onTrade}>
                Buy ({quantityBuy})
              </Button>
            )}

            {tradeDirection == TradeDirection.Sell && canSell && (
              <Button w={["full", "auto"]} px={["auto", "20px"]} isDisabled={quantitySell === 0} onClick={onTrade}>
                Sell ({quantitySell})
              </Button>
            )}
          </ChildrenOrConnect>
        </Footer>
      }
    >
      <Box w="full" margin="auto">
        <Card variant="pixelated" p={[3, 6]} mb={[3, 6]} _hover={{}} align="center">
          <Image src={`/images/drugs/${drug.drug.toLowerCase()}.svg`} alt={drug.name} h={[160, 300]} maxH="30vh" />
          <HStack w="100%" justifyContent="space-between" fontSize="16px">
            <HStack>
              <Text>
                <WeightIcon mb={1} />
                <span>{market.weight}</span>
              </Text>
            </HStack>
            <HStack>
              {drug.icon({ boxSize: "36px" })}
              <Text>{formatCash(market.price)}</Text>
            </HStack>
          </HStack>
        </Card>

        {((tradeDirection == TradeDirection.Buy && canBuy) || (tradeDirection == TradeDirection.Sell && canSell)) && (
          <QuantitySelector
            drug={drug}
            game={game}
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
});
export default Market;

const QuantitySelector = observer(
  ({
    tradeDirection,
    game,
    drug,
    market,
    onChange,
  }: {
    tradeDirection: TradeDirection;
    game: GameClass;
    drug: DrugConfigFull;
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
        const canTrade = game.drugs.quantity === 0 || !game.drugs?.drug || game.drugs?.drug?.drug === drug?.drug;
        if (!canTrade) {
          // TODO: add alert msg?
          setMax(0);
          setQuantity(0);
          return;
        }

        const maxBuyable = Math.floor(game.player.cash / market.price);

        // free space
        const freeSpace = game.items.transport.stat - game.drugs.quantity * drug.weight;
        const maxCarryable = Math.floor(freeSpace / drug.weight);

        setMax(Math.min(maxBuyable, maxCarryable));
      } else if (tradeDirection === TradeDirection.Sell) {
        const canTrade = game.drugs.quantity > 0 && game.drugs?.drug && game.drugs?.drug?.drug === drug?.drug;

        if (!canTrade) {
          // TODO: add alert msg?
          setMax(0);
          setQuantity(0);
          return;
        }
        setMax(game.drugs.quantity || 0);
        setQuantity(game.drugs.quantity || 0);
      }
    }, [tradeDirection, drug, game, market]);

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
        <Flex
          w="100%"
          direction={["column", "row"]}
          justifyContent="space-between"
          align="center"
          gap={["10px", "20px"]}
          fontSize="13px"
        >
          <HStack>
            <Text textStyle="subheading" color="neon.500">
              Weight:
            </Text>
            <Text textStyle="subheading">
              <WeightIcon mb={1} />
              <span>{Number(quantity * market.weight)}</span>
            </Text>
          </HStack>
          <HStack>
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
  },
);
