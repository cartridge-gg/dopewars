import {
  VStack,
  HStack,
  Heading,
  Text,
  StyleProps,
  Flex,
  Box,
  Image,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import Header from "./Header";
import { motion } from "framer-motion";

export interface LayoutProps {
  backHeader?: boolean;
  title: string;
  map: ReactNode;
  imageSrc: string;
  prefixTitle: string;
  children: ReactNode;
  footer: ReactNode;
}

import CrtEffect from "./CrtEffect";

const Layout = ({
  backHeader,
  title,
  prefixTitle,
  map,
  imageSrc,
  children,
  footer,
}: Partial<LayoutProps>) => {
  return (
    <>
      <Header />
      <Flex
        position="fixed"
        top="0"
        left="0"
        boxSize="full"
        align="center"
        justify="center"
        direction={["column", "row"]}
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Flex
          w={["full", "1400px"]}
          h="full"
          pt={["80px", "10%"]}
          px="24px"
          gap={["0", "200px"]}
          direction={["column", "row"]}
        >
          <LeftPanel
            title={title}
            prefixTitle={prefixTitle}
            imageSrc={imageSrc}
            map={map}
          />
          <RightPanel>{children}</RightPanel>
        </Flex>
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
}: {
  title?: string;
  prefixTitle?: string;
  map?: ReactNode;
  imageSrc?: string;
}) => {
  return (
    <VStack flex={["0", "1"]}>
      <VStack justify={["flex-end"]} zIndex="overlay">
        <Text textStyle="subheading" fontSize="11px">
          {prefixTitle}
        </Text>
        <Heading fontSize={["40px", "48px"]} fontWeight="normal">
          {title}
        </Heading>
      </VStack>
      {map ? (
        <Flex w="120%">{map}</Flex>
      ) : (
        <Image
          src={imageSrc}
          maxH="600px"
          pt="60px"
          display={["none", "block"]}
        />
      )}
    </VStack>
  );
};

const RightPanel = ({ children }: { children: ReactNode }) => {
  return (
    <VStack
      flex="1"
      sx={{
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {children}
    </VStack>
  );
};

export default Layout;
