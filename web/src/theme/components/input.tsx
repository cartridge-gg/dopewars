import type { ComponentStyleConfig } from "@chakra-ui/theme";
import { StyleFunctionProps } from "@chakra-ui/theme-tools";

export const Input: ComponentStyleConfig = {
  variants: {
    primary: (props: StyleFunctionProps) => ({
      field: {
        height: "42px",
        border: "2px solid",
        borderColor: "gray.900",
        bgColor: "gray.700",
        borderRadius: "4px",
        color: "white",
        fontSize: "14px",
        _placeholder: {
          color: "gray.400",
        },
      },
    }),
    secondary: (props: StyleFunctionProps) => ({
      field: {},
    }),
  },
  defaultProps: {
    variant: "primary",
  },
};
