import type { ComponentStyleConfig } from "@chakra-ui/theme";
import { StyleFunctionProps } from "@chakra-ui/theme-tools";

export const Input: ComponentStyleConfig = {
  variants: {
    primary: (props: StyleFunctionProps) => ({
      field: {
        px: "0",
        color: "neon.200",
        borderColor: "none",
        bgColor: "transparent",
        fontSize: "16px",
        _placeholder: {
          color: "neon.500",
        },
      },
    }),
    caret: (props: StyleFunctionProps) => ({
      field: {},
    }),
  },
  defaultProps: {
    variant: "primary",
  },
};
