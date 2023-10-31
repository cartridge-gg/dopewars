import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import { Alert, Arrow, ArrowInput } from "@/components/icons";
import { InputNumber } from "@/components/InputNumber";
import { VStack, HStack, Text, Card } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { GameMode } from "@/dojo/types";
import { useSystems } from "@/dojo/hooks/useSystems";
import { playSound, Sounds } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
import { Glock } from "@/components/icons/items";
import { Clock } from "@/components/icons";
import { Avatar } from "@/components/avatar/Avatar";
import { genAvatarFromId, getAvatarCount } from "@/components/avatar/avatars";

export default function New() {
  const router = useRouter();

  const { createGame, isPending } = useSystems();

  const { toast } = useToast();

  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [avatarId, setAvatarId] = useState(0);

  const create = async (gameMode: GameMode) => {
    setError("");
    if (name === "" || name.length > 20 || name.length < 3) {
      setError("Invalid name, at least 3 chars, max 20!");
      return;
    }

    try {
      const { hash, gameId } = await createGame(gameMode, name, avatarId);

      toast({
        message: "Game Created!",
        icon: Alert,
        link: `http://amazing_explorer/${hash}`,
      });

      router.push(`/${gameId}/travel`);
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
        <VStack h="80%" w={["full", "400px"]} alignItems="center" justifyContent="center">
          <VStack w="full">
            <Text textStyle="subheading" fontSize="13px">
              Name Entry
            </Text>
            <HStack color="neon.500">
              <Text> What&apos;s your name playa ?</Text>
            </HStack>

            <HStack my="30px" align="center" justify="center">
              <Arrow
                style="outline"
                direction="left"
                boxSize="48px"
                userSelect="none"
                cursor="pointer"
                onClick={() => (avatarId > 1 ? setAvatarId(avatarId - 1) : setAvatarId(getAvatarCount()))}
              />

              <Card mx="20px">
                <Avatar name={genAvatarFromId(avatarId)} w="96px" h="96px" />
              </Card>

              <Arrow
                style="outline"
                direction="right"
                boxSize="48px"
                userSelect="none"
                cursor="pointer"
                onClick={() => setAvatarId((avatarId + 1) % getAvatarCount())}
              />
            </HStack>
            <Input
              display="flex"
              px="10px"
              mx="auto"
              border="2px"
              maxW="260px"
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
              <Text w="full" align="center" color="red" display={name.length === 20 ? "block" : "none"}>
                Max 20 characters
              </Text>
              <Text w="full" align="center" color="red" display={error !== "" ? "block" : "none"}>
                {error}
              </Text>
            </VStack>
          </VStack>
        </VStack>

        <Footer>
          <Button w={["full", "auto"]} onClick={() => router.push("/")}>
            Back
          </Button>
          <Button w={["full", "auto"]} isLoading={isPending} onClick={() => create(GameMode.Unlimited)}>
            Create New Game
          </Button>
          <Button w={["full", "auto"]} isLoading={isPending} onClick={() => create(GameMode.Test)}>
            Create New Test Game
          </Button>
        </Footer>
      </>
    </Layout>
  );
}
