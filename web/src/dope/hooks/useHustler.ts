import { ToriiClient } from "@dojoengine/torii-client";
import { useEffect, useState } from "react";
import {
  defaultHustlerMetadata,
  HustlerBody,
  HustlerMetadata,
} from "../components";
import { parseModels } from "../toriiUtils";
import { feltToString } from "../helpers";

export const useHustler = (toriiClient: ToriiClient, tokenId: number) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hustlerBody, setHustlerBody] = useState<HustlerBody>({});
  const [hustlerMeta, setHustlerMeta] = useState<HustlerMetadata>(
    defaultHustlerMetadata
  );

  useEffect(() => {
    const initAsync = async () => {
      // setHustlerMeta(defaultHustlerMetadata);
      const entities = await toriiClient.getEntities({
        clause: {
          Keys: {
            keys: [tokenId.toString() || "0"],
            models: ["dope-HustlerMetadata", "dope-HustlerBody"],
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

      const parsedHustlerMetadata = parseModels(
        entities,
        "dope-HustlerMetadata"
      )[0];

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

    // setHustlerMeta(defaultHustlerMetadata);
    if (tokenId && !Number.isNaN(tokenId)) {
      initAsync();
    }
  }, [tokenId]);

  return { hustlerBody, hustlerMeta, setHustlerBody, setHustlerMeta, isLoaded };
};
