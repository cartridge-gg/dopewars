import Content from "@/components/Content";
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
import {
  Account,
  RpcProvider,
  stark,
  ec,
  hash,
  shortString,
  CallData,
} from "starknet";

const MIN_PLAYERS = 6;
const MIN_TURNS = 10;

const provider = new RpcProvider({ nodeUrl: "http://localhost:5050" });
const address =
  "0x3ee9e18edc71a6df30ac3aca2e0b02a198fbce19b7480a63a0d71cbd76652e0";
const privateKey =
  "0x300001800000000300000180000000000030000000000003006001800006600";
const account = new Account(provider, address, privateKey);

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

  const createAccount = async () => {
    const executeHash = await account.execute({
      contractAddress:
        "0x6fa009d398e35913fda1aca5205da5aff6c2256aa81ff7670bebb499a475032",
      entrypoint: "execute",
      calldata: CallData.compile({
        name: shortString.encodeShortString("Create"),
        calldata: 0,
      }),
    });

    console.log(executeHash);
  };

  return (
    <Layout
      title="New Game"
      prefixTitle="Start a"
      headerImage="/images/punk-girl.png"
    >
      <Content>
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
              <InputNumber
                value={numTurns}
                min={MIN_TURNS}
                onChange={handleNumTurns}
              />
            </HStack>
          </ListItem>
          <ListItem>
            <HStack>
              <Label name="Players" />
              <InputNumber
                value={numPlayers}
                min={MIN_PLAYERS}
                onChange={handleNumPlayer}
              />
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
      </Content>
      <Footer>
        <Button w={["full", "auto"]} onClick={() => router.push("/")}>
          Cancel
        </Button>
        <Button
          w={["full", "auto"]}
          onClick={() => createAccount()}
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
