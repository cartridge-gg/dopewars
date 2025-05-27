import { Box, Flex, Input } from "@chakra-ui/react";
import { getGearItem } from "../helpers";
import { ParsedToken, useOgTitle } from "../hooks";
import { useDopeStore } from "../store";
import { ComponentValueEvent } from "../store/collection";
import { Layer } from "./Layer";

import { useCallback, useMemo } from "react";

export type HustlerMetadata = {
  token_id: bigint;
  name: string;
  background: number;
  foreground: number;
  render_mode: number;
};

export type BodySlotValues = Record<string, ComponentValueEvent[]>;
export type HustlerBody = Record<string, number>;

export type EquipmentSlotValues = Record<string, ComponentValueEvent[]>;
export type HustlerEquipment = Record<string, ParsedToken | undefined>;

export type RenderOptions = {
  pixelSize: number;
  imageWidth: number;
  imageHeight: number;
  transform: string;
};

export const defaultHustlerMetadata: HustlerMetadata = {
  token_id: 0n,
  name: "Loading...",
  background: 0,
  foreground: 0,
  render_mode: 0,
};

export const backgroundColors = [
  "transparent",
  "#434345",
  "#172217",
  "#97ADCC",
  "#F1D8AB",
  "#F2C4C5",
  "#B6CCC3",
  "#EDEFEE",
];
export const foregroundColors = ["#000000", "#333333", "#dddddd", "#ffffff", "#11ed83"];

