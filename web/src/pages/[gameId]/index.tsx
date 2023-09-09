import {
  Spacer,
  Text,
  HStack,
  Divider,
  UnorderedList,
  ListItem,
  OrderedList,
} from "@chakra-ui/react";
import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { Link } from "@/components/icons";

export default function Join() {
  const router = useRouter();
  return (
    <Layout
      leftPanelProps={{
        title: "The Lobby",
        prefixTitle: "Welcome to",
        imageSrc: "/images/will-smith-with-attitude.png",
      }}
    >
      <UnorderedList w="100%" variant="underline">
        <ListItem>
          <HStack>
            <Text>GAME NAME</Text>
            <Spacer />
            <Text>GANGSTARS</Text>
          </HStack>
        </ListItem>
        <ListItem>
          <HStack>
            <Text>NO. OF TURNS</Text>
            <Spacer />
            <Text>30</Text>
          </HStack>
        </ListItem>
        <ListItem>
          <HStack>
            <Text>LOBBY</Text>
            <Spacer />
            <Text>5 Players</Text>
          </HStack>
        </ListItem>
      </UnorderedList>
      <Button
        textTransform="none"
        w="full"
        onClick={() => router.push("/0x12131/brooklyn")}
      >
        <>
          <Link /> ryo.gg/invite/h12
        </>
      </Button>
      <OrderedList>
        <ListItem>Shinobi</ListItem>
        <ListItem>Click_Save</ListItem>
        <ListItem>0x4b1...3312</ListItem>
        <ListItem>0x523...ccde</ListItem>
        <ListItem>0xabe...49bd</ListItem>
      </OrderedList>

      <HStack w="full" gap="10px">
        <Text whiteSpace="nowrap">MATCH BEGINS IN</Text>
        <Divider borderColor="neon.500" borderStyle="dotted" />
        <Text>15m35s</Text>
      </HStack>
      {/* <Footer>
        <Button w={["full", "auto"]} onClick={() => router.push("/")}>
          Leave Lobby
        </Button>
        <Button
          w={["full", "auto"]}
          onClick={() => {
            router.push("/0x12341/travel");
          }}
        >
          Start
        </Button>
      </Footer> */}
    </Layout>
  );
}
