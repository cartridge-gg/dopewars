import { useDojoContext, useRouterContext } from "@/dojo/hooks";
import { Sounds, playSound } from "@/hooks/sound";
import { Menu, MenuItem, Popover, PopoverBody, PopoverContent, PopoverTrigger, StyleProps } from "@chakra-ui/react";
import { Cigarette, Dots, Home } from "../icons";
import { ProfileLinkMobile } from "../pages/profile/Profile";
import { ChainSelector, ConnectButtonMobile } from "../wallet";
import { Burners } from "../wallet/Burners";
import { Predeployed } from "../wallet/Predeployed";
import { HeaderButton } from "./HeaderButton";
import { MediaPlayer } from "./MediaPlayer";

export const MobileMenu = ({ ...props }: StyleProps) => {
  const { gameId } = useRouterContext();
  const { uiStore } = useDojoContext();
  return (
    <>
      <Popover placement="bottom-end">
        <PopoverTrigger>
          <HeaderButton w="48px">
            <Dots />
          </HeaderButton>
        </PopoverTrigger>
        <PopoverContent bg="neon.700" borderRadius={0} borderColor="neon.600">
          <PopoverBody p={0}>
            <Menu>
              <MenuItem _hover={{ bg: "transparent" }}>
                <MediaPlayer />
              </MenuItem>
              <ProfileLinkMobile />
              <ConnectButtonMobile />

              <MenuItem>
                <ChainSelector canChange={!gameId} />{"   "}
                <Burners />{" "}
                <Predeployed />
              </MenuItem>

              {gameId && (
                <>
                  <MenuItem
                    h="48px"
                    onClick={() => {
                      playSound(Sounds.Ooo);
                      //uiStore.openQuitGame();
                    }}
                  >
                    <Cigarette mr={2} /> IM LOST
                  </MenuItem>

                  <MenuItem
                    h="48px"
                    onClick={() => {
                      uiStore.openQuitGame();
                    }}
                  >
                    <Home mr={2} /> QUIT GAME
                  </MenuItem>
                </>
              )}
            </Menu>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
