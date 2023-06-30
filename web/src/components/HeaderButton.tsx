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

import { generatePixelBorderPath } from "@/utils/ui";

const HeaderButton = forwardRef<ButtonProps, "button">(
  ({ children, ...props }: { children?: ReactNode } & StyleProps, ref) => (
    <Box
      ref={ref}
      as="button"
      {...props}
      _hover={{
        backgroundColor: "neon.600",
      }}
      p={IsMobile() ? "6px" : "6px 12px"}
      bgColor="neon.700"
      clipPath={`polygon(${generatePixelBorderPath()})`}
    >
      {children}
    </Box>
  ),
);

export default HeaderButton;
