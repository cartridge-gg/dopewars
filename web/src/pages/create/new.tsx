import Button from "@/components/Button";
import { Footer } from "@/components/Footer";
import Input from "@/components/Input";
import Layout from "@/components/Layout";
import { Avatar } from "@/components/avatar/Avatar";
import { genAvatarFromId, getAvatarCount } from "@/components/avatar/avatars";
import { Arrow } from "@/components/icons";
import { useDojoContext, useRouterContext, useSystems } from "@/dojo/hooks";
import { GameMode } from "@/dojo/types";
import { Sounds, playSound } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
import { Card, HStack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

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
  const [avatarId, setAvatarId] = useState(0);

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

      const { hash, gameId } = await createGame(gameMode, name, avatarId);

      // toast({
      //   message: "Game Created!",
      //   icon: Alert,
      //   link: `http://amazing_explorer/${hash}`,
      // });

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

          {/* <Button w={["full", "auto"]} isLoading={isPending} onClick={() => create(GameMode.Test)}>
            Ninja Test
          </Button> */}
        </Footer>
      }
    >
      <VStack w={["full", "440px"]} margin="auto">
        <VStack w="full">
          <HStack my="30px" align="center" justify="center">
            <Arrow
              style="outline"
              direction="left"
              boxSize="48px"
              userSelect="none"
              cursor="pointer"
              onClick={() => {
                playSound(Sounds.HoverClick, 0.3);
                avatarId > 1 ? setAvatarId(avatarId - 1) : setAvatarId(getAvatarCount());
              }}
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
              onClick={() => {
                playSound(Sounds.HoverClick, 0.3);
                setAvatarId((avatarId + 1) % getAvatarCount());
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
