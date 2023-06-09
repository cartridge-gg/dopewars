import {
  Button as ChakraButton,
  ButtonProps,
  StyleProps,
  Text,
  Box,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { IsMobile } from "@/utils/ui";

const clipCorner = (size) => `polygon(${size} 0%, calc(100% - ${size}) 0%, 100% ${size}, 100% calc(100% - ${size}), calc(100% - ${size}) 100%, ${size} 100%, 0% calc(100% - ${size}), 0% ${size})`
const clipBottomCorner = (size) => `polygon(0% 0%, calc(100%) 0%, 100% 0%, 100% calc(100% - ${size}), calc(100% - ${size}) 100%, ${size} 100%, 0% calc(100% - ${size}), 0% ${size})`

const HeaderButton = ({
  children,
  ...props
}: { children: ReactNode } & StyleProps & ButtonProps) => (
  <Box
    as="button"
    // layerStyle="rounded"
    {...props}
    _hover={{
      backgroundColor: "neon.600",
    }}
    p={IsMobile() ? "6px" : "6px 12px"}
    bgColor="neon.700"
    style={{
      clipPath:  IsMobile() ? clipBottomCorner("6px") : clipCorner("8px")
    }}
  >
    {children}
  </Box>
);

export default HeaderButton;
