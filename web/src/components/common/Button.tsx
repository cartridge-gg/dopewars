import { Sounds, playSound } from "@/hooks/sound";
import { ButtonProps, Button as ChakraButton, StyleProps, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

// Can't seem to set first-letter css correctly on button in chakra theme
// so we do it here on text...
export const Button = ({
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
    <Text
      as="div"
      w="full"
      textAlign="center"
      // css={{
      //   "&:first-letter": {
      //     textDecoration: "underline",
      //   },
      // }}
    >
      {children}
    </Text>
  </ChakraButton>
);
