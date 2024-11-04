import { Box, ButtonProps, StyleProps, forwardRef } from "@chakra-ui/react";
import { ReactNode } from "react";

import { headerButtonStyles } from "@/theme/styles";

export const HeaderButton = forwardRef<ButtonProps, "button">(
  ({ children, ...props }: { children?: ReactNode } & StyleProps, ref) => (
    <Box ref={ref} as="button" p={["6px", "6px 12px"]} h="48px" sx={headerButtonStyles} {...props}>
      {children}
    </Box>
  ),
);
