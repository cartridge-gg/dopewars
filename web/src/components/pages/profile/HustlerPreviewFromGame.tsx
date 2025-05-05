import { GameWithTokenIdCreated } from "@/components/layout/GlobalEvents";
import { useGameStore } from "@/dojo/hooks";
import { defaultHustlerMetadata, HustlerPreview } from "@dope/dope-sdk/components";
import { feltToString } from "@dope/dope-sdk/helpers";
import { ParsedToken } from "@dope/dope-sdk/store";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";

export const HustlerPreviewFromGame = observer(
  ({ gameId, tokenId, renderMode = 0, ...props }: { gameId: number; tokenId: number; renderMode?: number }) => {
    const gameStore = useGameStore();
    const [gameWithTokenId, setGameWithTokenId] = useState<undefined | GameWithTokenIdCreated>();

    useEffect(() => {
      const initAsync = async ()=> {
        const game = await gameStore.getGameWithTokenIdCreated(gameId);
        // @ts-ignore
        setGameWithTokenId(game as GameWithTokenIdCreated);
      };

      if (gameId) {
        initAsync();
      }
      //
    }, [gameId]);

    const [hustlerMeta, setHustlerMeta] = useState({
      ...defaultHustlerMetadata,
      name: `#${tokenId}`,
      foreground: 4,
      background: 0,
      render_mode: renderMode,
    });

    useEffect(() => {
      setHustlerMeta({
        ...hustlerMeta,
        name: `#${tokenId}`,
      });
    }, [tokenId]);

    const hustlerBody = useMemo(() => {
      if (!gameWithTokenId) return [];
      return gameWithTokenId.hustler_body.reduce(
        (a, v) => ({
          ...a,
          [feltToString(v.slot)]: v.value,
        }),
        {},
      );
    }, [gameWithTokenId]);

    const hustlerEquipment = useMemo(() => {
      if (!gameWithTokenId) return [];
      return gameWithTokenId.hustler_equipment
        .filter((i) => i.gear_item_id.isSome())
        .reduce(
          (a, v) => ({
            ...a,
            [feltToString(v.slot)]: { token_id: BigInt(v.gear_item_id.Some!) } as ParsedToken,
          }),
          {},
        );
    }, [gameWithTokenId]);

    //

    const renderOptions = useMemo(() => {
      let pixelSize = 5;
      let imageWidth = 64;
      let imageHeight = 64;
      let transform = "translate(0,0)";

      if (hustlerMeta.render_mode === 1) {
        pixelSize = 2;
        imageWidth = 160;
        imageHeight = 160;
        transform = "translate(18.75%,3%)";
      }
      if (hustlerMeta.render_mode === 2) {
        transform = "scale(3) translate(-1%,23.75%)";
      }

      return {
        pixelSize,
        imageWidth,
        imageHeight,
        transform,
      };
    }, [hustlerMeta]);

    if (!gameWithTokenId || !hustlerEquipment) return null;
    return (
      <>
        <HustlerPreview
          tokenId={tokenId}
          hustlerMeta={hustlerMeta}
          setHustlerMeta={setHustlerMeta}
          hustlerEquipment={hustlerEquipment}
          hustlerBody={hustlerBody}
          renderOptions={renderOptions}
          noInput={true}
          {...props}
        />
      </>
    );
  },
);
