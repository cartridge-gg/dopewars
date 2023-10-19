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
      minH="80px"
      p="2px"
      position={["relative", "absolute"]}
      bottom="0"
      justify="center"
      align="flex-end"
      flexGrow={1}
      background="linear-gradient(transparent, #172217, #172217)"
      {...props}
    >
      {children}
    </HStack>
  );
};
