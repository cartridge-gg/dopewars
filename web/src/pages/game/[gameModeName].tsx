import { Button, Input, Tooltip } from "@/components/common";
import { Arrow, ExternalLink, Link, Warning } from "@/components/icons";
import { Footer, Layout } from "@/components/layout";
import { PowerMeter, TierIndicator } from "@/components/player";
import { BuyPaper, ChildrenOrConnect, PaperFaucet, PaperFaucetButton, TokenBalance } from "@/components/wallet";
import { gameModeFromName, gameModeFromNameKeys, itemSlotToDopeLootSlotId, weaponIdToSound } from "@/dojo/helpers";
import {
  ETHER,
  useConfigStore,
  useDojoContext,
  useRouterContext,
  useSeasonByVersion,
  useSystems,
  useTokenBalance,
} from "@/dojo/hooks";
import { GameMode, ItemSlot } from "@/dojo/types";
import { play } from "@/hooks/media";
import { Sounds, WeaponSounds, playSound } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
import { IsMobile, formatCash } from "@/utils/ui";
import { Box, Card, HStack, Heading, Text, VStack, Image, Flex } from "@chakra-ui/react";
import { useAccount, useConnect } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDojoTokens, useLootEquipment, useEquipment, ParsedToken } from "@/dope/hooks";
import { HustlerPreviewFromLoot, HustlerPreviewFromHustler } from "@/dope/components";
import { getContractByName } from "@dojoengine/core";
import { useDopeStore } from "@/dope/store";
import { hash } from "starknet";
import { getGearItem } from "@/dope/helpers";
import { EditButton } from "@/components/pages/admin/tables";
import { ControllerConnector } from "@cartridge/connector";
import { useSwipeable } from "react-swipeable";

export enum TokenIdType {
  GuestLootId,
  LootId,
  HustlerId,
}

