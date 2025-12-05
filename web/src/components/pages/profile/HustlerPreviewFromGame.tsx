import { GameCreated } from "@/components/layout/GlobalEvents";
import { useGameStore } from "@/dojo/hooks";
import { defaultHustlerMetadata, HustlerPreview } from "@/dope/components";
import { feltToString } from "@/dope/helpers";
import { ParsedToken } from "@/dope/store";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";

export const HustlerPreviewFromGame = observer(
  ({ gameId, tokenId, renderMode = 0, ...props }: { gameId: number; tokenId: number; renderMode?: number }) => {
    const gameStore = useGameStore();
    const [gameCreated, setGameCreated] = useState<undefined | GameCreated>();

    useEffect(() => {
      const initAsync = async () => {
        const game = await gameStore.getGameCreated(gameId);
        // @ts-ignore
        setGameCreated(game as GameCreated);
      };

      if (gameId) {
        initAsync();
      }
      //
    }, [gameId, gameStore]);

    const [hustlerMeta, setHustlerMeta] = useState({
      ...defaultHustlerMetadata,
      name: `#${tokenId}`,
      foreground: 4,
      background: 0,
      render_mode: renderMode,
    });

    useEffect(() => {
      setHustlerMeta((prev) => ({
        ...prev,
        name: `#${tokenId}`,
      }));
    }, [tokenId]);

    const hustlerBody = useMemo(() => {
      if (!gameCreated) return [];
      return gameCreated.hustler_body.reduce(
        (a, v) => ({
          ...a,
          [feltToString(v.slot)]: v.value,
        }),
        {},
      );
    }, [gameCreated]);

    const hustlerEquipment = useMemo(() => {
      if (!gameCreated) return [];
      return gameCreated.hustler_equipment
        .filter((i) => i.gear_item_id.isSome())
        .reduce(
          (a, v) => ({
            ...a,
            [feltToString(v.slot)]: { token_id: BigInt(v.gear_item_id.Some!) } as ParsedToken,
          }),
          {},
        );
    }, [gameCreated]);

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

    if (!gameCreated || !hustlerEquipment) return null;
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
