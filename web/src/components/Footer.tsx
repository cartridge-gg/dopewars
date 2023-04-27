import { HStack, StyleProps } from "@chakra-ui/react";
import { ReactNode } from "react";

export const Footer = ({
  children,
  ...props
}: { children: ReactNode } & StyleProps) => (
  <HStack
    p="24px"
    w="full"
    minH="100px"
    gap="12px"
    position="absolute"
    bottom="0"
    right="0"
    justify="flex-end"
    {...props}
  >
    {children}
  </HStack>
);
