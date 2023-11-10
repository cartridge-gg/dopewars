import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import { Dropdown } from "@/components/Dropdown";
import { InputNumber } from "@/components/InputNumber";
import { HStack, Text, UnorderedList, ListItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { playSound, Sounds } from "@/hooks/sound";

const MIN_PLAYERS = 6;
const MIN_TURNS = 10;

export default function Create() {
  const router = useRouter();

  const [numTurns, setNumTurns] = useState<number>(30);
  const handleNumTurns = (numTurns: number) => {
    setNumTurns(numTurns);
  };

  const [numPlayers, setNumPlayers] = useState<number>(MIN_PLAYERS);
  const handleNumPlayer = (numPlayers: number) => {
    setNumPlayers(numPlayers);
  };

  return (
    <Layout
      leftPanelProps={{
        title: "New Game",
        prefixTitle: "Start a",
        imageSrc: "/images/punk-girl.png",
      }}
    >
      <UnorderedList variant="underline" w="full" userSelect="none">
        <ListItem>
          <HStack>
            <Label name="Title" />
            <Input placeholder="ENTER GAME TITLE HERE" />
          </HStack>
        </ListItem>
        <ListItem>
          <HStack>
            <Label name="Turns" />
            <InputNumber value={numTurns} min={MIN_TURNS} onChange={handleNumTurns} />
          </HStack>
        </ListItem>
        <ListItem>
          <HStack>
            <Label name="Players" />
            <InputNumber value={numPlayers} min={MIN_PLAYERS} onChange={handleNumPlayer} />
          </HStack>
        </ListItem>
        <ListItem>
          <HStack>
            <Label name="Starts" />
            <Dropdown
              w="full"
              value={{ value: 1, text: "20:00 UTC", label: "(29 min)" }}
              options={[
                { value: 1, text: "20:00 UTC", label: "(29 min)" },
                { value: 2, text: "20:30 UTC", label: "(59 min)" },
                { value: 3, text: "21:00 UTC", label: "(1 hr 29 min)" },
                { value: 4, text: "21:30 UTC", label: "(1 hr 59 min)" },
              ]}
            />
          </HStack>
        </ListItem>
      </UnorderedList>
      <Footer>
        <Button w={["full", "auto"]} px={["auto", "20px"]} onClick={() => router.push("/")}>
          Cancel
        </Button>
        <Button
          w={["full", "auto"]}
          px={["auto", "20px"]}
          onClick={() => router.push("/pending/0x123")}
          clickSound={Sounds.Magnum357}
        >
          Create New Game
        </Button>
      </Footer>
    </Layout>
  );
}

const Label = ({ name }: { name: string }) => (
  <Text textTransform="uppercase" minWidth="100px">
    {name}:
  </Text>
);
