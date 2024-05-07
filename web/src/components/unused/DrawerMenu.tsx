import { useConfigStore, useDojoContext, useGameStore, useRouterContext } from "@/dojo/hooks";
import { IsMobile } from "@/utils/ui";
import {
  Button,
  Card,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Heading,
  ListIcon,
  ListItem,
  Text,
  UnorderedList,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { Clock, Close, Dots, Home, PaperIcon, Refresh } from "../icons";
import { HeaderButton, MediaPlayer } from "../layout";
import { ChainSelector, ConnectButton, TokenBalance } from "../wallet";
import { Burners } from "../wallet/Burners";
import { Predeployed } from "../wallet/Predeployed";
import { OnGoingGames } from "../pages/home/OnGoingGames";
import { ProfileLink, ProfileLinkDrawer } from "../pages/profile/Profile";
import { useAccount } from "@starknet-react/core";
import { HustlerStats } from "../pages/profile/HustlerStats";
import { BuiltBy } from "../pages/home";

const DrawerMenu = () => {
  const { router, gameId, isRyoDotGame } = useRouterContext();
  const { game } = useGameStore();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const { config } = useConfigStore();
  const { account } = useAccount();
  const { uiStore } = useDojoContext();
  return (
    <>
      <HeaderButton ref={btnRef} onClick={onOpen} w="48px">
        <Dots />
      </HeaderButton>
      <Drawer isOpen={isOpen} placement="right" size="xs" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay onClick={onClose} />
        <DrawerContent minW="340px">
          <DrawerHeader mt="4px" h="48px">
            Roll Your Own
          </DrawerHeader>
          <Close position="absolute" right="16px" top="16px" onClick={onClose} />
          <DrawerBody p={3}>
            <VStack
              w="full"
              h="full"
              justifyContent="space-between"
              // alignItems="flex-start"
              gap={6}
            >
              <VStack w="full" alignItems="flex-start" gap={12} mt={12}>
                <VStack w="full" alignItems="flex-start">
                  {/* {account && game && (
                    <VStack w="full" alignItems="flex-start">
                      <Text mb={3}> GAME </Text>
                      <ProfileLinkDrawer />

                      <Card>
                        <HustlerStats />
                      </Card>
                    </VStack>
                  )} */}

                  <VStack w="full" alignItems="flex-start">
                    <Text mb={3} textAlign="center">
                      ACCOUNT
                    </Text>
                    <ConnectButton />

                    <HStack w="full">
                      <ChainSelector canChange={!gameId} />
                      <Burners />
                      <Predeployed />
                    </HStack>

                    <HStack w="full" justifyContent="space-between" h="48px">
                      {account && config && (
                        <>
                          <Text>PAPER</Text>{" "}
                          <TokenBalance address={account?.address} token={config?.ryoAddress.paper} icon={PaperIcon} />
                        </>
                      )}
                    </HStack>
                  </VStack>
                </VStack>

                {/* <Divider borderColor="neon.700" /> */}

                {/* <VStack w="full" alignItems="flex-start"></VStack> */}

                <UnorderedList w="full" listStyleType="none">
                  <ListItem>
                    <Text mb={3}> LINKS </Text>
                  </ListItem>
                  {game && (
                    <>
                      <ListItem
                        borderBottom="solid 1px"
                        borderColor="neon.700"
                        pb={2}
                        pt={2}
                        cursor="pointer"
                        onClick={() => {
                          uiStore.openRefreshGame();
                        }}
                      >
                        <Refresh mr={2} /> REFRESH
                      </ListItem>
                      <ListItem
                        borderBottom="solid 1px"
                        borderColor="neon.700"
                        pb={2}
                        pt={2}
                        cursor="pointer"
                        onClick={() => {
                          uiStore.openQuitGame();
                        }}
                      >
                        <Home mr={2} /> QUIT GAME
                      </ListItem>
                    </>
                  )}
                  {!game && (
                    <ListItem
                      borderBottom="solid 1px"
                      borderColor="neon.700"
                      pb={2}
                      pt={2}
                      cursor="pointer"
                      onClick={() => {
                        router.push("/");
                      }}
                    >
                      <Home mr={2} /> HOME
                    </ListItem>
                  )}
                  <ListItem
                    // borderBottom="solid 1px"
                    // borderColor="neon.700"
                    pb={2}
                    pt={2}
                    cursor="pointer"
                    onClick={() => {
                      router.push("/game/history");
                    }}
                  >
                    <Clock mr={2} /> HISTORY
                  </ListItem>
                </UnorderedList>
              </VStack>
              <MediaPlayer />
            </VStack>
          </DrawerBody>

          <DrawerFooter>{/* <BuiltBy /> */}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DrawerMenu;
