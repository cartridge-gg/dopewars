import { useEffect, useMemo, useState } from "react";

import { defaultHustlerMetadata, HustlerBody, HustlerEquipment, HustlerPreview } from "@/dope/components";
import { useDopeStore } from "@/dope/store";
import { dopeRandomness } from "@/dope/helpers";
import { PlayerStatus } from "@/dojo/types";

export const EncounterPreview = ({
  playerStatus,
  level,
  gameId,
  turn,
  renderMode = 0,
  ...props
}: {
  playerStatus: PlayerStatus;
  level: number;
  turn: number;
  gameId: number;
  renderMode?: number;
}) => {
  const randomness = dopeRandomness(gameId.toString(), turn);
  const tokenId = Number((randomness % 8000n) + 1n);

  const [hustlerMeta, setHustlerMeta] = useState({
    ...defaultHustlerMetadata,
    name: `#${tokenId}`,
    foreground: 4,
    background: 0, // tokenId % 6,
    render_mode: renderMode,
  });

  const hustlerBody = useMemo<HustlerBody>(() => {
    return {
      Gender: Number(randomness % 2n),
      Body: Number(randomness % 5n),
      Hair: Number(randomness % 19n),
      Beard: Number(randomness % 13n),
    };
  }, [randomness]);

  useEffect(() => {
    setHustlerMeta((prev) => ({
      ...prev,
      name: `#${tokenId}`,
    }));
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

  const isCop = playerStatus === PlayerStatus.BeingArrested;

  let footId = dopeRandomness("FOOT", tokenId) % BigInt(getComponentValuesBySlug("DopeGear", "Foot")!.length);
  let weaponId = dopeRandomness("WEAPON", tokenId) % BigInt(getComponentValuesBySlug("DopeGear", "Weapon")!.length);
  let waistId = dopeRandomness("WAIST", tokenId) % BigInt(getComponentValuesBySlug("DopeGear", "Waist")!.length);

  let neckId = BigInt(Math.ceil(level / 2) - 1);

  let clotheId = dopeRandomness("CLOTHES", tokenId) % BigInt(getComponentValuesBySlug("DopeGear", "Clothe")!.length);
  if (!isCop && clotheId === 11n) {
    clotheId = 12n;
  }

  if (isCop) {
    switch (level) {
      case 1:
        weaponId = 9n; // police baton
        break;
      case 2:
        weaponId = 10n; // peper spray
        break;
      case 3:
        weaponId = 13n; // tazer
        break;
      case 4:
        weaponId = 4n; // handgun
        break;
      case 5:
        weaponId = 15n; // shotgun
        break;
      case 6:
        weaponId = 5n; // ak
        break;
      default:
        weaponId = 9n; // police baton
    }
    footId = 13n; // alligator
    waistId = 10n; // pistol holder
    clotheId = 11n; // police uniform
  }

  const hustlerEquipment: HustlerEquipment = {
    Clothe: {
      token_id: clotheId,
      ...dummyProps,
    },
    Waist: {
      token_id: waistId,
      ...dummyProps,
    },
    Foot: {
      token_id: footId,
      ...dummyProps,
    },
    Neck: {
      token_id: neckId,
      ...dummyProps,
    },
    Weapon: {
      token_id: weaponId,
      ...dummyProps,
    },
  };

  if (isCop) {
    hustlerEquipment["Accessory"] = {
      token_id: 37n, // combo police
      ...dummyProps,
    };
  }

  if (!isCop) {
    hustlerEquipment["Drug"] = {
      token_id: dopeRandomness("DRUGS", tokenId) % BigInt(getComponentValuesBySlug("DopeGear", "Drug")!.length),
      ...dummyProps,
    };
    hustlerEquipment["Hand"] = {
      token_id: dopeRandomness("HAND", tokenId) % BigInt(getComponentValuesBySlug("DopeGear", "Hand")!.length),
      ...dummyProps,
    };
    hustlerEquipment["Ring"] = {
      token_id: dopeRandomness("RING", tokenId) % BigInt(getComponentValuesBySlug("DopeGear", "Ring")!.length),
      ...dummyProps,
    };
    hustlerEquipment["Accessory"] = {
      token_id: 22n, //cigarette mouth
      ...dummyProps,
    };
  }

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
