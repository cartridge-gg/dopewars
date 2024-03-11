import { Button, Input } from "@/components/common";
import { Hustler, Hustlers, hustlersCount } from "@/components/hustlers";
import { Arrow } from "@/components/icons";
import { Footer, Layout } from "@/components/layout";
import { PowerMeter } from "@/components/player";
import { ChildrenOrConnect } from "@/components/wallet";
import { useConfigStore, useDojoContext, useRouterContext, useSystems } from "@/dojo/hooks";
import { GameMode, ItemSlot } from "@/dojo/types";
import { Sounds, playSound } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
import { Box, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function New() {
  const { router } = useRouterContext();

  const {
    account,
    burner: { create: createBurner, isDeploying: isBurnerDeploying },
  } = useDojoContext();

  const { createGame, isPending } = useSystems();
  const config = useConfigStore();

  const { toast } = useToast();

  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [hustlerId, setHustlerId] = useState(0);
  const [hustlerStats, setHustlerStats] = useState<any>();

  useEffect(() => {
    const hustler = config.getHustlerById(hustlerId);
    if (!hustler) return;

    const stats = {
      [ItemSlot.Weapon]: {
        //name: shortString.decodeShortString(hustler.weapon.base.name),
        name: hustler.weapon.base.name,
        initialTier: Number(hustler.weapon.base.initial_tier),
      },
      [ItemSlot.Clothes]: {
        // name: shortString.decodeShortString(hustler.clothes.base.name),
        name: hustler.clothes.base.name,
        initialTier: Number(hustler.clothes.base.initial_tier),
      },
      [ItemSlot.Feet]: {
        // name: shortString.decodeShortString(hustler.feet.base.name),
        name: hustler.feet.base.name,
        initialTier: Number(hustler.feet.base.initial_tier),
      },
      [ItemSlot.Transport]: {
        // name: shortString.decodeShortString(hustler.transport.base.name),
        name: hustler.transport.base.name,
        initialTier: Number(hustler.transport.base.initial_tier),
      },
    };

    setHustlerStats(stats);
  }, [hustlerId, config, config?.config, config?.config?.items, config?.config?.tiers]);

  const create = async (gameMode: GameMode) => {
    setError("");
    if (name === "" || name.length > 16 || name.length < 3) {
      setError("Invalid name, at least 3 chars, max 16!");
      return;
    }

    try {
      if (!account) {
        // create burner account
        await createBurner();
      }

      const { hash, gameId } = await createGame(gameMode, hustlerId, name);

      router.push(`/${gameId}/travel`);
    } catch (e) {
      console.log(e);
    }
  };

  if (!config || !hustlerStats) return null;

  return (
    <Layout
      isSinglePanel
      footer={
        <Footer>
          <ChildrenOrConnect>
            <Button
              w={["full", "auto"]}
              px={["auto", "20px"]}
              isLoading={isPending}
              onClick={() => create(GameMode.Unlimited)}
            >
              Play
            </Button>
          </ChildrenOrConnect>
        </Footer>
      }
    >
      <VStack w={["full", "540px"]} margin="auto">
        <VStack w="full">
          <VStack>
            <Text textStyle="subheading" fontSize={["10px", "11px"]} letterSpacing="0.25em">
              Choose your
            </Text>
            <Heading fontSize={["36px", "48px"]} fontWeight="400" textAlign="center">
              Hustler...
            </Heading>
          </VStack>

          <HStack my="30px" align="center" justify="center">
            <Arrow
              style="outline"
              direction="left"
              boxSize="48px"
              userSelect="none"
              cursor="pointer"
              onClick={() => {
                playSound(Sounds.HoverClick, 0.3);
                hustlerId > 0 ? setHustlerId(hustlerId - 1) : setHustlerId(hustlersCount - 1);
              }}
            />

            <HStack p="20px">
              <Box>
                <Hustler hustler={hustlerId as Hustlers} w="200px" h="300px" />
              </Box>

              <VStack w="full" gap={3}>
                <HStack w="full">
                  <VStack alignItems="flex-start" w="200px" gap={0}>
                    <Text textStyle="subheading" fontSize="10px" color="neon.500">
                      WEAPON
                    </Text>
                    <Text>{hustlerStats[ItemSlot.Weapon].name}</Text>
                  </VStack>

                  <PowerMeter
                    basePower={hustlerStats[ItemSlot.Weapon].initialTier}
                    maxPower={hustlerStats[ItemSlot.Weapon].initialTier + 3}
                    power={hustlerStats[ItemSlot.Weapon].initialTier}
                    displayedPower={6}
                    text="ATK"
                  />
                </HStack>

                <HStack w="full">
                  <VStack alignItems="flex-start" w="200px" gap={0}>
                    <Text textStyle="subheading" fontSize="10px" color="neon.500">
                      CLOTHES
                    </Text>
                    <Text>{hustlerStats[ItemSlot.Clothes].name}</Text>
                  </VStack>

                  <PowerMeter
                    basePower={hustlerStats[ItemSlot.Clothes].initialTier}
                    maxPower={hustlerStats[ItemSlot.Clothes].initialTier + 3}
                    power={hustlerStats[ItemSlot.Clothes].initialTier}
                    displayedPower={6}
                    text="DEF"
                  />
                </HStack>

                <HStack w="full">
                  <VStack alignItems="flex-start" w="200px" gap={0}>
                    <Text textStyle="subheading" fontSize="10px" color="neon.500">
                      FEET
                    </Text>
                    <Text>{hustlerStats[ItemSlot.Feet].name}</Text>
                  </VStack>

                  <PowerMeter
                    basePower={hustlerStats[ItemSlot.Feet].initialTier}
                    maxPower={hustlerStats[ItemSlot.Feet].initialTier + 3}
                    power={hustlerStats[ItemSlot.Feet].initialTier}
                    displayedPower={6}
                    text="SPD"
                  />
                </HStack>

                <HStack w="full">
                  <VStack alignItems="flex-start" w="200px" gap={0}>
                    <Text textStyle="subheading" fontSize="10px" color="neon.500">
                      BAG
                    </Text>
                    <Text>{hustlerStats[ItemSlot.Transport].name}</Text>
                  </VStack>

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
              onClick={() => {
                playSound(Sounds.HoverClick, 0.3);
                setHustlerId((hustlerId + 1) % hustlersCount);
              }}
            />
          </HStack>
          <Input
            display="flex"
            mx="auto"
            maxW="260px"
            maxLength={20}
            placeholder="Enter your name"
            autoFocus={true}
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
      </VStack>
    </Layout>
  );
}
