import { useEffect, useState } from "react";
import { dopeRandomness, GearItem } from "../helpers";
import { useDopeStore } from "../store";

// export type HustlerSlot = {
//   token_id: bigint;
//   slot: string;
//   gear_item_id?: bigint;
// };

const slots = [
  {
    componentId: 0,
    ogName: "WEAPON",
    slotSlug: "Weapon",
  },
  {
    componentId: 1,
    ogName: "CLOTHES",
    slotSlug: "Clothe",
  },
  {
    componentId: 2,
    ogName: "VEHICLE",
    slotSlug: "Vehicle",
  },
  {
    componentId: 3,
    ogName: "DRUGS",
    slotSlug: "Drug",
  },
  {
    componentId: 4,
    ogName: "WAIST",
    slotSlug: "Waist",
  },
  {
    componentId: 5,
    ogName: "FOOT",
    slotSlug: "Foot",
  },
  {
    componentId: 6,
    ogName: "HAND",
    slotSlug: "Hand",
  },
  {
    componentId: 7,
    ogName: "NECK",
    slotSlug: "Neck",
  },
  {
    componentId: 7,
    ogName: "RING",
    slotSlug: "Ring",
  },
];

export type LootGearItem = {
  gearItem: GearItem;
  name: string;
  fullName: string;
};

export const useLootEquipment = (tokenId: number) => {
  const getComponentValuesBySlug = useDopeStore((state) => state.getComponentValuesBySlug);

  const [equipment, setEquipment] = useState<LootGearItem[] | undefined>();

  const suffixes = getComponentValuesBySlug("DopeLoot", "Suffixes");
  const namePrefixes = getComponentValuesBySlug("DopeLoot", "Name Prefixes");
  const nameSuffixes = getComponentValuesBySlug("DopeLoot", "Name Suffixes");

  const suffixCount = BigInt(suffixes.length);
  const namePrefixCount = BigInt(namePrefixes.length);
  const nameSuffixCount = BigInt(nameSuffixes.length);

  useEffect(() => {
    const equipment: LootGearItem[] = [];

    if (!Number.isNaN(tokenId)) {
      for (let slot of slots) {
        const random = dopeRandomness(slot.ogName, tokenId);
        const items = getComponentValuesBySlug("DopeGear", slot.slotSlug);
        const itemsCount = BigInt(items.length);

        const gearItem = {
          item: Number(random % itemsCount),
          slot: slot.componentId,
          name_prefix: 0,
          name_suffix: 0,
          suffix: 0,
          augmentation: 0,
        };
        const dopeness = random % 21n;
        if (dopeness > 14) {
          gearItem.suffix = Number((random % (suffixCount - 1n)) + 1n);
        }
        if (dopeness >= 19) {
          gearItem.name_prefix = Number((random % (namePrefixCount - 1n)) + 1n);
          gearItem.name_suffix = Number((random % (nameSuffixCount - 1n)) + 1n);
        }
        if (dopeness > 19) {
          gearItem.augmentation = 1;
        }

        let name = items[gearItem.item].value;

        equipment.push({
          gearItem,
          name,
          fullName: "TODO",
        });
      }
    }

    setEquipment(equipment);
  }, [tokenId, getComponentValuesBySlug, suffixCount, namePrefixCount, nameSuffixCount]);

  return {
    equipment,
  };
};
