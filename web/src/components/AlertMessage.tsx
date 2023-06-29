import { StyleProps, Text, HStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Warning } from "./icons";

const AlertMessage = ({
  message,
  ...props
}: { message: string } & StyleProps) => (
  <HStack
    w="full"
    position="relative"
    alignItems="center"
    justifyContent="center"
    py={3}
    {...props}
  >
    <Warning size="md" />
    <Text>{message}</Text>
  </HStack>
);

export default AlertMessage;
