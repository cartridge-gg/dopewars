import { VStack, Heading, Text, Flex, Image, StyleProps, Container, Box, Button, Spacer } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import Header from "./Header";
import { motion } from "framer-motion";

import CrtEffect from "./CrtEffect";
import { Footer } from "./Footer";

export interface LayoutProps {
  CustomLeftPanel?: React.FC;
  leftPanelProps?: LeftPanelProps;
  showBack?: boolean;
  actions?: ReactNode;
  children: ReactNode;
  isSinglePanel?: boolean;
  footer?: ReactNode;
}

export interface LeftPanelProps {
  title: string;
  prefixTitle?: string;
  imageSrc?: string;
  map?: ReactNode;
}

const Layout = ({
  CustomLeftPanel,
  leftPanelProps,
  showBack,
  children,
  isSinglePanel = false,
  footer,
}: LayoutProps) => {
  return (
    <>
      <Flex
        direction="column"
        position="fixed"
        boxSize="full"
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Header back={showBack} />
        <Container position="relative" p={["8px", "16px"]}>
          {!isSinglePanel && (!CustomLeftPanel ? <LeftPanel {...leftPanelProps} /> : <CustomLeftPanel />)}
          <RightPanel flex={[!!leftPanelProps?.map ? "0" : "1", "1"]} footer={footer} isSinglePanel={isSinglePanel}>
            {children}
          </RightPanel>
        </Container>

        <Box maxH="30px" h="full" display={["none", "block"]} bg="neon.900" zIndex={1} />
      </Flex>
      <CrtEffect />
    </>
  );
};

const LeftPanel = ({ title, prefixTitle, map, imageSrc, ...props }: Partial<LeftPanelProps> & StyleProps) => {
  return (
    <VStack flex={["0", "1"]} my={["none", "auto"]} {...props}>
      <VStack zIndex="1" position={map ? "absolute" : "unset"} pointerEvents="none" spacing="0">
        <Text textStyle="subheading" fontSize={["9px", "11px"]}>
          {prefixTitle}
        </Text>
        <Heading fontSize={["36px", "48px"]} fontWeight="normal">
          {title}
        </Heading>
      </VStack>
      {map ? (
        <Flex w="100%">{map}</Flex>
      ) : (
        <Image src={imageSrc} maxH="60vh" h="500px" pt="60px" display={["none", "block"]} alt="context" />
      )}
    </VStack>
  );
};

const RightPanel = ({
  children,
  footer,
  isSinglePanel,
  ...props
}: { children: ReactNode; footer: ReactNode; isSinglePanel: boolean } & StyleProps) => {
  return (
    <VStack position="relative" w="full" {...props}>
      <VStack
        position="relative"
        flex="1"
        // overflowY={isSinglePanel ? "" : "scroll"}
        overflowY={"scroll"}
        w="full"
        maxH={isSinglePanel ? "calc(100vh - 70px)" : "calc(100vh - 140px)"}
      >
        {children}
        {!isSinglePanel && <Box display="block" minH="70px" h="70px" w="full" />}
      </VStack>
      {footer}
    </VStack>
  );
};

export default Layout;
