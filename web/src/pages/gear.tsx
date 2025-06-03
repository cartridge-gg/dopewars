import { Footer, Layout } from "@/components/layout";
import { TierIndicator } from "@/components/player";
import { dopeLootSlotIdToItemSlot, statName, weaponIdToSound } from "@/dojo/helpers";
import { useConfigStore, useRouterContext } from "@/dojo/hooks";
import { formatCash } from "@/utils/ui";
import { VStack, Text, Button, Heading, HStack, Box, Tooltip as ChakraTooltip } from "@chakra-ui/react";
import { ComponentValueEvent, useDopeStore } from "@/dope/store";
import React, { Children, ReactNode, useEffect, useMemo } from "react";
import { Layer } from "@/dope/components";
import { playSound } from "@/hooks/sound";

export default function Gear() {
  const { router } = useRouterContext();

  const getComponentValuesBySlug = useDopeStore((state) => state.getComponentValuesBySlug);
  const configStore = useConfigStore();

  const items = useMemo(() => {
    const weapons = getComponentValuesBySlug("DopeGear", "Weapon");
    const clothes = getComponentValuesBySlug("DopeGear", "Clothe");
    const foot = getComponentValuesBySlug("DopeGear", "Foot");
    const vehicles = getComponentValuesBySlug("DopeGear", "Vehicle");

    const drugs = getComponentValuesBySlug("DopeGear", "Drug");
    const waists = getComponentValuesBySlug("DopeGear", "Waist");
    const hands = getComponentValuesBySlug("DopeGear", "Hand");
    const necks = getComponentValuesBySlug("DopeGear", "Neck");
    const rings = getComponentValuesBySlug("DopeGear", "Ring");
    const accessories = getComponentValuesBySlug("DopeGear", "Accessory");

    return {
      weapons,
      clothes,
      foot,
      vehicles,
      drugs,
      waists,
      hands,
      necks,
      rings,
      accessories,
    };
  }, [configStore]);

  return (
    <Layout
      isSinglePanel
      footer={
        <Footer>
          <Button
            w={["full", "auto"]}
            px={["auto", "20px"]}
            onClick={() => {
              router.back();
            }}
          >
            Back
          </Button>
        </Footer>
      }
    >
      {/* <Heading fontSize={["30px", "48px"]} fontWeight="400" textAlign="center">
        Gear
      </Heading> */}

      <HStack w="full" gap={9} flexWrap="wrap" alignItems="center" justifyContent="center" mt={9}>
        <Items title="Weapons" items={items.weapons} />
        <Items title="Clothes" items={items.clothes} />
        <Items title="Shoes" items={items.foot} />
        <Items title="Vehicles" items={items.vehicles} />
      </HStack>

      <HStack w="full" gap={9} flexWrap="wrap" alignItems="flex-start" justifyContent="center" mt={9}>
        <Items title="Drugs" items={items.drugs} />
        <Items title="Waists" items={items.waists} />
        <Items title="Hands" items={items.hands} />
        <Items title="Neck" items={items.necks} />
        <Items title="Rings" items={items.rings} />
        <Items title="Accessories" items={items.accessories} />
      </HStack>

      <Box minH="80px"></Box>
    </Layout>
  );
}

const Items = ({ title, items }: { title: string; items: ComponentValueEvent[] }) => {
  return (
    <VStack display="flex" justifyContent="center" gap={9} mb="30px">
      <Text textStyle="subheading" fontSize={["11px", "13px"]}>
        {title}
      </Text>
      <HStack w="full" flexWrap="wrap" justifyContent="center" gap={6}>
        {items.map((i, idx) => {
          return <Item componentValue={i} key={idx} />;
        })}
      </HStack>
    </VStack>
  );
};

const Item = ({ componentValue }: { componentValue: ComponentValueEvent }) => {
  const configStore = useConfigStore();
  const getCollectionComponentsById = useDopeStore((state) => state.getCollectionComponentsById);

  const itemFull = useMemo(() => {
    const components = getCollectionComponentsById("DopeGear");
    const related = components.find((i) => i.slug === componentValue.component_slug);

    return configStore.getGearItemFull({
      item: componentValue.id,
      slot: related!.id,
      augmentation: 0,
      name_prefix: 0,
      name_suffix: 0,
      suffix: 0,
    });
  }, [componentValue]);

  const desc = useMemo(() => {
    if (!itemFull.levels) return null;
    return (
      <VStack alignItems="flex-start" gap={0}>
        {itemFull.levels.map((i, idx) => {
          return (
            <HStack justifyContent="flex-start" w="full" key={idx}>
              <Text w="40px"> LVL {idx}</Text>

              <Text w="70px" textAlign="right">
                +{i.stat}{" "}
                {
                  statName[
                    dopeLootSlotIdToItemSlot[
                      itemFull.gearItem.slot as keyof typeof dopeLootSlotIdToItemSlot
                    ] as keyof typeof statName
                  ]
                }
              </Text>
              {i.cost > 0 ? (
                <Text w="70px" textAlign="right">
                  {formatCash(i.cost)}
                </Text>
              ) : (
                <Text w="70px" textAlign="right">
                  FREE
                </Text>
              )}
            </HStack>
          );
        })}
      </VStack>
    );
  }, [itemFull]);

  return (
    <HStack
      w="250px"
      gap={3}
      // borderBottom="solid 1px"
      // borderBottomColor="neon.700"
      mb={1}
      pb={1}
      fontSize={"xs"}
      onClick={() => {
        if (componentValue.component_id === 0 /* weapon */) {
          playSound(weaponIdToSound(componentValue.id));
        }
      }}
    >
      <Layer rects={componentValue.resources[0]} width="48px" height="48px" crop={true} />
      <Text w="130px" ml={1}>
        {itemFull.name}
      </Text>
      {itemFull.tier && (
        <ChakraTooltip label={desc} color="neon.400">
          <span>
            <TierIndicator tier={itemFull.tier} />
          </span>
        </ChakraTooltip>
      )}
    </HStack>
  );
};
