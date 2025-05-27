import { ToriiClient } from "@dojoengine/torii-client";
import { useEffect, useState } from "react";
import { parseModels } from "../toriiUtils";
import { feltToString } from "../helpers";

export type HustlerSlot = {
  token_id: bigint;
  slot: string;
  gear_item_id?: bigint;
};

export const useEquipment = (toriiClient: ToriiClient, tokenId: string) => {
  const [equipment, setEquipment] = useState<undefined | HustlerSlot[]>();

  useEffect(() => {
    const initAsync = async () => {
      const entities = await toriiClient.getEntities({
        clause: {
          Member: {
            model: "dope-HustlerSlot",
            member: "token_id",
            operator: "Eq",
            value: {
              Primitive: {
                Felt252: tokenId,
              },
            },
          },
        },
        pagination: {
          limit: 10_000,
          cursor: undefined,
          direction: "Forward",
          order_by: [],
        },
        no_hashed_keys: true,
        models: [],
        historical: false,
      });

      const parsedEquipment = parseModels(entities, "dope-HustlerSlot").map(
        (item) => {
          return {
            ...item,
            slot: feltToString(item.slot),
            token_id: BigInt(item.token_id),
            gear_item_id: item.gear_item_id.isSome()
              ? BigInt(item.gear_item_id.Some!)
              : undefined,
          } as HustlerSlot;
        }
      );

      setEquipment(parsedEquipment);
    };

    if (toriiClient && tokenId && tokenId !== "NaN") {
      setEquipment(undefined);
      initAsync();
    }
  }, [toriiClient, tokenId]);

  return {
    equipment,
  };
};
