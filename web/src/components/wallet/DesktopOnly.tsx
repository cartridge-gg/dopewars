import { ReactNode } from "react";
import { Box, Flex, StyleProps, Text, VStack } from "@chakra-ui/react";
import { IsMobile } from "@/utils/ui";
import { Siren } from "../icons";

export const DesktopOnly = ({ children, ...props }: { children: ReactNode } & StyleProps) => {
  const isMobile = IsMobile();
  if (!isMobile) return <>{children}</>;
  return (
    <Flex w="full" h="full" alignItems="center" justifyContent="center">
      <VStack w="full">
        <Siren />
        <Text>Desktop Only!</Text>
      </VStack>
    </Flex>
  );
};
