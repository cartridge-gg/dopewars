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
import { formatCash, generatePixelBorderPath } from "@/utils/ui";
import {
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Image,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";

const Market = observer(() => {
  const { router, gameId, location, drugSlug } = useRouterContext();

  const [drug, setDrug] = useState<DrugConfigFull>();
  const [market, setMarket] = useState<DrugMarket>();
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [currentInventory, setCurrentInventory] = useState(0);
  const [maxPossible, setMaxPossible] = useState(0);

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

    // Set current inventory if player owns this drug
    const currentOwned = game.drugs.quantity > 0 && game.drugs?.drug?.drug === drug?.drug ? game.drugs.quantity : 0;
    setCurrentInventory(currentOwned);

    // Calculate max possible
    const canTrade = game.drugs.quantity === 0 || !game.drugs?.drug || game.drugs?.drug?.drug === drug?.drug;
    let calculatedMax = currentOwned;
    if (canTrade && market) {
      const maxBuyable = Math.floor(game.player.cash / market.price) + currentOwned;
      const totalCapacity = game.items.transport.stat;
      const maxCarryable = Math.floor(totalCapacity / drug.weight);
      calculatedMax = Math.min(maxBuyable, maxCarryable);
      setMaxPossible(calculatedMax);
    } else {
      setMaxPossible(currentOwned);
    }

    // Determine slider default position based on three scenarios:
    // 1. User owns nothing -> default to max (Buy Max)
    // 2. User owns some and can't buy more (at capacity) -> default to 0 (Sell All)
    // 3. User owns some and can buy more -> default to current inventory (Buy Max available)
    let defaultPosition = currentOwned;
    if (currentOwned === 0) {
      // Scenario 1: Don't own any
      defaultPosition = calculatedMax;
    } else if (calculatedMax === currentOwned) {
      // Scenario 2: Own some but at max capacity, can't buy more
      defaultPosition = 0;
    } else {
      // Scenario 3: Own some and can buy more
      defaultPosition = currentOwned;
    }
    setSelectedQuantity(defaultPosition);

    setMarket(market);
  }, [location, game, drugSlug]);

  const onTrade = useCallback(async () => {
    playSound(Sounds.Trade);

    try {
      if (selectedQuantity === currentInventory) {
        // No trade needed
        router.push(`/${gameId}/${location!.location}`);
        return;
      }

      const isBuying = selectedQuantity > currentInventory;
      const quantity = Math.abs(selectedQuantity - currentInventory);

      const marketAction = {
        direction: isBuying ? TradeDirection.Buy : TradeDirection.Sell,
        drug: drug?.drug_id,
        quantity,
        cost: quantity * market!.price,
      };
      game?.pushCall(marketAction);
    } catch (e) {
      console.log(e);
    }

    router.push(`/${gameId}/${location!.location}`);
  }, [selectedQuantity, currentInventory, gameId, location, drug, router, game, market]);

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

            {/* Show Buy Max when:
                1. Slider is at max (and user can buy more), OR
                2. Slider is at current inventory and user can buy more (scenario 3) */}
            {((selectedQuantity === maxPossible && selectedQuantity > currentInventory) ||
              (selectedQuantity === currentInventory && currentInventory > 0 && maxPossible > currentInventory)) && (
              <Button
                w={["full", "auto"]}
                px={["auto", "20px"]}
                onClick={() => {
                  // Trigger the trade immediately
                  const buyQuantity = maxPossible - currentInventory;
                  const buyMaxAction = {
                    direction: TradeDirection.Buy,
                    drug: drug?.drug_id,
                    quantity: buyQuantity,
                    cost: buyQuantity * market!.price,
                  };
                  game?.pushCall(buyMaxAction);
                  router.push(`/${gameId}/${location!.location}`);
                }}
              >
                Buy Max ({maxPossible - currentInventory})
              </Button>
            )}

            {/* Show Buy/Sell button when quantity changed but not at max (and not selling all) */}
            {selectedQuantity !== currentInventory && selectedQuantity !== maxPossible && selectedQuantity > 0 && (
              <Button w={["full", "auto"]} px={["auto", "20px"]} onClick={onTrade}>
                {selectedQuantity > currentInventory
                  ? `Buy (${selectedQuantity - currentInventory})`
                  : `Sell (${currentInventory - selectedQuantity})`}
              </Button>
            )}

            {/* Show Sell All button when user owns the drug, but NOT when:
                1. Partial Sell button is showing
                2. Slider is at max and user can't buy more (max === currentInventory) */}
            {currentInventory > 0 &&
              !(selectedQuantity < currentInventory && selectedQuantity > 0 && selectedQuantity !== maxPossible) &&
              !(selectedQuantity === maxPossible && maxPossible === currentInventory) && (
                <Button
                  w={["full", "auto"]}
                  px={["auto", "20px"]}
                  onClick={() => {
                    // Trigger the trade immediately
                    const sellAllAction = {
                      direction: TradeDirection.Sell,
                      drug: drug?.drug_id,
                      quantity: currentInventory,
                      cost: currentInventory * market!.price,
                    };
                    game?.pushCall(sellAllAction);
                    router.push(`/${gameId}/${location!.location}`);
                  }}
                >
                  Sell All ({currentInventory})
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

        <QuantitySelector
          drug={drug}
          game={game}
          market={market}
          currentInventory={currentInventory}
          initialQuantity={selectedQuantity}
          onChange={(quantity) => {
            setSelectedQuantity(quantity);
          }}
        />
      </Box>
    </Layout>
  );
});
export default Market;

