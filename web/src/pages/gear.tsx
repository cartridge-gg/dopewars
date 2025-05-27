import { Footer, Layout } from "@/components/layout";
import { TierIndicator } from "@/components/player";
import { dopeLootSlotIdToItemSlot, statName } from "@/dojo/helpers";
import { useConfigStore, useRouterContext } from "@/dojo/hooks";
import { formatCash } from "@/utils/ui";
import { VStack, Text, Button, Heading, HStack, Box, Tooltip as ChakraTooltip } from "@chakra-ui/react";
import { ComponentValueEvent, useDopeStore } from "@/dope/store";
import { useEffect, useMemo } from "react";
import { Layer } from "@/dope/components";

export default function Gear() {
  const { router } = useRouterContext();

  const getComponentValuesBySlug = useDopeStore((state) => state.getComponentValuesBySlug);
  const configStore = useConfigStore();

  const items = useMemo(() => {
    const weapons = getComponentValuesBySlug("DopeGear", "Weapon");
    const clothes = getComponentValuesBySlug("DopeGear", "Clothe");
    const foot = getComponentValuesBySlug("DopeGear", "Foot");
    const vehicles = getComponentValuesBySlug("DopeGear", "Vehicle");

    return {
      weapons,
      clothes,
      foot,
      vehicles,
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
      <Heading fontSize={["30px", "48px"]} fontWeight="400" textAlign="center">
        Gear Tiers
      </Heading>

      <HStack w="full" gap={9} flexWrap="wrap" alignItems="flex-start" justifyContent="center" mt={9}>
        <VStack justifyContent="flex-start">
          <Text textStyle="subheading" fontSize={["9px", "11px"]}>
            Weapons
          </Text>
          {items.weapons.map((i, idx) => {
            return <Item componentValue={i} key={idx} />;
          })}
        </VStack>

        <VStack justifyContent="flex-start">
          <Text textStyle="subheading" fontSize={["9px", "11px"]}>
            Clothes
          </Text>
          {items.clothes.map((i, idx) => {
            return <Item componentValue={i} key={idx} />;
          })}
        </VStack>

        <VStack justifyContent="flex-start">
          <Text textStyle="subheading" fontSize={["9px", "11px"]}>
            Shoes
          </Text>
          {items.foot.map((i, idx) => {
            return <Item componentValue={i} key={idx} />;
          })}
        </VStack>

        <VStack justifyContent="flex-start">
          <Text textStyle="subheading" fontSize={["9px", "11px"]}>
            Vehicles
          </Text>
          {items.vehicles.map((i, idx) => {
            return <Item componentValue={i} key={idx} />;
          })}
        </VStack>
      </HStack>

      <Box minH="80px"></Box>
    </Layout>
  );
}

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
    <HStack w="full" gap={3} borderBottom="solid 1px" borderBottomColor="neon.700" mb={1} pb={1} fontSize={"xs"}>
      <Layer rects={componentValue.resources[0]} width="48px" height="48px" crop={true} />
      <Text w="130px" ml={1}>
        {itemFull.name}
      </Text>
      <ChakraTooltip label={desc} color="neon.400">
        <span>
          <TierIndicator tier={itemFull.tier} />
        </span>
      </ChakraTooltip>
    </HStack>
  );
};
