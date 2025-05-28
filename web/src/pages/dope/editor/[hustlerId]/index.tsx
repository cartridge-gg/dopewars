import { Footer, Layout } from "@/components/layout";
import { useDojoContext, useRouterContext } from "@/dojo/hooks";
import { useToast } from "@/hooks/toast";
import { IsMobile } from "@/utils/ui";
import { Button, HStack, Box, Text, Flex } from "@chakra-ui/react";
import { toToriiTokenId } from "@/dope/toriiUtils";
import {
  backgroundColors,
  BodySlotValues,
  foregroundColors,
  HustlerEquipment,
  HustlerPreview,
} from "@/dope/components";
import { checkTxReceipt, errorMessage, isOg } from "@/dope/helpers";
import { useDojoTokens, useEquipment, useHustler } from "@/dope/hooks";
import { ComponentValueEvent, useDopeStore } from "@/dope/store";

import { useAccount } from "@starknet-react/core";
import { useEffect, useMemo, useState } from "react";
import { byteArray, cairo, shortString, uint256 } from "starknet";
import { ComponentValuesSelector } from "@/components/editor/ComponentValuesSelector";
import { GenderSelector } from "@/components/editor/GenderSelector";
import { RenderModeSelector } from "@/components/editor/RenderModeSelector";
import { ColorPicker } from "@/components/editor/ColorPicker";
import { ItemPicker } from "@/components/editor/ItemPicker";
import { SmallLoader } from "@/components/layout/Loader";

// function Dope() {
//   const { router } = useRouterContext();
//   const { account } = useAccount();

//   const {
//     chains: { selectedChain },
//     clients: { toriiClient },
//   } = useDojoContext();

//   return (
//     <Layout
//       isSinglePanel
//       footer={
//         <Footer>
//           <Button
//             w={["full", "auto"]}
//             px={["auto", "20px"]}
//             onClick={() => {
//               router.back();
//             }}
//           >
//             Back
//           </Button>
//         </Footer>
//       }
//     >
//       <HStack w="full" gap={9} flexWrap="wrap" alignItems="flex-start" justifyContent="center">
//         <Text>EDITOR</Text>
//       </HStack>

//       <Box minH="80px"></Box>
//     </Layout>
//   );
// }

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

  //   const { tokens: hustlerTokens } = useDojoTokens(toriiClient, dopeHustlersAddressArr, undefined, tokenIds);

  const isMobile = IsMobile();
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

          <Button
            w={["full", "auto"]}
            px={["auto", "20px"]}
            onClick={onSave}
            isLoading={isLoading}
            spinner={<SmallLoader />}
          >
            SAVE
          </Button>
        </Footer>
      }
    >
      <Flex flexDirection="column" gap={6} alignItems={["flex-start", "center"]}>
        <Flex position="relative" flexDirection="row" gap={3}>
          <Box w={["280px", "300px"]} h={["280px", "300px"]}>
            <HustlerPreview
              tokenId={Number(hustlerId)}
              hustlerMeta={hustlerMeta}
              setHustlerMeta={setHustlerMeta}
              hustlerEquipment={hustlerEquipment}
              hustlerBody={hustlerBody}
              renderOptions={renderOptions}
              noInput={false}
            />
          </Box>
          {/* Body Config */}
          <Flex flexDirection="column" alignItems="center" justifyContent="space-between">
            <Flex flexDirection="column" gap={2}>
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
            </Flex>

            <Flex flexDirection="column" gap={2}>
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
            </Flex>

            <Flex flexDirection="column" gap={2}>
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
            </Flex>
          </Flex>
        </Flex>

        {/* Equipment ItemPickers */}
        {/* <div className="flex flex-col md:flex-row md:justify-center gap-2 flex-wrap max-w-[800px]"> */}
        <Flex
          flexDirection={["column", "row"]}
          flexWrap="wrap"
          maxW="700px"
          w="full"
          gap={2}
          alignItems={["flex-start", "center"]}
          justifyContent={"center"}
          //   className="flex flex-col md:flex-row md:justify-center gap-2 flex-wrap max-w-[800px]"
        >
          {equipmentComponentSlugs.map((component_slug, idx) => {
            return (
              <ItemPicker
                key={idx}
                variant={isMobile ? "List" : "Image"}
                title={component_slug}
                collection={"dope-DopeGear"}
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
                  e?.metadata?.attributes?.find((i: any) => i.trait_type === "Slot" && i.value === component_slug)
                }
              />
            );
          })}
        </Flex>
      </Flex>
    </Layout>
  );
}
