import {
  Button as ChakraButton,
  ButtonProps,
  StyleProps,
  Text,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { playSound, Sounds } from "@/hooks/sound";

// Can't seem to set first-letter css correctly on button in chakra theme
// so we do it here on text...
const Button = ({
  children,
  hoverSound = undefined,
  clickSound = Sounds.HoverClick,
  ...props
}: { children: ReactNode } & { hoverSound?: Sounds | undefined } & {
  clickSound?: Sounds | undefined;
} & StyleProps &
  ButtonProps) => (
  <ChakraButton
    {...props}
    onMouseEnter={() => {
      hoverSound && playSound(hoverSound, 0.3);
    }}
    onClick={(e) => {
      clickSound && playSound(clickSound, 0.3);
      props.onClick && props.onClick(e);
    }}
  >
    <Text as="div" w="full" textAlign="center"
      css={{
        "&:first-letter": {
          textDecoration: "underline",
        },
      }}
    >
      {children}
    </Text>
  </ChakraButton>
);

export default Button;
