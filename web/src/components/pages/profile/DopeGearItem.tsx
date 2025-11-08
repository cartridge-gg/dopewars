import { itemSlotToSlotSlug } from "@/dojo/helpers";
import { ItemSlot } from "@/dojo/types";
import { HStack, StyleProps, Text } from "@chakra-ui/react";
import { Layer } from "@/dope/components";
import { useDopeStore } from "@/dope/store";
import { useMemo } from "react";

export const DopeGearItem = ({
  itemSlot,
  id,
  level,
  ...props
}: { itemSlot: ItemSlot; id: number; level?: number } & StyleProps) => {
  const componentValues = useDopeStore((state) => state.componentValues);
  const slotSlug = itemSlotToSlotSlug[itemSlot];

  const component = useMemo(() => {
    return componentValues.find((i) => i.collection_id === "DopeGear" && i.component_slug === slotSlug && i.id === id)!;
  }, [componentValues, slotSlug, id]);

  if (!component) return null;
  return <Layer rects={component.resources[0]} width="64px" height="64px" crop={true} glow={(level || 0) * 3} />;
};
