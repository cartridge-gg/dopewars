import {
  Button as ChakraButton,
  ButtonProps,
  StyleProps,
  Text,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Button,
  VStack,
  Menu,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { Dots, Chat, Trophy, User } from "./icons";
import HeaderButton from "@/components/HeaderButton";
import MediaPlayer from "./MediaPlayer";
import { useRouter } from "next/router";

const MobileMenu = ({ ...props }: StyleProps /*& ButtonProps*/) => {
  const router = useRouter();
  return (
    <>
      <Popover placement="bottom-end">
        <PopoverTrigger>
          <HeaderButton>
            <Dots />
          </HeaderButton>
        </PopoverTrigger>
        <PopoverContent bg="neon.900" borderRadius={0} borderColor="neon.600">
          <PopoverBody p={0}>
            <Menu>
              <MenuItem _hover={{ bg: "transarent" }}>
                <MediaPlayer />
              </MenuItem>
              <MenuItem icon={<Chat />}>CHAT</MenuItem>
              <MenuItem
                icon={<Trophy />}
                onClick={() => router.push("/leaderboard")}
              >
                LEADERBOARD
              </MenuItem>
              <MenuItem icon={<User />}>SHINOBI</MenuItem>
            </Menu>
            {/* <VStack alignItems="flex-start">
           
          </VStack> */}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default MobileMenu;

{
  /* <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader>Confirmation!</PopoverHeader> */
}
