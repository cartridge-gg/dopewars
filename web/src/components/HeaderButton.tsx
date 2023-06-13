import {
  Button as ChakraButton,
  ButtonProps,
  StyleProps,
  Text,
  Box,
  forwardRef,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { IsMobile } from "@/utils/ui";

const clipCorner = (size: string) =>
  `polygon(${size} 0%, calc(100% - ${size}) 0%, 100% ${size}, 100% calc(100% - ${size}), calc(100% - ${size}) 100%, ${size} 100%, 0% calc(100% - ${size}), 0% ${size})`;
const clipBottomCorner = (size: string) =>
  `polygon(0% 0%, calc(100%) 0%, 100% 0%, 100% calc(100% - ${size}), calc(100% - ${size}) 100%, ${size} 100%, 0% calc(100% - ${size}), 0% ${size})`;

const HeaderButton = forwardRef<ButtonProps, "button">(
  (
    {
      children,
      ...props
    }: { children?: ReactNode } & StyleProps ,
    ref,
  ) => (
    <Box
      ref={ref}
      as="button"
      {...props}
      _hover={{
        backgroundColor: "neon.600",
      }}
      p={IsMobile() ? "6px" : "6px 12px"}
      bgColor="neon.700"
      clipPath={IsMobile() ? clipBottomCorner("6px") : clipCorner("8px")}
    >
      {children}
    </Box>
  ),
);

export default HeaderButton;
