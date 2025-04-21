import { Button, Input } from "@/components/common";
import { Hustler, Hustlers, hustlersCount } from "@/components/hustlers";
import { Arrow } from "@/components/icons";
import { Footer, Layout } from "@/components/layout";
import { PowerMeter } from "@/components/player";
import { BuyPaper, ChildrenOrConnect, PaperFaucet, PaperFaucetButton, TokenBalance } from "@/components/wallet";
import { gameModeFromName, gameModeFromNameKeys } from "@/dojo/helpers";
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
import { Sounds, playSound } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
import { IsMobile, formatCash } from "@/utils/ui";
import { Box, Card, HStack, Heading, Text, VStack, Image } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useRef, useState } from "react";
import { shortString } from "starknet";
import { useDojoTokens } from "@dope/dope-sdk/hooks";
import { HustlerPreviewFromLoot } from "@dope/dope-sdk/components";
import { getContractByName } from "@dojoengine/core";
import { useDopeStore } from "@dope/dope-sdk/store";

const New = observer(() => {
  const { router, isRyoDotGame, isLocalhost, gameModeName } = useRouterContext();
  const gameMode = gameModeFromName[gameModeName as gameModeFromNameKeys] as GameMode;
  const {
    chains: { selectedChain },
    clients: { toriiClient },
  } = useDojoContext();

  const { account } = useAccount();
  const addresses = useMemo(() => {
    return [getContractByName(selectedChain.manifest, "dojo", "DopeLoot")!.address];
  }, []);

  const { tokens, tokensBalances, accountTokens } = useDojoTokens(toriiClient, addresses, account);

  const ownLoot = useMemo(() => {
    return accountTokens && accountTokens?.length > 0;
  }, [accountTokens]);
  // todo: filter accountTokens
  // console.log(tokens)
  // console.log(accountTokens)

  const { createGame, isPending } = useSystems();
  const configStore = useConfigStore();
  const { config } = configStore;
  const { season } = useSeasonByVersion(config?.ryo.season_version);

  const { toast } = useToast();

  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [hustlerId, setHustlerId] = useState(Math.floor(Math.random() * 3));
  const [hustlerStats, setHustlerStats] = useState<any>();
  const isMobile = IsMobile();

  const inputRef = useRef<null | HTMLDivElement>(null);

  const [selectedLootToken, setSelectedLootToken] = useState(0);

  const { balance, isInitializing } = useTokenBalance({
    address: account?.address,
    token: config?.ryoAddress.paper,
    refetchInterval: 5_000,
  });

  const dopeLootClaimState = useDopeStore((state) => state.dopeLootClaimState);

  useEffect(() => {
    const hustler = configStore.getHustlerById(hustlerId);
    if (!hustler) return;

    const stats = {
      [ItemSlot.Weapon]: {
        name: shortString.decodeShortString(hustler.weapon.base.name),
        // name: hustler.weapon.base.name,
        initialTier: Number(hustler.weapon.base.initial_tier),
      },
      [ItemSlot.Clothes]: {
        name: shortString.decodeShortString(hustler.clothes.base.name),
        // name: hustler.clothes.base.name,
        initialTier: Number(hustler.clothes.base.initial_tier),
      },
      [ItemSlot.Feet]: {
        name: shortString.decodeShortString(hustler.feet.base.name),
        // name: hustler.feet.base.name,
        initialTier: Number(hustler.feet.base.initial_tier),
      },
      [ItemSlot.Transport]: {
        name: shortString.decodeShortString(hustler.transport.base.name),
        // name: hustler.transport.base.name,
        initialTier: Number(hustler.transport.base.initial_tier),
      },
    };

    setHustlerStats(stats);
  }, [hustlerId, configStore, configStore?.config, configStore?.config?.items, configStore?.config?.tiers]);

  useEffect(() => {
    if (accountTokens && accountTokens[selectedLootToken]) {
      const lootId = accountTokens ? Number(accountTokens[selectedLootToken].token_id) : 0;
      setHustlerId(lootId % 3);
    }
  }, [selectedLootToken, accountTokens]);

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

      const selectedLootTokenId = accountTokens!.length > 0 ? Number(accountTokens![selectedLootToken].token_id) : 0;

      await createGame(gameMode, hustlerId, name, selectedLootTokenId);
    } catch (e) {
      console.log(e);
    }
  };

  if (!configStore || !hustlerStats || !season) return null;

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
                {selectedChain.name !== "MAINNET" && balance < 1000n * ETHER && <PaperFaucetButton />}
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
      <VStack w={["full", "540px"]} margin="auto">
        <VStack w="full" gap={[3, 6]}>
          <VStack>
            <Text textStyle="subheading" fontSize={["10px", "11px"]} letterSpacing="0.25em">
              Choose your
            </Text>
            <Heading fontSize={["30px", "48px"]} fontWeight="400" textAlign="center">
              Hustler...
            </Heading>
          </VStack>

          {accountTokens && accountTokens?.length > 0 && (
            <HStack align="center" justify="center">
              <Arrow
                style="outline"
                direction="left"
                boxSize="48px"
                userSelect="none"
                cursor="pointer"
                onClick={() => {
                  playSound(Sounds.HoverClick, 0.3);
                  selectedLootToken > 0
                    ? setSelectedLootToken((selectedLootToken - 1) % accountTokens.length)
                    : setSelectedLootToken(accountTokens.length - 1);
                }}
              />

              <Box position="relative" width="200px" height="200px">
                <HustlerPreviewFromLoot tokenId={Number(accountTokens[selectedLootToken].token_id)} />
                {!dopeLootClaimState[Number(accountTokens[selectedLootToken].token_id)]?.isReleased ? (
                  <Image
                    src="/images/prisonbar.png"
                    style={{ imageRendering: "pixelated" }}
                    top={0}
                    width="full"
                    height="full"
                    position="absolute"
                  />
                ) : (
                  <Image
                    src="/images/prisonbar-released.png"
                    style={{ imageRendering: "pixelated", zIndex: -1, margin: "auto" }}
                    top={0}
                    width="70%"
                    height="70%"
                    position="absolute"
                  />
                )}
              </Box>

              <Arrow
                style="outline"
                direction="right"
                boxSize="48px"
                userSelect="none"
                cursor="pointer"
                onClick={() => {
                  playSound(Sounds.HoverClick, 0.3);
                  setSelectedLootToken((selectedLootToken + 1) % accountTokens.length);
                }}
              />
            </HStack>
          )}

          <HStack /*my="30px"*/ align="center" justify="center">
            <Arrow
              style="outline"
              direction="left"
              boxSize="48px"
              userSelect="none"
              cursor="pointer"
              visibility={ownLoot ? "hidden" : "visible"}
              onClick={() => {
                if (ownLoot) return;
                playSound(Sounds.HoverClick, 0.3);
                hustlerId > 0 ? setHustlerId(hustlerId - 1) : setHustlerId(hustlersCount - 1);
              }}
            />

            <HStack p={["10px 0", "10px"]}>
              <Box>
                <Hustler hustler={hustlerId as Hustlers} w={["80px", "160px"]} h={["180px", "250px"]} />
              </Box>

              <VStack w="full" gap={3}>
                <HStack w="full">
                  {!isMobile && (
                    <VStack alignItems="flex-start" w="200px" gap={0}>
                      <Text textStyle="subheading" fontSize="10px" color="neon.500">
                        WEAPON
                      </Text>
                      <Text>{hustlerStats[ItemSlot.Weapon].name}</Text>
                    </VStack>
                  )}

                  <PowerMeter
                    basePower={hustlerStats[ItemSlot.Weapon].initialTier}
                    maxPower={hustlerStats[ItemSlot.Weapon].initialTier + 3}
                    power={hustlerStats[ItemSlot.Weapon].initialTier}
                    displayedPower={6}
                    text="ATK"
                  />
                </HStack>

                <HStack w="full">
                  {!isMobile && (
                    <VStack alignItems="flex-start" w="200px" gap={0}>
                      <Text textStyle="subheading" fontSize="10px" color="neon.500">
                        CLOTHES
                      </Text>
                      <Text>{hustlerStats[ItemSlot.Clothes].name}</Text>
                    </VStack>
                  )}

                  <PowerMeter
                    basePower={hustlerStats[ItemSlot.Clothes].initialTier}
                    maxPower={hustlerStats[ItemSlot.Clothes].initialTier + 3}
                    power={hustlerStats[ItemSlot.Clothes].initialTier}
                    displayedPower={6}
                    text="DEF"
                  />
                </HStack>

                <HStack w="full">
                  {!isMobile && (
                    <VStack alignItems="flex-start" w="200px" gap={0}>
                      <Text textStyle="subheading" fontSize="10px" color="neon.500">
                        FEET
                      </Text>
                      <Text>{hustlerStats[ItemSlot.Feet].name}</Text>
                    </VStack>
                  )}

                  <PowerMeter
                    basePower={hustlerStats[ItemSlot.Feet].initialTier}
                    maxPower={hustlerStats[ItemSlot.Feet].initialTier + 3}
                    power={hustlerStats[ItemSlot.Feet].initialTier}
                    displayedPower={6}
                    text="SPD"
                  />
                </HStack>

                <HStack w="full">
                  {!isMobile && (
                    <VStack alignItems="flex-start" w="200px" gap={0}>
                      <Text textStyle="subheading" fontSize="10px" color="neon.500">
                        BAG
                      </Text>
                      <Text>{hustlerStats[ItemSlot.Transport].name}</Text>
                    </VStack>
                  )}

                  <PowerMeter
                    basePower={hustlerStats[ItemSlot.Transport].initialTier}
                    maxPower={hustlerStats[ItemSlot.Transport].initialTier + 3}
                    power={hustlerStats[ItemSlot.Transport].initialTier}
                    displayedPower={6}
                    text="INV"
                  />
                </HStack>
              </VStack>
            </HStack>

            <Arrow
              style="outline"
              direction="right"
              boxSize="48px"
              userSelect="none"
              cursor="pointer"
              visibility={ownLoot ? "hidden" : "visible"}
              onClick={() => {
                if (ownLoot) return;
                playSound(Sounds.HoverClick, 0.3);
                setHustlerId((hustlerId + 1) % hustlersCount);
              }}
            />
          </HStack>

          {
            /*!isRyoDotGame && !isMobile && */ season.paper_fee > 0 && (
              <Card p={3}>
                <HStack gap={6} fontSize="14px">
                  <VStack gap={0} alignItems="center" minW="240px">
                    <HStack w="full" justifyContent="space-between">
                      <Text color="yellow.400">ENTRY FEE</Text>
                      {gameMode == GameMode.Ranked && (
                        <Text color="yellow.400">{formatCash(season.paper_fee).replace("$", "")} PAPER</Text>
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
              maxLength={20}
              placeholder="Enter your name"
              autoFocus
              value={name}
              onChange={(e) => {
                setError("");
                setName(e.target.value);
              }}
            />

            <VStack w="full" h="30px">
              <Text w="full" align="center" color="red" display={name.length === 20 ? "block" : "none"}>
                Max 20 characters
              </Text>
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
