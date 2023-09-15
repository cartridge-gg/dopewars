import {
  VStack,
  Heading,
  Text,
  Flex,
  Image,
  StyleProps,
  Container,
  Box,
} from "@chakra-ui/react";
import React, { ReactNode } from "react";
import Header from "./Header";
import { motion } from "framer-motion";

import CrtEffect from "./CrtEffect";

export interface LayoutProps {
  CustomLeftPanel?: React.FC;
  leftPanelProps?: LeftPanelProps;
  showBack?: boolean;
  actions?: ReactNode;
  showMap?: boolean;
  children: ReactNode;
  isSinglePanel?: boolean;
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
  showMap,
  children,
  isSinglePanel = false,
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
        <Container position="relative">
          {!isSinglePanel &&
            (!CustomLeftPanel ? (
              <LeftPanel {...leftPanelProps} />
            ) : (
              <CustomLeftPanel />
            ))}
          <RightPanel flex={[showMap ? "0" : "1", "1"]}>{children}</RightPanel>
        </Container>
        <Box maxH="60px" h="full" display={["none", "block"]} />
      </Flex>
      <CrtEffect />
    </>
  );
};

const LeftPanel = ({
  title,
  prefixTitle,
  map,
  imageSrc,
  ...props
}: Partial<LeftPanelProps> & StyleProps) => {
  return (
    <VStack my="auto" flex={["0", "1"]} {...props}>
      <VStack
        zIndex="1"
        position={map ? "absolute" : "unset"}
        pointerEvents="none"
        spacing="0"
      >
        <Text textStyle="subheading" fontSize="11px">
          {prefixTitle}
        </Text>
        <Heading fontSize={["40px", "48px"]} fontWeight="normal">
          {title}
        </Heading>
      </VStack>
      {map ? (
        <Flex w="100%">{map}</Flex>
      ) : (
        <Image
          src={imageSrc}
          maxH="500px"
          pt="60px"
          display={["none", "block"]}
          alt="context"
        />
      )}
    </VStack>
  );
};

const RightPanel = ({
  children,
  ...props
}: { children: ReactNode } & StyleProps) => {
  return (
    <VStack
      flex="1"
      position="relative"
      sx={{
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
      {...props}
    >
      {children}
    </VStack>
  );
};

export default Layout;
