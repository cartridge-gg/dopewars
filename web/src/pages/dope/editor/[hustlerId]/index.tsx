import { Footer, Layout } from "@/components/layout";
import { useDojoContext, useRouterContext } from "@/dojo/hooks";
import { useToast } from "@/hooks/toast";
import { Button, HStack, Box, Text } from "@chakra-ui/react";
import { toToriiTokenId } from "@dope/dope-sdk";
import { BodySlotValues, HustlerEquipment, HustlerPreview, HustlerPreviewFromHustler } from "@dope/dope-sdk/components";
import { checkTxReceipt, errorMessage, isOg } from "@dope/dope-sdk/helpers";
import { useDojoTokens, useEquipment, useHustler } from "@dope/dope-sdk/hooks";
import { useDopeStore } from "@dope/dope-sdk/store";

import { useAccount } from "@starknet-react/core";
import { useEffect, useMemo, useState } from "react";
import { byteArray, cairo, shortString, uint256 } from "starknet";

function Dope() {
  const { router } = useRouterContext();
  const { account } = useAccount();

  const {
    chains: { selectedChain },
    clients: { toriiClient },
  } = useDojoContext();

  return (
    <Layout
      isSinglePanel
      footer={
        <Footer>
          <Button
            w={["full", "auto"]}
            px={["auto", "20px"]}
            onClick={() => {
              router.back();
            }}
          >
            Back
          </Button>
        </Footer>
      }
    >
      <HStack w="full" gap={9} flexWrap="wrap" alignItems="flex-start" justifyContent="center">
        <Text>EDITOR</Text>
      </HStack>

      <Box minH="80px"></Box>
    </Layout>
  );
}