const New = observer(() => {
  const { router, isRyoDotGame, isLocalhost, gameModeName } = useRouterContext();
  const gameMode = gameModeFromName[gameModeName as gameModeFromNameKeys] as GameMode;
  const {
    chains: { selectedChain },
    clients: { toriiClient },
  } = useDojoContext();
  const { connector } = useConnect();

  const { account } = useAccount();
  const { mintGameToken, createGame, isPending } = useSystems();
  const configStore = useConfigStore();
  const { config } = configStore;
  const { season } = useSeasonByVersion(config?.ryo.season_version);

  const { toast } = useToast();

  // const [selectedTokenIdType, setSelectedTokenIdType] = useState(TokenIdType.GuestLootId);
  const [selectedTokenIdType, setSelectedTokenIdType] = useState(
    (Number(router.query.tokenIdType) as TokenIdType) || TokenIdType.GuestLootId,
  );

  const addresses = useMemo(() => {
    return [
      getContractByName(selectedChain.manifest, "dope", "DopeLoot")!.address,
      getContractByName(selectedChain.manifest, "dope", "DopeHustlers")!.address,
    ];
  }, [selectedChain.manifest]);

  const { tokens, tokensBalances, accountTokens } = useDojoTokens(toriiClient, addresses, account?.address);

  const freeToPlay = useMemo(() => {
    if (!config?.ryo.season_version) return [];
    const tokens = [];
    for (let i = 0; i < 8; i++) {
      let h = BigInt(hash.computePoseidonHashOnElements([config?.ryo.season_version.toString(), i.toString()]));
      const token_id = (h % 8000n) + 1n;
      tokens.push({ token_id });
    }
    return tokens as ParsedToken[];
  }, [config?.ryo.season_version]);

  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);
  const selectableTokens = useMemo(() => {
    setSelectedTokenIndex(0);
    switch (selectedTokenIdType) {
      case TokenIdType.GuestLootId:
        return freeToPlay;
      case TokenIdType.LootId:
        return (accountTokens || []).filter(
          (i) => i.contract_address === getContractByName(selectedChain.manifest, "dope", "DopeLoot")!.address,
        );
      case TokenIdType.HustlerId:
        return (accountTokens || []).filter(
          (i) => i.contract_address === getContractByName(selectedChain.manifest, "dope", "DopeHustlers")!.address,
        );
    }
  }, [accountTokens, selectedTokenIdType, freeToPlay, selectedChain.manifest]);

  useEffect(() => {
    router.replace({
      pathname: location.pathname,
      search: `tokenIdType=${selectedTokenIdType}`,
    });
  }, [selectedTokenIdType]);

  const inputRef = useRef<null | HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [multiplier, setMultipler] = useState(1);
  const isMobile = IsMobile();

  useEffect(() => {
    const initAsync = async () => {
      const username = await (connector as unknown as ControllerConnector).controller.username();
      setName(username?.substring(0, 16) || "");
    };
    if (connector) {
      initAsync();
    }
  }, [connector, account?.address]);

  const selectedToken = useMemo(() => {
    return selectableTokens[selectedTokenIndex];
  }, [selectableTokens, selectedTokenIndex]);

  const { balance, isInitializing } = useTokenBalance({
    address: account?.address,
    token: config?.ryoAddress.paper,
    refetchInterval: 10_000,
  });

  const dopeLootClaimState = useDopeStore((state) => state.dopeLootClaimState);

  const isReleased = useMemo(() => {
    if (selectedTokenIdType !== TokenIdType.LootId) return true;
    return (
      selectableTokens[selectedTokenIndex] &&
      dopeLootClaimState[Number(selectableTokens[selectedTokenIndex].token_id)]?.isReleased
    );
  }, [dopeLootClaimState, selectedToken, selectedTokenIdType]);

  const { equipment: lootEquipment } = useLootEquipment(Number(selectedToken?.token_id));
  const { equipment: hustlerEquipment } = useEquipment(toriiClient, Number(selectedToken?.token_id).toString());

  const equipmentStats = useMemo(() => {
    const equipment = {
      [ItemSlot.Weapon]: undefined,
      [ItemSlot.Clothes]: undefined,
      [ItemSlot.Feet]: undefined,
      [ItemSlot.Transport]: undefined,
    } as any;

    if (
      (selectedTokenIdType === TokenIdType.LootId || selectedTokenIdType === TokenIdType.GuestLootId) &&
      lootEquipment
    ) {
      const weapon_component_id = itemSlotToDopeLootSlotId[ItemSlot.Weapon];
      const clothe_component_id = itemSlotToDopeLootSlotId[ItemSlot.Clothes];
      const foot_component_id = itemSlotToDopeLootSlotId[ItemSlot.Feet];
      const vehicle_component_id = itemSlotToDopeLootSlotId[ItemSlot.Transport];

      const weapon = lootEquipment?.find((i) => i.gearItem.slot === weapon_component_id);
      const clothe = lootEquipment?.find((i) => i.gearItem.slot === clothe_component_id);
      const foot = lootEquipment?.find((i) => i.gearItem.slot === foot_component_id);
      const vehicle = lootEquipment?.find((i) => i.gearItem.slot === vehicle_component_id);

      const weaponFull = weapon && configStore.getGearItemFull(weapon.gearItem);
      const clotheFull = clothe && configStore.getGearItemFull(clothe.gearItem);
      const footFull = foot && configStore.getGearItemFull(foot.gearItem);
      const vehicleFull = vehicle && configStore.getGearItemFull(vehicle.gearItem);

      if (weaponFull) {
        equipment[ItemSlot.Weapon] = {
          name: weaponFull?.name,
          tier: weaponFull?.tier,
        };
      }
      if (clotheFull) {
        equipment[ItemSlot.Clothes] = {
          name: clotheFull?.name,
          tier: clotheFull?.tier,
        };
      }
      if (footFull) {
        equipment[ItemSlot.Feet] = {
          name: footFull?.name,
          tier: footFull?.tier,
        };
      }
      if (vehicleFull) {
        equipment[ItemSlot.Transport] = {
          name: vehicleFull?.name,
          tier: vehicleFull?.tier,
        };
      }
    } else if (selectedTokenIdType === TokenIdType.HustlerId && hustlerEquipment) {
      const weapon = hustlerEquipment?.find((i) => i.slot === "Weapon");
      const clothe = hustlerEquipment?.find((i) => i.slot === "Clothe");
      const foot = hustlerEquipment?.find((i) => i.slot === "Foot");
      const vehicle = hustlerEquipment?.find((i) => i.slot === "Vehicle");

      const weaponFull =
        weapon && weapon.gear_item_id !== undefined && configStore.getGearItemFull(getGearItem(weapon.gear_item_id!));
      const clotheFull =
        clothe && clothe.gear_item_id !== undefined && configStore.getGearItemFull(getGearItem(clothe.gear_item_id!));
      const footFull =
        foot && foot.gear_item_id !== undefined && configStore.getGearItemFull(getGearItem(foot.gear_item_id!));
      const vehicleFull =
        vehicle &&
        vehicle.gear_item_id !== undefined &&
        configStore.getGearItemFull(getGearItem(vehicle.gear_item_id!));

      if (weaponFull) {
        equipment[ItemSlot.Weapon] = {
          name: weaponFull?.name,
          tier: weaponFull?.tier,
        };
      }
      if (clotheFull) {
        equipment[ItemSlot.Clothes] = {
          name: clotheFull?.name,
          tier: clotheFull?.tier,
        };
      }
      if (footFull) {
        equipment[ItemSlot.Feet] = {
          name: footFull?.name,
          tier: footFull?.tier,
        };
      }
      if (vehicleFull) {
        equipment[ItemSlot.Transport] = {
          name: vehicleFull?.name,
          tier: vehicleFull?.tier,
        };
      }
    }
    return equipment;
  }, [lootEquipment, hustlerEquipment, selectedTokenIdType]);

  const create = async (gameMode: GameMode) => {
    setError("");
    if (name === "" || name.length > 16 || name.length < 3) {
      setError("Invalid name, at least 3 chars, max 16!");
      inputRef.current && inputRef.current.scrollIntoView();
      return;
    }

    try {
      if (!isLocalhost) {
        play();
      }

      const selectedLootTokenId = selectableTokens!.length > 0 ? Number(selectedToken.token_id) : 0;
      const tokenIdType = selectedTokenIdType;

      // mint game token
      const { tokenId: minigameTokenId } = await mintGameToken(name);
      console.log("[gameModeName.tsx] minigame token id: ", minigameTokenId);

      if (!minigameTokenId) {
        setError("Failed to mint game token");
        toast({ message: "Failed to mint game token", isError: true, duration: 5000 });
        return;
      }

      // create the game with minted token
      await createGame(gameMode, name, multiplier, tokenIdType, selectedLootTokenId, minigameTokenId);
    } catch (e) {
      console.log(e);
      setError("Game creation failed");
    }
  };

  const onClickPrev = () => {
    playSound(Sounds.HoverClick, 0.3);
    selectedTokenIndex > 0
      ? setSelectedTokenIndex((selectedTokenIndex - 1) % selectableTokens.length)
      : setSelectedTokenIndex(selectableTokens.length - 1);
  };

  const onClickNext = () => {
    playSound(Sounds.HoverClick, 0.3);
    setSelectedTokenIndex((selectedTokenIndex + 1) % selectableTokens.length);
  };

  const { ref: swipeableRef } = useSwipeable({ delta: 50, onSwipedLeft: onClickNext, onSwipedRight: onClickPrev });

  if (!configStore || !season) return null;

  return (
    <Layout
      isSinglePanel
      footer={
        <Footer>
          <Button
            w={["full", "auto"]}
            px={["auto", "20px"]}
            onClick={() => {
              playSound(Sounds.Ooo, 0.3);
              router.push("/");
            }}
          >
            Im scared
          </Button>

          <ChildrenOrConnect variant="primary" h="35px">
            {gameMode == GameMode.Ranked && (
              <>
                <Button
                  w={["full", "auto"]}
                  px={["auto", "20px"]}
                  isLoading={isPending}
                  onClick={() => create(gameMode)}
                  isDisabled={balance < 1000n * ETHER}
                >
                  Play
                </Button>
                {selectedChain.name !== "MAINNET" && balance < 10000n * ETHER && <PaperFaucetButton />}
              </>
            )}
            {gameMode == GameMode.Noob && (
              <Button w={["full", "auto"]} px={["auto", "20px"]} isLoading={isPending} onClick={() => create(gameMode)}>
                Play
              </Button>
            )}
          </ChildrenOrConnect>
          {/* <Button
              w={["full", "auto"]}
              px={["auto", "20px"]}
              isLoading={isPending}
              onClick={() => create(GameMode.Warrior)}
            >
              Play Warrior
            </Button> */}
        </Footer>
      }
    >
      <VStack w={["full", "700px"]} margin="auto">
        <VStack w="full" gap={[3, 6]} overflowX="hidden">
          <VStack>
            {/* {!isMobile && (
              <Text textStyle="subheading" fontSize={["10px", "11px"]} letterSpacing="0.25em">
                Choose your
              </Text>
            )}
            <Heading fontSize={["30px", "48px"]} fontWeight="400" textAlign="center">
              {isMobile && <span>Choose your</span>} Hustler
            </Heading> */}

            <Text textStyle="subheading" fontSize={["11px", "11px"]} my={["10px", "0"]} letterSpacing="0.25em">
              Choose your {isMobile && <span>Hustler...</span>}
            </Text>
            {!isMobile && (
              <Heading fontSize={["30px", "48px"]} fontWeight="400" textAlign="center">
                Hustler...
              </Heading>
            )}
          </VStack>

          <HStack gap={1}>
            <Button
              fontSize="11px"
              h="30px"
              variant="selectable"
              isActive={selectedTokenIdType === TokenIdType.GuestLootId}
              onClick={() => setSelectedTokenIdType(TokenIdType.GuestLootId)}
            >
              S{season.version} HUSTLERS
            </Button>
            <Button
              fontSize="11px"
              h="30px"
              variant="selectable"
              isActive={selectedTokenIdType === TokenIdType.LootId}
              onClick={() => setSelectedTokenIdType(TokenIdType.LootId)}
            >
              MY DOPE
            </Button>
            <Button
              fontSize="11px"
              h="30px"
              variant="selectable"
              isActive={selectedTokenIdType === TokenIdType.HustlerId}
              onClick={() => setSelectedTokenIdType(TokenIdType.HustlerId)}
            >
              MY HUSTLERS
            </Button>
          </HStack>

          {selectableTokens && selectableTokens?.length > 0 && selectedToken ? (
            <HStack ref={swipeableRef} align="center" justify="center" gap={[0, 9]} marginTop={"-30px"}>
              <Arrow
                style="outline"
                direction="left"
                boxSize="48px"
                userSelect="none"
                cursor="pointer"
                onClick={onClickPrev}
              />

              <VStack gap={3}>
                <Box
                  position="relative"
                  width={["220px", "280px"]}
                  height={["220px", "280px"]}
                  transform={["scale(1.7)", "scale(1.5)"]}
                  pointerEvents={"none"}

                  // style={{ filter: "grayscale(50%) sepia(80%) hue-rotate(60deg)" }}
                >
                  {selectedTokenIdType === TokenIdType.HustlerId ? (
                    <HustlerPreviewFromHustler tokenId={Number(selectedToken.token_id)} renderMode={1} />
                  ) : (
                    <HustlerPreviewFromLoot tokenId={Number(selectedToken.token_id)} renderMode={1} />
                  )}
                  {/* {ownLoot && !dopeLootClaimState[Number(selectableTokens[selectedLootToken].token_id)]?.isReleased && (
                    <Image
                      src="/images/prisonbar.png"
                      style={{ imageRendering: "pixelated" }}
                      top={0}
                      width="full"
                      height="full"
                      position="absolute"
                    />
                  )}
                  {ownLoot && dopeLootClaimState[Number(selectableTokens[selectedLootToken].token_id)]?.isReleased && (
                    <Image
                      src="/images/prisonbar-released.png"
                      style={{ imageRendering: "pixelated", zIndex: -1, margin: "auto" }}
                      top={0}
                      width="70%"
                      height="70%"
                      position="absolute"
                    />
                  )} */}
                </Box>

                {isMobile && equipmentStats && (
                  <HStack gap={3}>
                    <VStack gap={0}>
                      <Text textStyle="subheading" fontSize="8px" color="neon.500">
                        WEAPON
                      </Text>
                      <TierIndicator tier={equipmentStats![ItemSlot.Weapon]?.tier} />
                    </VStack>
                    <VStack gap={0}>
                      <Text textStyle="subheading" fontSize="8px" color="neon.500">
                        CLOTHES
                      </Text>
                      <TierIndicator tier={equipmentStats![ItemSlot.Clothes]?.tier} />
                    </VStack>
                    <VStack gap={0}>
                      <Text textStyle="subheading" fontSize="8px" color="neon.500">
                        FEET
                      </Text>
                      <TierIndicator tier={equipmentStats![ItemSlot.Feet]?.tier} />
                    </VStack>
                    <VStack gap={0}>
                      <Text textStyle="subheading" fontSize="8px" color="neon.500">
                        TRANSPORT
                      </Text>
                      <TierIndicator tier={equipmentStats![ItemSlot.Transport]?.tier} />
                    </VStack>
                  </HStack>
                )}
              </VStack>

              {!isMobile && equipmentStats && (
                <VStack w="full" gap={3} zIndex={1}>
                  <HStack w="full">
                    <VStack alignItems="flex-start" w="180px" gap={0}>
                      <Text textStyle="subheading" fontSize="10px" color="neon.500">
                        WEAPON
                      </Text>
                      {equipmentStats![ItemSlot.Weapon] ? (
                        <Text>{equipmentStats![ItemSlot.Weapon].name}</Text>
                      ) : (
                        <Text color={"red"}>No Weapon Equipped!</Text>
                      )}
                    </VStack>
                    <TierIndicator tier={equipmentStats![ItemSlot.Weapon]?.tier} />
                  </HStack>

                  <HStack w="full">
                    <VStack alignItems="flex-start" w="180px" gap={0}>
                      <Text textStyle="subheading" fontSize="10px" color="neon.500">
                        CLOTHES
                      </Text>
                      {equipmentStats![ItemSlot.Clothes] ? (
                        <Text>{equipmentStats![ItemSlot.Clothes].name}</Text>
                      ) : (
                        <Text color={"red"}>No Clothes Equipped!</Text>
                      )}
                    </VStack>
                    <TierIndicator tier={equipmentStats![ItemSlot.Clothes]?.tier} />
                  </HStack>

                  <HStack w="full">
                    <VStack alignItems="flex-start" w="180px" gap={0}>
                      <Text textStyle="subheading" fontSize="10px" color="neon.500">
                        FEET
                      </Text>
                      {equipmentStats![ItemSlot.Feet] ? (
                        <Text>{equipmentStats![ItemSlot.Feet].name}</Text>
                      ) : (
                        <Text color={"red"}>No Shoe Equipped!</Text>
                      )}
                    </VStack>
                    <TierIndicator tier={equipmentStats![ItemSlot.Feet]?.tier} />
                  </HStack>

                  <HStack w="full">
                    <VStack alignItems="flex-start" w="180px" gap={0}>
                      <Text textStyle="subheading" fontSize="10px" color="neon.500">
                        TRANSPORT
                      </Text>
                      {equipmentStats![ItemSlot.Transport] ? (
                        <Text>{equipmentStats![ItemSlot.Transport].name}</Text>
                      ) : (
                        <Text color={"red"}>No Vehicle Equipped!</Text>
                      )}
                    </VStack>
                    <TierIndicator tier={equipmentStats![ItemSlot.Transport]?.tier} />
                  </HStack>
                </VStack>
              )}

              <Arrow
                style="outline"
                direction="right"
                boxSize="48px"
                userSelect="none"
                cursor="pointer"
                onClick={onClickNext}
              />
            </HStack>
          ) : (
            <VStack minH={"250px"} alignItems="center" justifyContent="center">
              <Text>ERROR 420: {selectedTokenIdType === TokenIdType.HustlerId ? "Hustler" : "Dope"} not found</Text>
              <HStack>
                <Button onClick={() => router.push("/claim")}>Migration</Button>
                <Button
                  onClick={() => {
                    (connector as unknown as ControllerConnector).controller.openPurchaseCredits();
                  }}
                >
                  Buy
                </Button>
              </HStack>
            </VStack>
          )}

          <VStack alignItems="center" marginTop={["0px", "-40px"]} gap={0}>
            <Text>
              {selectedTokenIndex + 1}/{selectableTokens.length}{" "}
            </Text>
            {selectedToken ? (
              <HStack position="relative">
                {!isReleased && (
                  <Tooltip
                    color="yellow.400"
                    title="Dope Migration"
                    text="Play a game with this Dope to release it!"
                    placement="top"
                  >
                    <span>
                      <Warning color="yellow.400" ml={2} height={"16px"} width={"16px"} />
                    </span>
                  </Tooltip>
                )}
                <Text>
                  {selectedTokenIdType === TokenIdType.HustlerId
                    ? `${selectedToken.metadata.name}`
                    : `DOPE #${Number(selectedToken?.token_id)}`}
                  {selectedTokenIdType === TokenIdType.HustlerId && (
                    <ExternalLink
                      ml={2}
                      cursor="pointer"
                      onClick={() => router.push(`/dope/editor/${selectedToken.token_id}`)}
                    />
                  )}
                </Text>
              </HStack>
            ) : (
              <Text>ERR #420</Text>
            )}
          </VStack>

          {
            /*!isRyoDotGame && !isMobile && */ season.paper_fee > 0 && (
              <Card p={3} w="300px">
                <HStack gap={6} fontSize="14px">
                  <VStack gap={0} alignItems="center" minW="240px" w="full">
                    {gameMode == GameMode.Ranked && (
                      <HStack w="full" justifyContent={"space-between"}>
                        <Text color="yellow.400">STAKE x{multiplier}</Text>
                        <PowerMeter
                          basePower={0}
                          maxPower={10}
                          power={multiplier}
                          onSelect={(i: number) => {
                            setMultipler(i + 1);
                          }}
                        />
                        <Tooltip
                          color="yellow.400"
                          title="High stakes"
                          text="The higher the stakes, the greater the rewards."
                        >
                          <span>
                            <Warning color="yellow.400" height={"16px"} width={"16px"} />
                          </span>
                        </Tooltip>
                      </HStack>
                    )}

                    <HStack w="full" justifyContent="space-between" mt={1}>
                      <Text color="yellow.400">ENTRY FEE</Text>
                      {gameMode == GameMode.Ranked && (
                        <Text color="yellow.400">
                          {formatCash(season.paper_fee * multiplier).replace("$", "")} PAPER
                        </Text>
                      )}
                      {gameMode != GameMode.Ranked && (
                        <Text color="yellow.400">
                          <span style={{ textDecoration: "line-through" }}>
                            {formatCash(season.paper_fee).replace("$", "")}
                          </span>{" "}
                          PAPER
                        </Text>
                      )}
                    </HStack>

                    {account && (
                      <HStack w="full" justifyContent="space-between">
                        <Text>YOU OWN </Text>
                        <HStack>
                          <TokenBalance address={account?.address} token={config?.ryoAddress.paper} />
                          <Text>PAPER</Text>
                        </HStack>
                      </HStack>
                    )}
                    {selectedChain.name === "MAINNET" && <BuyPaper />}
                  </VStack>
                </HStack>
              </Card>
            )
          }

          <VStack w="full" ref={inputRef}>
            <Input
              display="flex"
              mx="auto"
              maxW="260px"
              maxLength={16}
              placeholder="Enter your name"
              autoFocus
              value={name}
              onChange={(e) => {
                setError("");
                setName(e.target.value);
              }}
            />

            <VStack w="full" h="30px">
              {/* <Text w="full" align="center" color="red" display={name.length === 20 ? "block" : "none"}>
                Max 20 characters
              </Text> */}
              <Text w="full" align="center" color="red" display={error !== "" ? "block" : "none"}>
                {error}
              </Text>
            </VStack>
          </VStack>

          <Box minH="80px" />
        </VStack>
      </VStack>
    </Layout>
  );
});

export default New;
