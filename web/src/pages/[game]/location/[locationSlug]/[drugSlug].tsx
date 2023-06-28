import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Spacer,
  Divider,
} from "@chakra-ui/react";
import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import Content from "@/components/Content";
import { Footer } from "@/components/Footer";
import {
  Ludes,
  Weed,
  Acid,
  Speed,
  Heroin,
  Cocaine,
} from "@/components/icons/drugs";
import { ArrowEnclosed, Bag } from "@/components/icons";
import Image from "next/image";
import { DrugProps, useUiStore } from "@/hooks/ui";

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
import {
  useGameStore,
  travelTo,
  trade,
  TradeDirection,
  Drugs,
  InventoryType,
  getInventoryInfos,
} from "@/hooks/state";
import { Inventory } from "@/components/Inventory";
import AlertMessage from "@/components/AlertMessage";

enum MarketMode {
  Buy,
  Sell,
}

export default function Market() {
  const router = useRouter();
  const [drug, setDrug] = useState<DrugProps>();
  const [marketMode, setMarketMode] = useState(MarketMode.Buy);

  const [quantityBuy, setQuantityBuy] = useState(1);
  const [quantitySell, setQuantitySell] = useState(1);

  const [canSell, setCanSell] = useState(false);
  const [canBuy, setCanBuy] = useState(false);

  const [canAffordOne, setCanAffordOne] = useState(true);

  const locationMenu = useGameStore((state) => state.menu);
  const inventory = useGameStore((state) => state.inventory);
  const inventoryInfos = getInventoryInfos();
  const isBagFull = inventoryInfos.left == 0;

  useEffect(() => {
    const { getDrugBySlug } = useUiStore.getState();
    const drugSlug = router.query.drugSlug?.toString() || "";
    const drug = getDrugBySlug(drugSlug);
    setDrug(drug);

    // if menu not initialized force travel to this location
    //   if(!locationMenu){
    //     travelTo
    //   }
  }, [router.query]);

  useEffect(() => {
    if (!drug || !locationMenu) return;
    const drugPrice = locationMenu[drug.name].price;
    const canAffordOne = drugPrice <= inventory.cash;

    const can =
      quantityBuy <= inventoryInfos.left &&
      quantityBuy * drugPrice <= inventory.cash &&
      quantityBuy > 0;

    setCanBuy(can);
    setCanAffordOne(canAffordOne);
  }, [quantityBuy, drug, locationMenu, inventoryInfos.left, inventory.cash]);

  useEffect(() => {
    if (!drug) return;
    const inBag = inventory.drugs[drug.name].quantity;
    const can = inBag > 0;
    setCanSell(can);
  }, [quantitySell, inventory, inventory.drugs, drug]);

  const onTabsChange = (index: number) => {
    setMarketMode(index as MarketMode);
  };

  const onBuy = () => {
    drug && trade(TradeDirection.Buy, drug.name, quantityBuy);

    //todo: replace by push
    router.back();
  };

  const onSell = () => {
    drug && trade(TradeDirection.Sell, drug.name, quantitySell);

    //todo: replace by push
    router.back();
  };

  return (
    drug &&
    locationMenu && (
      <Layout
        title={drug.name}
        prefixTitle="The market"
        headerImage="/images/dealer.png"
      >
        <Content>
          <VStack w="100%" h="100%">
            {/* <Inventory pb="20px" /> */}
            <VStack w="100%" rounded={6} bg="neon.700" p={6} mb={6}>
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
                <Text>${drug ? locationMenu[drug.name].price : "???"}</Text>
                <Text
                  color={
                    inventory.drugs[drug.name].quantity > 0
                      ? "yellow.400"
                      : "neon.500"
                  }
                >
                  <Bag mr={1} />
                  {inventory.drugs[drug.name].quantity}
                </Text>
              </HStack>
            </VStack>

            <Tabs
              w="100%"
              isFitted
              variant="unstyled"
              index={marketMode}
              onChange={onTabsChange}
            >
              <TabList>
                <Tab
                  color="neon.500"
                  _selected={{ color: "neon.300", bg: "neon.700" }}
                  rounded={6}
                >
                  BUY
                </Tab>
                <Tab
                  color="neon.500"
                  _selected={{ color: "neon.300", bg: "neon.700" }}
                  rounded={6}
                >
                  SELL
                </Tab>
              </TabList>

              <TabPanels mt={6}>
                <TabPanel>
                  {canAffordOne && !isBagFull && (
                    <QuantitySelector
                      type={TradeDirection.Buy}
                      price={locationMenu[drug.name].price}
                      inventory={inventory}
                      inventoryInfos={inventoryInfos}
                      drug={drug}
                      onChange={setQuantityBuy}
                    />
                  )}

                  {!canAffordOne && <AlertMessage message="YOU ARE BROKE" />}
                  {isBagFull && <AlertMessage message="YOUR BAG IS FULL" />}
                </TabPanel>
                <TabPanel>
                  {canSell ? (
                    <QuantitySelector
                      type={TradeDirection.Sell}
                      price={locationMenu[drug.name].price}
                      inventory={inventory}
                      inventoryInfos={inventoryInfos}
                      drug={drug}
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
          {marketMode === MarketMode.Buy && canBuy && (
            <Button w={["50%", "auto"]} onClick={onBuy}>
              Buy ({quantityBuy})
            </Button>
          )}
          {marketMode === MarketMode.Sell && canSell && (
            <Button w={["50%", "auto"]} onClick={onSell}>
              Sell ({quantitySell})
            </Button>
          )}
        </Footer>
      </Layout>
    )
  );
}

const QuantitySelector = ({
  type,
  price,
  inventory,
  inventoryInfos,
  drug,
  onChange,
}: {
  type: TradeDirection;
  price: number;
  inventory: InventoryType;
  inventoryInfos: { capacity: number; used: number; left: number };
  drug: DrugProps;
  onChange: (quantity: number) => void;
}) => {
  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [max, setMax] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, []);

  useEffect(() => {
    if (type === TradeDirection.Buy) {
      const maxBuyable = Math.floor(inventory.cash / price);
      const maxInventory = inventoryInfos.left;
      setMax(Math.max(1, Math.min(maxBuyable, maxInventory)));
    } else if (type === TradeDirection.Sell) {
      setMax(Math.max(1, inventory.drugs[drug.name].quantity));
    }
  }, [type, price, drug, inventory, inventoryInfos]);

  useEffect(() => {
    setTotalPrice(quantity * price);
    onChange(quantity);
  }, [quantity, price, onChange]);

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
          {quantity} for ${totalPrice}
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
          <SliderTrack
            bg="neon.700"
            height="30px"
            rounded={6}
            borderLeft="solid 5px var(--chakra-colors-neon-700)"
            borderRight="solid 5px var(--chakra-colors-neon-700)"
          >
            <SliderFilledTrack
              height="20px"
              bg="neon.200"
              rounded={4}
              // bg="linear-gradient(to right, #16c973 75%, #202f20 25%)"
              // bgSize="16px 20px"
              // bgRepeat="repeat-x"
            />
          </SliderTrack>
          {/* <SliderThumb bg="transparent" outline="none">
            <Box w="12px" h="20px" bg="neon.300" borderLeft="solid 2px #202f20"></Box>
          </SliderThumb> */}
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
