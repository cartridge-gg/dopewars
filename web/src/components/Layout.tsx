import {
  VStack,
  HStack,
  Heading,
  Text,
  Flex,
  Box,
  Image,
  Container,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import Header from "./Header";
import { motion } from "framer-motion";

export interface LayoutProps {
  title: string;
  map: ReactNode;
  imageSrc: string;
  prefixTitle: string;
  showBack?: boolean;
  children: ReactNode;
}

import CrtEffect from "./CrtEffect";

const Layout = ({
  title,
  prefixTitle,
  map,
  imageSrc,
  showBack,
  children,
}: Partial<LayoutProps>) => {
  return (
    <>
      <Header back={showBack} />
      <Flex
        position="fixed"
        top="0"
        left="0"
        boxSize="full"
        align="center"
        justify="center"
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Container>
          <LeftPanel
            title={title}
            prefixTitle={prefixTitle}
            imageSrc={imageSrc}
            map={map}
          />
          <RightPanel>{children}</RightPanel>
        </Container>
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
      <VStack zIndex="overlay">
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
          maxH="500px"
          pt="60px"
          display={["none", "block"]}
          alt="context"
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
