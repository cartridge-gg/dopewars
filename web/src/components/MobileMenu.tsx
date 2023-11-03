import {
  StyleProps,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Menu,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { Dots, User, Roll } from "./icons";
import HeaderButton from "@/components/HeaderButton";
import MediaPlayer from "./MediaPlayer";
import { useRouter } from "next/router";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { formatAddress } from "@/utils/contract";
import { ProfileButtonMobile } from "./ProfileButton";

const MobileMenu = ({ ...props }: StyleProps) => {
  const router = useRouter();
  const { account } = useDojoContext();
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
              <ProfileButtonMobile />
            </Menu>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default MobileMenu;
