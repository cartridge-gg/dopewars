import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import { Alert } from "@/components/icons";
import { InputNumber } from "@/components/InputNumber";
import { VStack, HStack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { GameMode } from "@/dojo/types";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { useSystems } from "@/dojo/hooks/useSystems";
import { playSound, Sounds } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
import { Glock } from "@/components/icons/items";
import { Clock } from "@/components/icons";

export default function Name() {
  const router = useRouter();

  const { account } = useDojoContext();
  const { createGame, isPending } = useSystems();

  const { toast } = useToast();

  const [error, setError] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.Limited);

  const create = async () => {
    setError("");
    if (name === "" || name.length > 20 || name.length < 3) {
      setError("Invalid name, at least 3 chars, max 20!");
      return;
    }

    try {
      const { hash, gameId } = await createGame(gameMode, name);

      toast({
        message: "Game Created!",
        icon: Alert,
        link: `http://amazing_explorer/${hash}`,
      });

      //  router.push(`/${gameId}/travel`);
      router.push(`/${gameId}/pawnshop`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Layout
      leftPanelProps={{
        prefixTitle: "Start a",
        title: "New Game",
        imageSrc: "/images/will-smith-with-attitude.png",
      }}
    >
      <>
        <VStack
          h="80%"
          w={["full", "400px"]}
          alignItems="center"
          justifyContent="center"
        >
          <VStack w="full" mb="50px">
            <Text py="20px" textStyle="subheading" fontSize="13px">
              Mode
            </Text>
            <HStack gap="20px">
              <Button
                variant="selectable"
                isActive={gameMode === GameMode.Limited}
                onClick={() => setGameMode(GameMode.Limited)}
              >
                <Clock /> THUG
              </Button>
              <Button
                variant="selectable"
                isActive={gameMode === GameMode.Unlimited}
                onClick={() => setGameMode(GameMode.Unlimited)}
              >
                <Glock /> GANGSTER
              </Button>
            </HStack>
          </VStack>

          <VStack w="full">
            <Text py="20px" textStyle="subheading" fontSize="13px">
              Name Entry
            </Text>
            <Input
              px="10px"
              border="2px"
              borderColor="neon.500"
              bgColor="neon.700"
              maxLength={31}
              placeholder="Enter your name"
              autoFocus={true}
              value={name}
              onChange={(e) => {
                setError("");
                setName(e.target.value);
              }}
            />
            <VStack w="full" h="80px">
              <Text
                w="full"
                align="center"
                color="red"
                display={name.length === 31 ? "block" : "none"}
              >
                Max 31 characters
              </Text>
              <Text
                w="full"
                align="center"
                color="red"
                display={error !== "" ? "block" : "none"}
              >
                {error}
              </Text>
            </VStack>
          </VStack>
        </VStack>

        <Footer>
          <Button w={["full", "auto"]} onClick={() => router.push("/")}>
            Back
          </Button>
          <Button w={["full", "auto"]} isLoading={isPending} onClick={create}>
            Create New Game
          </Button>
        </Footer>
      </>
    </Layout>
  );
}