const QuantitySelector = observer(
  ({
    game,
    drug,
    market,
    currentInventory,
    initialQuantity,
    onChange,
  }: {
    game: GameClass;
    drug: DrugConfigFull;
    market: DrugMarket;
    currentInventory: number;
    initialQuantity: number;
    onChange: (quantity: number) => void;
  }) => {
    const [quantity, setQuantity] = useState(initialQuantity);
    const [max, setMax] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
      // Calculate max possible quantity player could own
      const canTrade = game.drugs.quantity === 0 || !game.drugs?.drug || game.drugs?.drug?.drug === drug?.drug;

      if (!canTrade) {
        setErrorMessage(`Inventory full with ${game.drugs?.drug?.name}. Sell it first to buy ${drug.name}.`);
        setMax(currentInventory); // Can only sell current inventory
        if (!initialized) {
          setQuantity(initialQuantity);
          setInitialized(true);
        }
        return;
      }

      // Calculate max buyable with available cash
      const maxBuyable = Math.floor(game.player.cash / market.price) + currentInventory;

      // Calculate max carryable based on inventory space
      const totalCapacity = game.items.transport.stat;
      const maxCarryable = Math.floor(totalCapacity / drug.weight);

      const calculatedMax = Math.min(maxBuyable, maxCarryable);

      setErrorMessage(null);
      setMax(calculatedMax);
      // Only set quantity on initial mount, use initialQuantity
      if (!initialized) {
        setQuantity(initialQuantity);
        setInitialized(true);
      }
    }, [drug, game, market, currentInventory, initialQuantity, initialized]);

    useEffect(() => {
      onChange(quantity);
    }, [quantity, onChange]);

    const onDown = useCallback(() => {
      if (quantity > 0) {
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

    // Calculate trade details
    const tradeDifference = Math.abs(quantity - currentInventory);
    const isBuying = quantity > currentInventory;
    const isSelling = quantity < currentInventory;

    // When holding (not trading), show total holdings instead of difference
    const displayWeight = isBuying || isSelling ? tradeDifference * market.weight : quantity * market.weight;
    const displayCost = isBuying || isSelling ? tradeDifference * market.price : quantity * market.price;

    // Calculate the percentage of current inventory on the slider
    const inventoryPercent = max > 0 ? (currentInventory / max) * 100 : 0;
    const sliderPercent = max > 0 ? (quantity / max) * 100 : 0;

    return (
      <Tooltip label={errorMessage} isOpen={errorMessage !== null} placement="top" hasArrow bg="red.600" color="white">
        <VStack w="full">
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
                {isBuying ? "Buying" : isSelling ? "Selling" : "Holding"}:
              </Text>
              <Text textStyle="subheading">
                <WeightIcon mb={1} />
                <span>{displayWeight}</span>
              </Text>
            </HStack>
            <HStack>
              <Text textStyle="subheading" color="neon.500">
                {isBuying ? "Cost" : isSelling ? "Earn" : "Value"}:
              </Text>
              <Text textStyle="subheading">{displayCost ? formatCash(displayCost) : "$0"}</Text>
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
                {/* Show red section when selling (between slider and inventory) */}
                {quantity < currentInventory && (
                  <Box
                    position="absolute"
                    left={`${sliderPercent}%`}
                    h="100%"
                    w={`${inventoryPercent - sliderPercent}%`}
                    bg="yellow.400"
                    clipPath={`polygon(${generatePixelBorderPath(2, 2)})`}
                  />
                )}
                {/* Show green section when buying (between inventory and slider) */}
                {quantity > currentInventory && (
                  <Box
                    position="absolute"
                    left={`${inventoryPercent}%`}
                    h="100%"
                    w={`${sliderPercent - inventoryPercent}%`}
                    bg={"neon.200"}
                    clipPath={`polygon(${generatePixelBorderPath(2, 2)})`}
                  />
                )}
              </SliderTrack>
              <SliderThumb bg={quantity < currentInventory ? "yellow.400" : "neon.200"} />
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
          </HStack>
        </VStack>
      </Tooltip>
    );
  },
);
