import { HStack, ButtonProps, StyleProps } from "@chakra-ui/react";
import Button from "@/components/Button";
import { ReactNode } from "react";

export const Footer = ({
  children,
  ...props
}: {
  children: ReactNode;
} & StyleProps) => {
  return (
    <HStack
      w="full"
      h="80px"
      p="2px"
      position="absolute"
      bottom="0"
      justify="center"
      align="flex-end"
      background="linear-gradient(transparent, #172217, #172217)"
      {...props}
    >
      {children}
    </HStack>
  );
};
