import { HStack, VStack, StyleProps } from "@chakra-ui/react";
import { ReactNode } from "react";

export const Footer = ({
  children,
  transparent = false,
  ...props
}: { transparent?: boolean; children: ReactNode } & StyleProps) => (
  <VStack
    w={["100%", "50%"]}
    position="absolute"
    bottom="0"
    right="0"
    spacing="0"
    pointerEvents="none"
    {...props}
  >
    {!transparent && (
      <HStack
        w="full"
        h="80px"
        background="linear-gradient(transparent, #172217)"
      />
    )}
    <HStack
      w="full"
      p="24px"
      gap="12px"
      justify="flex-end"
      bgColor={transparent ? "transparent" : "neon.900"}
      pointerEvents="all"
    >
      {children}
    </HStack>
  </VStack>
);
