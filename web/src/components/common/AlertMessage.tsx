import { HStack, StyleProps, Text } from "@chakra-ui/react";
import { Warning } from "../icons";

export const AlertMessage = ({ message, ...props }: { message: string } & StyleProps) => (
  <HStack w="full" position="relative" alignItems="center" justifyContent="center" py={3} {...props}>
    <Warning size="md" />
    <Text>{message}</Text>
  </HStack>
);
