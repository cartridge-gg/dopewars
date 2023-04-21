import {
  Button as ChakraButton,
  ButtonProps,
  StyleProps,
  Text,
} from "@chakra-ui/react";

// Can't seem to set first-letter css correctly on button in chakra theme
// so we do it here on text...
const Button = ({
  children,
  ...props
}: { children: string } & StyleProps & ButtonProps) => (
  <ChakraButton {...props}>
    <Text
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
