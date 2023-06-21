import { ReactNode, useEffect, useState } from "react";
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
  CardHeader,
  CardFooter,
  SimpleGrid,
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
import { useUiStore } from "@/hooks/ui";

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
  DrugProps,
  Drugs,
} from "@/hooks/state";
import { Inventory } from "@/components/Inventory";

enum MarketMode {
  Buy,
  Sell,
}

export default function Market() {
  const router = useRouter();
  const [drug, setDrug] = useState<DrugProps>();
  const [marketMode, setMarketMode] = useState(MarketMode.Buy);

  const [quantityBuy, setQuantityBuy] = useState(0);
  const [quantitySell, setQuantitySell] = useState(0);

  const locationMenu = useGameStore((state) => state.menu);
  const inventory = useGameStore((state) => state.inventory);

  useEffect(() => {
    const { getDrugBySlug } = useUiStore.getState();
    const drug = getDrugBySlug(router.query.drugSlug);
    setDrug(drug);

    // if menu not initialized force travel to this location
    //   if(!locationMenu){
    //     travelTo
    //   }
  }, [router.query]);

  const onTabsChange = (index) => {
    setMarketMode(index as MarketMode);
  };

  const onBuy = () => {
    trade(TradeDirection.Buy, drug.name, quantityBuy);

    //todo: replace by push
    router.back();
  };

  const onSell = () => {
    trade(TradeDirection.Sell, drug.name, quantitySell);

    //todo: replace by push
    router.back();
  };

  return (
    drug && locationMenu &&(
      <Layout
        title={drug.name}
        prefixTitle="The market"
        headerImage="/images/dealer.png"
      >
        <Content>
          <VStack w="100%" h="100%">
            <Inventory />
            <VStack w="100%" rounded={6} bg="neon.700" p={6} mb={6}>
              <Box position="relative" my={6}>
                <Image
                  src={`/images/drugs/${drug.slug}.png`}
                  alt={drug.name}
                  width={200}
                  height={200}
                  objectFit="contain"
                  style={{ margin: "auto", width: "auto", height: "auto" }}
                />
              </Box>
              <HStack w="100%" justifyContent="space-between">
                <Text>${drug ? locationMenu[drug.name].price : "???"}</Text>
                <Text>
                  <Bag />
                  {drug ? locationMenu[drug.name].available : "???"}
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
                  <QuantitySelector
                    type={TradeDirection.Buy}
                    price={locationMenu[drug.name].price}
                    inventory={inventory}
                    drug={drug}
                    onChange={setQuantityBuy}
                  />
                </TabPanel>
                <TabPanel>
                  <QuantitySelector
                    type={TradeDirection.Sell}
                    price={locationMenu[drug.name].price}
                    inventory={inventory}
                    drug={drug}
                    onChange={setQuantitySell}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </Content>
        <Footer>
          {marketMode === MarketMode.Buy && quantityBuy > 0 && (
            <Button w={["50%", "auto"]} onClick={onBuy}>
              Buy ({quantityBuy})
            </Button>
          )}
          {marketMode === MarketMode.Sell && quantitySell > 0 && (
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
  drug,
  onChange,
}: {
  type: TradeDirection;
  price: number;
  inventory;
  drug: DrugProps;
  onChange: (quantity: number) => never;
}) => {
  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [max, setMax] = useState(0);

  useEffect(() => {
    if (type === TradeDirection.Buy) {
      setMax(Math.floor(inventory.cash / price));
    } else if (type === TradeDirection.Sell) {
      setMax(inventory.drugs[drug.name].quantity);
    }
  }, [type, price]);

  useEffect(() => {
    onChange(quantity);
  }, [quantity]);

  useEffect(() => {
    setTotalPrice(quantity * price);
  }, [quantity]);

  const onDown = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const onUp = () => {
    if (quantity < max) {
      setQuantity(quantity + 1);
    }
  };

  const onSlider = (value: number) => {
    setQuantity(value);
  };

  const onMax = () => {
    setQuantity(max);
  };

  const on50 = () => {
    setQuantity(Math.floor(max / 2));
  };

  return (
    <VStack
      opacity={max === 0 ? "0.2" : "1"}
      pointerEvents={max === 0 ? "none" : ""}
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
        <ArrowEnclosed
          direction="down"
          size="lg"
          cursor="pointer"
          onClick={onDown}
        />

        <Slider
          aria-label="slider-quantity"
          w="100%"
          min={0}
          max={max}
          step={1}
          defaultValue={0}
          value={quantity}
          onChange={onSlider}
        >
          <SliderTrack bg="neon.700" height="30px" rounded={6}>
            <SliderFilledTrack bg="neon.500" />
          </SliderTrack>
          <SliderThumb bg="transparent" outline="none">
            <Box w="12px" h="24px" bg="neon.300"></Box>
          </SliderThumb>
        </Slider>

        <ArrowEnclosed
          direction="up"
          size="lg"
          cursor="pointer"
          onClick={onUp}
        />
      </HStack>
    </VStack>
  );
};
