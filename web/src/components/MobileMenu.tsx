import HeaderButton from "@/components/HeaderButton";
import {
  Menu,
  MenuItem,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  StyleProps
} from "@chakra-ui/react";
import MediaPlayer from "./MediaPlayer";
import { ProfileLinkMobile } from "./ProfileButton";
import { Dots } from "./icons";

const MobileMenu = ({ ...props }: StyleProps) => {
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
              <MenuItem _hover={{ bg: "transarent" }}>
                <MediaPlayer />
              </MenuItem>
              <ProfileLinkMobile />
            </Menu>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default MobileMenu;
