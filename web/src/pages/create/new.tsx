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
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { validateAndParseAddress } from "starknet";

export default function New() {
  const router = useRouter();

  const {
    account,
    burner: { create: createBurner, isDeploying: isBurnerDeploying },
  } = useDojoContext();

  const { createGame, isPending } = useSystems();

  const { toast } = useToast();

  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [avatarId, setAvatarId] = useState(0);
  const [mainnetAddress, setMainnetAddress] = useState("");
  const [mainnetAddressValue, setMainnetAddressValue] = useState(BigInt(0));

  
  const create = async (gameMode: GameMode) => {
    setError("");
    if (name === "" || name.length > 20 || name.length < 3) {
      setError("Invalid name, at least 3 chars, max 20!");
      return;
    }

    try{
      let value = validateAndParseAddress(mainnetAddress)
      setMainnetAddressValue(value)
      setError("")
    } catch(e){
      setError("Invalid address !")
      return;
    }

    try {
      if (!account) {
        // create burner account
        await createBurner();
      }

      const { hash, gameId } = await createGame(gameMode, name, avatarId, mainnetAddressValue);

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
          <Button w={["full", "auto"]} isLoading={isPending} onClick={() => create(GameMode.Test)}>
           Ninja Test 
          </Button>
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

          <Input
            display="flex"
            mx="auto"
            mt="0px"
            maxW="440px"
            fontSize="11px"
            placeholder="Your may enter your Starknet Mainnet Address..."
            value={mainnetAddress}
            onChange={(e) => {
              setMainnetAddress(e.target.value);
            }}
          />

        </VStack>
      </VStack>
    </Layout>
  );
}
