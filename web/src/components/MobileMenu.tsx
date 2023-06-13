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
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { Dots, Chat } from "./icons";
import HeaderButton from "@/components/HeaderButton";
import MediaPlayer from "./MediaPlayer";

const MobileMenu = ({ ...props }: StyleProps /*& ButtonProps*/) => (
  <>
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <HeaderButton>
          <Dots />
        </HeaderButton>
      </PopoverTrigger>
      <PopoverContent bg="neon.900" borderRadius={0} borderColor="neon.600">
        <PopoverBody>
          <VStack alignItems="flex-start">
            <MediaPlayer />
            <Chat />
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  </>
);

export default MobileMenu;

{
  /* <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader>Confirmation!</PopoverHeader> */
}
