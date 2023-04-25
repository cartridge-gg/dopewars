import {
  Center,
  Flex,
  Spacer,
  Text,
  useDisclosure,
  VStack,
  Container,
  HStack,
  Divider,
  StyleProps,
  SystemProps,
  Box,
  SimpleGrid,
  useToken,
  Heading,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  UnorderedList,
  ListItem,
  Button,
  OrderedList,
} from "@chakra-ui/react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { Link } from "@/components/icons";
import { Footer } from "@/components/Footer";

export default function Home() {
  const router = useRouter();
  return (
    <Layout
      title="The Lobby"
      prefixTitle="Welcome to"
      backgroundImage="url('./images/normies.png');"
      position="relative"
      px="30px"
    >
      <VStack
        w="full"
        alignItems="flex-start"
        gap="20px"
        position="relative"
        top="20%"
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
        <Button textTransform="none">
          <Link /> ryo.gg/invite/h12
        </Button>
        <OrderedList>
          <ListItem>Shinobi</ListItem>
          <ListItem>Click_Save</ListItem>
          <ListItem>0x4b1...3312</ListItem>
          <ListItem>0x523...ccde</ListItem>
          <ListItem>0xabe...49bd</ListItem>
        </OrderedList>
      </VStack>
      <Footer>
        <HStack w="full" gap="10px">
          <Text whiteSpace="nowrap">MATCH BEGINS IN</Text>
          <Divider borderColor="neon.600" borderStyle="dotted" />
          <Text>15m35s</Text>
        </HStack>
        <Spacer minH="100px" />
        <HStack justify="flex-end">
          <Button>Leave Lobby</Button>
          <Button isDisabled>Joined</Button>
        </HStack>
      </Footer>
    </Layout>
  );
}
