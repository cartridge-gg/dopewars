import { Footer } from "@/components/Footer";
import Layout from "@/components/Layout";
import { Heading, Text, VStack, HStack, Grid } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import { Hustler } from "@/components/hustler";
import { Arrow } from "@/components/icons";
import { PowerMeter } from "@/components/PowerMeter";
import React, { useState } from "react";
import { GameMode } from "@/dojo/types";
import { useSystems } from "@/dojo/hooks/useSystems";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { validateAndParseAddress } from "starknet";

const PLACEHOLDER_STATS = [
  {
    equipment: "Weapon",
    name: "AK 47",
    stat: "ATK",
    basePower: 1,
    power: 4,
    maxPower: 4,
    displayedPower: 6,
  },
  {
    equipment: "Shirt",
    name: "Blood Stained Shirt",
    stat: "DEF",
    basePower: 3,

    power: 6,
    maxPower: 6,
    displayedPower: 6,
  },
  {
    equipment: "Shoes",
    name: "All-Black Sneakers",
    stat: "SPD",
    basePower: 2,
    power: 5,
    maxPower: 5,
    displayedPower: 6,
  },
  {
    equipment: "Bag",
    name: "Plastic Bag",
    stat: "INV",
    basePower: 1,
    power: 3,
    maxPower: 4,
    displayedPower: 6,
  },
];

export default function HustlerPage() {
  const router = useRouter();
  const name = router.query.name as string;
  const [error, setError] = useState("");

  const {
    account,
    burner: { create: createBurner, isDeploying: isBurnerDeploying },
  } = useDojoContext();
  const { createGame, isPending } = useSystems();

  const start = async (gameMode: GameMode) => {
    let address: bigint;
    const avatarId = 0;

    setError("");
    if (name === "" || name.length > 20 || name.length < 3) {
      setError("Invalid name, at least 3 chars, max 20!");
      return;
    }

    try {
      let value = validateAndParseAddress("");
      address = BigInt(value);
      setError("");
    } catch (e) {
      setError("Invalid address !");
      return;
    }

    try {
      if (!account) {
        // create burner account
        await createBurner();
      }

      const { gameId } = await createGame(gameMode, name, avatarId, address);

      router.push(`/${gameId}/travel`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Layout
        isSinglePanel
        footer={
          <Footer>
            {error && (
              <Text w="full" align="center" color="red">
                {error}
              </Text>
            )}
            <Button
              w={["full", "auto"]}
              px={["auto", "60px"]}
              onClick={() => {
                start(GameMode.Unlimited);
              }}
              isLoading={isPending}
            >
              Play
            </Button>
          </Footer>
        }
      >
        <VStack>
          <Text textStyle="subheading" fontSize={["10px", "11px"]} letterSpacing="0.25em">
            Choose your
          </Text>
          <Heading fontSize={["36px", "48px"]} fontWeight="400" textAlign="center">
            Hustler...
          </Heading>
          <HStack spacing={8}>
            <Arrow direction="left" cursor="pointer" style="outline" boxSize={10}></Arrow>
            <HStack spacing={12}>
              <Hustler hustler="monkey" w={100} h={270} />
              <Grid gridTemplateColumns="repeat(2, max-content)" columnGap={8} rowGap={4} alignItems="center">
                {PLACEHOLDER_STATS.map((singleStat) => {
                  const { name, equipment, stat, ...stats } = singleStat;
                  return (
                    <React.Fragment key={name}>
                      <VStack spacing="px" alignItems="flex-start">
                        <Text fontFamily="broken-console" fontSize="10px" color="neon.500" lineHeight={1}>
                          {equipment}
                        </Text>
                        <Text fontSize="14px" lineHeight={1}>
                          {name}
                        </Text>
                      </VStack>
                      <PowerMeter text={stat} {...stats} />
                    </React.Fragment>
                  );
                })}
              </Grid>
            </HStack>
            <Arrow direction="right" cursor="pointer" style="outline" boxSize={10}></Arrow>
          </HStack>
        </VStack>
      </Layout>
    </>
  );
}