export default function Editor() {
  const { router, hustlerId } = useRouterContext();

  const {
    clients: { toriiClient },
    contracts: { getDojoContractManifest },
  } = useDojoContext();

  const dopeHustlersContractManifest = getDojoContractManifest("dope-DopeHustlers");
  const dopeGearContractManifest = getDojoContractManifest("dope-DopeGear");

  const { account } = useAccount();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const getComponentValuesBySlug = useDopeStore((state) => state.getComponentValuesBySlug);

  const getCollectionComponentList = useDopeStore((state) => state.getCollectionComponentList);

  const dopeGearAddressArr = useMemo(() => {
    return [dopeGearContractManifest.address];
  }, []);
  const { tokens: allGearTokens } = useDojoTokens(toriiClient, dopeGearAddressArr);

  const tokenIds = useMemo(() => {
    return hustlerId ? [toToriiTokenId(hustlerId)] : [];
  }, [hustlerId]);

  const dopeHustlersAddressArr = useMemo(() => {
    return [dopeHustlersContractManifest.address];
  }, []);

  const { tokens: hustlerTokens } = useDojoTokens(toriiClient, dopeHustlersAddressArr, undefined, tokenIds);

  //   const isMobile = useIsMobile();
  const { equipment } = useEquipment(toriiClient, (hustlerId || 0).toString());

  const {
    hustlerBody,
    setHustlerBody,
    hustlerMeta,
    setHustlerMeta,
    isLoaded,
    // setIsLoaded,
  } = useHustler(toriiClient, Number(hustlerId));

  const [hustlerEquipment, setHustlerEquipment] = useState<HustlerEquipment>({});

  const [hustlerInitialEquipment, setHustlerInitialEquipment] = useState<HustlerEquipment>({});

  useEffect(() => {
    setHustlerEquipment({});
  }, [hustlerId]);

  const bodyComponentSlugs = getCollectionComponentList("DopeHustlers", "BodyParts")!.components;

  const bodySlotValues: BodySlotValues = bodyComponentSlugs
    .map((component_slug) => {
      return {
        key: component_slug,
        values: getComponentValuesBySlug("DopeHustlers", component_slug),
      };
    })
    .reduce((a, v) => ({ ...a, [v.key]: v.values }), {});

  if (!isOg(Number(hustlerId))) {
    bodySlotValues["Body"].pop();
  }

  const equipmentComponentSlugs = getCollectionComponentList("DopeHustlers", "Slots")!.components;

  useEffect(() => {
    if (equipment) {
      let newEquipment: HustlerEquipment = Object.assign({}, {}); // zzzzz
      for (let he of equipment) {
        newEquipment[he.slot] = allGearTokens?.find((t) => t.token_id === he.gear_item_id);
      }

      setHustlerEquipment(newEquipment);
      setHustlerInitialEquipment(newEquipment);
    } else {
      setHustlerEquipment({});
      setHustlerInitialEquipment({});
    }
  }, [equipment, allGearTokens, hustlerId]);

  const onSave = async () => {
    if (!account) {
      return toast({
        message: "Please connect your wallet",
        isError: true,
      });
    }

    const bodyParts = Object.keys(hustlerBody).map((key) => {
      return cairo.tuple(shortString.encodeShortString(key), hustlerBody[key]);
    });

    const equipmentIds = Object.keys(hustlerEquipment).flatMap((key) => {
      if (hustlerEquipment[key as keyof HustlerEquipment]) {
        return [hustlerEquipment[key as keyof HustlerEquipment]!.token_id];
      } else {
        return [];
      }
    });
    const equipmentIdsU256 = equipmentIds.map((i) => uint256.bnToUint256(i));

    const unequipSlotIds = Object.keys(hustlerEquipment).flatMap((key, idx) => {
      if (hustlerEquipment[key as keyof HustlerEquipment]) {
        return [];
      } else {
        return [key];
      }
    });

    try {
      setIsLoading(true);

      const execution = await account?.execute([
        {
          contractAddress: dopeHustlersContractManifest.address,
          entrypoint: "update_hustler",
          calldata: [
            hustlerMeta.token_id,
            byteArray.byteArrayFromString(hustlerMeta.name),
            hustlerMeta.background,
            hustlerMeta.foreground,
            hustlerMeta.render_mode,
          ],
        },
        {
          contractAddress: dopeHustlersContractManifest.address,
          entrypoint: "update_hustler_body",
          calldata: [uint256.bnToUint256(hustlerMeta.token_id), bodyParts],
        },
        {
          contractAddress: dopeGearContractManifest.address,
          entrypoint: "set_approval_for_all",
          calldata: [dopeHustlersContractManifest.address, 1],
        },
        {
          contractAddress: dopeHustlersContractManifest.address,
          entrypoint: "equip",
          calldata: [uint256.bnToUint256(hustlerMeta.token_id), equipmentIdsU256],
        },
        {
          contractAddress: dopeHustlersContractManifest.address,
          entrypoint: "unequip",
          calldata: [uint256.bnToUint256(hustlerMeta.token_id), unequipSlotIds],
        },
      ]);

      let txReceipt = await account.waitForTransaction(execution.transaction_hash, {
        retryInterval: 200,
      });

      checkTxReceipt(txReceipt);
      setIsLoading(false);

      toast({
        message: "Hustler updated!",
      });
    } catch (e: any) {
      setIsLoading(false);

      return toast({
        message: errorMessage(e.message),
        isError: true,
      });
    }

    // console.log(res)
  };

  const genderId = hustlerBody ? hustlerBody["Gender"] || 0 : 0;

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

  if (!isLoaded) {
    return null;
  }
  return (
    <Layout
      isSinglePanel
      footer={
        <Footer>
          <Button
            w={["full", "auto"]}
            px={["auto", "20px"]}
            onClick={() => {
              router.back();
            }}
          >
            Back
          </Button>

          <Button w={["full", "auto"]} px={["auto", "20px"]} onClick={onSave} isLoading={isLoading}>
            SAVE
          </Button>
        </Footer>
      }
    >
      <div className="flex flex-col gap-6 items-center">
        <div className="flex flex-col gap-12 items-center">
          <div className="relative flex flex-row gap-3">
            {/* <div className="w-[280px] h-[280px] md:w-[350px] md:h-[350px]">
              <HustlerPreviewFromHustler tokenId={Number(hustlerId)} renderMode={1} />
            </div> */}
            <div className="w-[280px] h-[280px] md:w-[350px] md:h-[350px]">
              <HustlerPreview
                tokenId={Number(hustlerId)}
                hustlerMeta={hustlerMeta}
                setHustlerMeta={setHustlerMeta}
                hustlerEquipment={hustlerEquipment}
                hustlerBody={hustlerBody}
                renderOptions={renderOptions}
                noInput={false}
              />
            </div>
            {/* Body Config */}
            {/* <div className="flex flex-col items-center justify-between">
            <div className="flex flex-col gap-2">
              <GenderSelector
                selectedId={hustlerBody["Gender"]}
                setSelectedId={(value: number) =>
                  setHustlerBody({
                    ...hustlerBody,
                    ["Gender"]: value,
                  })
                }
              />

              <RenderModeSelector
                selectedId={hustlerMeta.render_mode}
                setSelectedId={(e) =>
                  setHustlerMeta({
                    ...hustlerMeta,
                    render_mode: e,
                  })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <ComponentValuesSelector
                componentValues={bodySlotValues["Body"]!}
                index={genderId}
                selectedComponentValueId={hustlerBody["Body"]!}
                setSelectedComponentValue={(e: ComponentValueEvent) =>
                  setHustlerBody({
                    ...hustlerBody,
                    ["Body"]: e.id,
                  })
                }
              />

              <ComponentValuesSelector
                componentValues={bodySlotValues["Hair"]!}
                index={genderId}
                selectedComponentValueId={hustlerBody["Hair"]!}
                setSelectedComponentValue={(e: ComponentValueEvent) =>
                  setHustlerBody({
                    ...hustlerBody,
                    ["Hair"]: e.id,
                  })
                }
              />

              {genderId === 0 && (
                <ComponentValuesSelector
                  componentValues={bodySlotValues["Beard"]!}
                  index={genderId}
                  selectedComponentValueId={hustlerBody["Beard"]!}
                  setSelectedComponentValue={(e: ComponentValueEvent) =>
                    setHustlerBody({
                      ...hustlerBody,
                      ["Beard"]: e.id,
                    })
                  }
                />
              )}

              <ComponentValuesSelector
                componentValues={bodySlotValues["Eyes"]!}
                index={genderId}
                selectedComponentValueId={hustlerBody["Eyes"]!}
                setSelectedComponentValue={(e: ComponentValueEvent) =>
                  setHustlerBody({
                    ...hustlerBody,
                    ["Eyes"]: e.id,
                  })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <ColorPicker
                colors={backgroundColors}
                selectedColor={hustlerMeta.background}
                setSelectedColor={(c) => {
                  setHustlerMeta({
                    ...hustlerMeta,
                    background: c,
                  });
                }}
              />

              <ColorPicker
                colors={foregroundColors}
                selectedColor={hustlerMeta.foreground}
                setSelectedColor={(c) => {
                  setHustlerMeta({
                    ...hustlerMeta,
                    foreground: c,
                  });
                }}
              />
            </div>
          </div> */}
          </div>

          {/* Equipment ItemPickers */}
          {/* <div className="flex flex-col md:flex-row md:justify-center gap-2 flex-wrap max-w-[800px]">
          {equipmentComponentSlugs.map((component_slug) => {
            return (
              <ItemPicker
                variant={isMobile ? "List" : "Image"}
                title={component_slug}
                collection="dope-DopeGear"
                selected={hustlerEquipment[component_slug]}
                equipped={hustlerInitialEquipment[component_slug]}
                setSelected={(selected) =>
                  setHustlerEquipment({
                    ...hustlerEquipment,
                    [component_slug]: selected,
                  })
                }
                account={account}
                itemFilter={(e) =>
                  e?.metadata?.attributes?.find(
                    (i: any) =>
                      i.trait_type === "Slot" && i.value === component_slug,
                  )
                }
              />
            );
          })}
        </div> */}
        </div>
      </div>
    </Layout>
  );
}
