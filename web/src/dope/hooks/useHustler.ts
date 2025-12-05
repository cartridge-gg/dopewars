import { ToriiClient } from "@dojoengine/torii-client";
import { useEffect, useState } from "react";
import { defaultHustlerMetadata, HustlerBody, HustlerMetadata } from "../components";
import { parseModels } from "../toriiUtils";
import { feltToString } from "../helpers";
import { num } from "starknet";
import { useDojoContext } from "@/dojo/hooks";

export const useHustler = (toriiClient: ToriiClient, tokenId: number) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hustlerBody, setHustlerBody] = useState<HustlerBody>({});
  const [hustlerMeta, setHustlerMeta] = useState<HustlerMetadata>(defaultHustlerMetadata);

  const {
    chains: { selectedChain },
  } = useDojoContext();
  useEffect(() => {
    const initAsync = async () => {
      // setHustlerMeta(defaultHustlerMetadata);

      const entities = await toriiClient.getEntities({
        world_addresses: [selectedChain.manifest.world.address],
        clause: {
          Keys: {
            keys: [tokenId.toString() || "0"],
            // keys: [num.toHex64(tokenId.toString() || "0")], fk
            models: [],
            // models: ["dope-HustlerMetadata", "dope-HustlerBody"], // TODO: add it back when fixed
            pattern_matching: "VariableLen",
          },
        },
        pagination: {
          limit: 1_000,
          cursor: undefined,
          direction: "Forward",
          order_by: [],
        },
        no_hashed_keys: true,
        // models:[],
        models: ["dope-HustlerMetadata", "dope-HustlerBody"],
        historical: false,
      });

      const parsedHustlerMetadata = parseModels(entities, "dope-HustlerMetadata")[0];

      if (parsedHustlerMetadata) {
        parsedHustlerMetadata.token_id = BigInt(parsedHustlerMetadata.token_id);
      }

      const parsedHustlerBody = parseModels(entities, "dope-HustlerBody")
        .map((i) => {
          return {
            slot: feltToString(i.slot),
            value: i.value,
          };
        })
        .reduce((a, v) => ({ ...a, [v.slot]: v.value }), {});

      setHustlerMeta(parsedHustlerMetadata);
      setHustlerBody(parsedHustlerBody);
      setIsLoaded(true);
    };

    if (tokenId > -1 && !Number.isNaN(tokenId)) {
      initAsync();
    }
  }, [tokenId, selectedChain, toriiClient]);

  return { hustlerBody, hustlerMeta, setHustlerBody, setHustlerMeta, isLoaded };
};
