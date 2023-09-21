import {
  Button as ChakraButton,
  ButtonProps,
  StyleProps,
  Text,
  Box,
  forwardRef,
} from "@chakra-ui/react";
import { ReactNode } from "react";

import { generatePixelBorderPath } from "@/utils/ui";
import { headerStyles, headerButtonStyles } from "@/theme/styles";

const HeaderButton = forwardRef<ButtonProps, "button">(
  ({ children, ...props }: { children?: ReactNode } & StyleProps, ref) => (
    <Box
      ref={ref}
      as="button"
      p={[ "6px" , "6px 12px"]}
      h="48px"
      sx={headerButtonStyles}
      {...props}

    >
      {children}
    </Box>
  ),
);

export default HeaderButton;
