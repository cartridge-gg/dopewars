import { Stack, StyleProps } from "@chakra-ui/react";
import { ReactNode } from "react";

export const Footer = ({
  children,
  ...props
}: { children: ReactNode } & StyleProps) => (
  <Stack
    gap="12px"
    w="full"
    position="absolute"
    bottom="0"
    right="0"
    p="24px"
    {...props}
  >
    {children}
  </Stack>
);
