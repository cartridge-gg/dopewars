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
import { Footer } from "@/components/Footer";
import Content from "@/components/Content";
import { breakpoint } from "@/utils/ui";

export default function Join() {
  const router = useRouter();
  return (
    <Layout
      title="The Lobby"
      prefixTitle="Welcome to"
      backgroundImage="url('https://static.cartridge.gg/games/dope-wars/ryo/normies.png');"
    >
      <Content gap="20px" alignItems="flex-start">
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
          <Divider borderColor="neon.600" borderStyle="dotted" />
          <Text>15m35s</Text>
        </HStack>
      </Content>
      <Footer>
        <Button w={breakpoint("full", "auto")} onClick={() => router.push("/")}>
          Leave Lobby
        </Button>
        <Button w={breakpoint("full", "auto")} isDisabled>
          Joined
        </Button>
      </Footer>
    </Layout>
  );
}
