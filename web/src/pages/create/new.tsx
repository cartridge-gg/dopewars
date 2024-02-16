import Button from "@/components/Button";
import { Footer } from "@/components/Footer";
import Input from "@/components/Input";
import Layout from "@/components/Layout";
import { PowerMeter } from "@/components/PowerMeter";
import { Hustler, Hustlers, hustlersCount } from "@/components/hustlers";

import { Arrow } from "@/components/icons";
import { useDojoContext, useRouterContext, useSystems } from "@/dojo/hooks";
import { GameMode, ItemSlot } from "@/dojo/types";
import { Sounds, playSound } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
import { Box, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const hustlerStats = {
  [Hustlers.Dragon]: {
    [ItemSlot.Attack]: 3,
    [ItemSlot.Defense]: 1,
    [ItemSlot.Speed]: 2,
    [ItemSlot.Transport]: 1,
  },
  [Hustlers.Monkey]: {
    [ItemSlot.Attack]: 1,
    [ItemSlot.Defense]: 3,
    [ItemSlot.Speed]: 2,
    [ItemSlot.Transport]: 1,
  },
  [Hustlers.Rabbit]: {
    [ItemSlot.Attack]: 2,
    [ItemSlot.Defense]: 2,
    [ItemSlot.Speed]: 2,
    [ItemSlot.Transport]: 1,
  },
};

export default function New() {
  const { router } = useRouterContext();

  const {
    account,
    burner: { create: createBurner, isDeploying: isBurnerDeploying },
  } = useDojoContext();

  const { createGame, isPending } = useSystems();

  const { toast } = useToast();

  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [hustlerId, setHustlerId] = useState(0);

  const [stats, setStats] = useState(hustlerStats[0 as Hustlers]);

  useEffect(() => {
    setStats(hustlerStats[hustlerId as Hustlers]);
  }, [hustlerId]);

  const create = async (gameMode: GameMode) => {
    setError("");
    if (name === "" || name.length > 20 || name.length < 3) {
      setError("Invalid name, at least 3 chars, max 20!");
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

  return (
    <Layout
      isSinglePanel
      footer={
        <Footer>
          <Button
            w={["full", "auto"]}
            px={["auto", "20px"]}
            isLoading={isPending}
            onClick={() => create(GameMode.Unlimited)}
          >
            Play
          </Button>
        </Footer>
      }
    >
      <VStack w={["full", "440px"]} margin="auto">
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
                <Hustler hustler={hustlerId as Hustlers} w="150px" h="300px" />
              </Box>

              <VStack gap={3}>
                <PowerMeter
                  basePower={stats[ItemSlot.Attack]}
                  maxPower={6}
                  power={stats[ItemSlot.Attack]}
                  displayedPower={0}
                  text="ATK"
                />
                <PowerMeter
                  basePower={stats[ItemSlot.Defense]}
                  maxPower={6}
                  power={stats[ItemSlot.Defense]}
                  displayedPower={0}
                  text="DEF"
                />
                <PowerMeter
                  basePower={stats[ItemSlot.Speed]}
                  maxPower={6}
                  power={stats[ItemSlot.Speed]}
                  displayedPower={0}
                  text="SPD"
                />
                <PowerMeter
                  basePower={stats[ItemSlot.Transport]}
                  maxPower={6}
                  power={stats[ItemSlot.Transport]}
                  displayedPower={0}
                  text="INV"
                />
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
