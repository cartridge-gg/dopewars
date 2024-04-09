import { Menu, MenuItem, Popover, PopoverBody, PopoverContent, PopoverTrigger, StyleProps } from "@chakra-ui/react";
import { Dots } from "../icons";
import { ProfileLinkMobile } from "../pages/profile/Profile";
import { ChainSelector, ConnectButtonMobile } from "../wallet";
import { Burners } from "../wallet/Burners";
import { Predeployed } from "../wallet/Predeployed";
import { HeaderButton } from "./HeaderButton";
import { MediaPlayer } from "./MediaPlayer";

export const MobileMenu = ({ ...props }: StyleProps) => {
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
                <ChainSelector/>
                <Burners />
                <Predeployed />
              </MenuItem>
            </Menu>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
