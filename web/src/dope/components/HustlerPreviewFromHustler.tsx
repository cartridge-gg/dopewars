import { useEffect, useMemo, useState } from "react";
import { defaultHustlerMetadata, HustlerPreview } from "./HustlerPreview";
import { useDopeStore } from "../store/DopeProvider";
import { ParsedToken, useEquipment, useHustler } from "../hooks";

export const HustlerPreviewFromHustler = ({
  tokenId,
  renderMode = 0,
  ...props
}: {
  tokenId: number;
  renderMode?: number;
}) => {
  const toriiClient = useDopeStore((state) => state.toriiClient);

  const [hustlerMeta, setHustlerMeta] = useState({
    ...defaultHustlerMetadata,
    name: `#${tokenId}`,
    foreground: 4,
    background: 0,
    render_mode: renderMode,
  });

  const { hustlerBody } = useHustler(toriiClient!, tokenId);

  useEffect(() => {
    setHustlerMeta({
      ...hustlerMeta,
      name: `#${tokenId}`,
    });
  }, [tokenId]);

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

  const { equipment } = useEquipment(toriiClient!, tokenId.toString());

  const hustlerEquipment = useMemo(() => {
    return equipment?.reduce(
      (a, v) => ({
        ...a,
        [v.slot]: { token_id: v.gear_item_id } as ParsedToken,
      }),
      {},
    );
  }, [equipment]);

  // console.log(tokenId, hustlerMeta, hustlerEquipment, hustlerBody, renderOptions)

  if (!hustlerEquipment) return null;
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
};
