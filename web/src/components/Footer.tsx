import { HStack, ButtonProps, StyleProps, Box } from "@chakra-ui/react";
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
      minH="100px"
      p="2px"
      position={["fixed", "absolute"]}
      bottom="0"
      justify="center"
      align="flex-end"
      flexGrow={1}
      background="linear-gradient(transparent, #172217,  #172217, #172217, #172217)"
      pointerEvents="none"
      {...props}
    >
      <HStack w="full" mb={["20px","0px"]} px={["10px","0px"]} justify="center" align="flex-end" pointerEvents="all">
        {children}
      </HStack>
    </HStack>
  );
};
