import { useEffect, useMemo, useState } from "react";
import { defaultHustlerMetadata, HustlerBody, HustlerEquipment, HustlerPreview } from "./HustlerPreview";
import { useDopeStore } from "../store/DopeProvider";
import { dopeRandomness } from "../helpers";

export const HustlerPreviewFromLoot = ({
  tokenId,
  renderMode = 0,
  ...props
}: {
  tokenId: number;
  renderMode?: number;
}) => {
  const [hustlerMeta, setHustlerMeta] = useState({
    ...defaultHustlerMetadata,
    name: `#${tokenId}`,
    foreground: 4,
    background: 0, // tokenId % 6,
    render_mode: renderMode,
  });
  const hustlerBody = useMemo<HustlerBody>(() => {
    return {
      Gender: tokenId % 2,
      Body: tokenId % 5,
      Hair: tokenId % 19,
      Beard: tokenId % 13,
    };
  }, [tokenId]);

  useEffect(() => {
    setHustlerMeta({
      ...hustlerMeta,
      name: `#${tokenId}`,
    });
  }, [tokenId]);

  const getComponentValuesBySlug = useDopeStore((state) => state.getComponentValuesBySlug);

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

  const dummyProps = {
    contract_address: "",
    name: "",
    symbol: "",
    metadata: {},
    decimals: 0,
  };

  const hustlerEquipment: HustlerEquipment = {
    Clothe: {
      token_id: dopeRandomness("CLOTHES", tokenId) % BigInt(getComponentValuesBySlug("DopeGear", "Clothe")!.length),
      ...dummyProps,
    },
    Vehicle: {
      token_id: dopeRandomness("VEHICLE", tokenId) % BigInt(getComponentValuesBySlug("DopeGear", "Vehicle")!.length),
      ...dummyProps,
    },
    Drug: {
      token_id: dopeRandomness("DRUGS", tokenId) % BigInt(getComponentValuesBySlug("DopeGear", "Drug")!.length),
      ...dummyProps,
    },
    Waist: {
      token_id: dopeRandomness("WAIST", tokenId) % BigInt(getComponentValuesBySlug("DopeGear", "Waist")!.length),
      ...dummyProps,
    },
    Foot: {
      token_id: dopeRandomness("FOOT", tokenId) % BigInt(getComponentValuesBySlug("DopeGear", "Foot")!.length),
      ...dummyProps,
    },
    Hand: {
      token_id: dopeRandomness("HAND", tokenId) % BigInt(getComponentValuesBySlug("DopeGear", "Hand")!.length),
      ...dummyProps,
    },
    Neck: {
      token_id: dopeRandomness("NECK", tokenId) % BigInt(getComponentValuesBySlug("DopeGear", "Neck")!.length),
      ...dummyProps,
    },
    Ring: {
      token_id: dopeRandomness("RING", tokenId) % BigInt(getComponentValuesBySlug("DopeGear", "Ring")!.length),
      ...dummyProps,
    },
    Weapon: {
      token_id: dopeRandomness("WEAPON", tokenId) % BigInt(getComponentValuesBySlug("DopeGear", "Weapon")!.length),
      ...dummyProps,
    },
  };

  return (
    <>
      <HustlerPreview
        tokenId={Number(9999)}
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