export const HustlerPreview = ({
  tokenId,
  hustlerMeta,
  setHustlerMeta,
  hustlerEquipment,
  hustlerBody,
  renderOptions,
  noInput,
}: {
  tokenId: number;
  hustlerMeta: HustlerMetadata;
  setHustlerMeta: (e: HustlerMetadata) => void;
  hustlerEquipment: HustlerEquipment;

  hustlerBody: HustlerBody;
  renderOptions: RenderOptions;
  noInput: boolean;
}) => {
  const getEquipment = useCallback(
    (component_slug: string, values: ComponentValueEvent[]) => {
      const id = hustlerEquipment[component_slug as keyof HustlerEquipment]?.token_id;
      const item = id !== undefined ? values?.find((i) => i.id === getGearItem(id).item) : undefined;
      return item;
    },
    [hustlerEquipment],
  );

  const { title: ogTitle } = useOgTitle(Number(tokenId));
  const getComponentValuesBySlug = useDopeStore((state) => state.getComponentValuesBySlug);
  const getCollectionComponentList = useDopeStore((state) => state.getCollectionComponentList);

  const equipmentComponentSlugs = getCollectionComponentList("DopeHustlers", "Slots")!.components;

  const equipmentSlotValues: EquipmentSlotValues = equipmentComponentSlugs
    .map((component_slug) => {
      return {
        key: component_slug,
        values: getComponentValuesBySlug("DopeGear", component_slug),
      };
    })
    .reduce((a, v) => ({ ...a, [v.key]: v.values }), {});

  const bodyComponentSlugs = getCollectionComponentList("DopeHustlers", "BodyParts")!.components;

  const bodySlotValues: BodySlotValues = bodyComponentSlugs
    .map((component_slug) => {
      return {
        key: component_slug,
        values: getComponentValuesBySlug("DopeHustlers", component_slug),
      };
    })
    .reduce((a, v) => ({ ...a, [v.key]: v.values }), {});

  const shadow = getComponentValuesBySlug("DopeHustlers", "Shadow")?.find((i) => i.id === 0)!;
  const drugShadow = getComponentValuesBySlug("DopeHustlers", "Drug Shadow")?.find((i) => i.id === 0)!;

  const genderId = hustlerBody ? hustlerBody["Gender"] || 0 : 0;

  const layerProps = useMemo(() => {
    return {
      pixelSize: renderOptions.pixelSize,
      imageWidth: renderOptions.imageWidth,
      imageHeigh: renderOptions.imageHeight,
    };
  }, [renderOptions]);

  const vehicle = getEquipment("Vehicle", equipmentSlotValues["Vehicle"]);
  const drug = getEquipment("Drug", equipmentSlotValues["Drug"]);

  return (
    <Flex position="relative" w="100%" pb="100%" flexShrink={1} overflow="hidden">
      <LayerContainer>
        <Box
          w="full"
          h="full"
          style={{
            backgroundColor: backgroundColors[hustlerMeta.background],
          }}
        ></Box>
      </LayerContainer>

      {/* handle vehicle here */}
      {hustlerMeta.render_mode == 1 && vehicle && (
        <LayerContainer>
          <Layer rects={vehicle?.resources[0]} pixelSize={renderOptions.pixelSize} imageWidth={160} imageHeight={160} />
        </LayerContainer>
      )}

      <Box position="absolute" w="full" h="full" style={{ transform: renderOptions.transform }}>
        <LayerContainer>
          <Layer rects={shadow?.resources[genderId]} {...layerProps} />
        </LayerContainer>
        {drug && (
          <LayerContainer>
            <Layer rects={drugShadow?.resources[genderId]} {...layerProps} />
          </LayerContainer>
        )}

        {/* RENDER BODY */}
        {bodyComponentSlugs.map((component_slug: string, idx: number) => {
          if (!bodySlotValues || !hustlerBody) return null;

          const value = bodySlotValues[component_slug].find(
            (i: ComponentValueEvent) => i.id === hustlerBody[component_slug],
          )!;

          if (component_slug === "Beard" && genderId !== 0) return null;
          if (!value || !value.resources) return null;
          return (
            <LayerContainer key={idx}>
              <Layer rects={value.resources[genderId]} {...layerProps} />
            </LayerContainer>
          );
        })}

        {/* RENDER EQUIPMENT */}
        {equipmentComponentSlugs.map((component_slug: string, idx: number) => {
          if (!equipmentSlotValues || !hustlerEquipment) return null;
          if (component_slug === "Vehicle") return null;

          const value = getEquipment(component_slug, equipmentSlotValues[component_slug]);

          if (!value || !value.resources) return null;
          return (
            <LayerContainer key={idx}>
              <Layer rects={value.resources[genderId]} {...layerProps} />
            </LayerContainer>
          );
        })}
      </Box>
      {!noInput && (
        <LayerContainer>
          <Box
            position="absolute"
            w="full"
            top={2}
            textAlign="center"
            // className="absolute top-2 w-full text-center font-chicago text-[12px]"
            style={{ color: foregroundColors[hustlerMeta.foreground] }}
          >
            {ogTitle}
          </Box>
        </LayerContainer>
      )}
      <LayerContainer>
        {!noInput ? (
          <Input
            position="absolute"
            w="full"
            bg="transparent"
            bottom={0}
            border={0}
            textAlign="center"
            boxShadow="none !important"
            // className="absolute w-full bg-transparent bottom-2 border-0 rounded-0 text-center outline-none focus-visible:ring-0 font-chicago !text-[12px]"
            style={{ color: foregroundColors[hustlerMeta.foreground] }}
            value={hustlerMeta.name}
            maxLength={31}
            onChange={(e) =>
              setHustlerMeta({
                ...hustlerMeta,
                name: e.target.value,
              })
            }
          />
        ) : (
          <></>
          // <div
          //   className="absolute w-full bg-transparent bottom-2 border-0 rounded-0 text-center outline-none focus-visible:ring-0 font-chicago !text-[12px]"
          //   style={{ color: foregroundColors[hustlerMeta.foreground] }}
          // >
          //   {hustlerMeta.name}
          // </div>
        )}
      </LayerContainer>
    </Flex>
  );
};

const LayerContainer = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Box position="absolute" w="full" h="full">
      {children}
    </Box>
  );
};
