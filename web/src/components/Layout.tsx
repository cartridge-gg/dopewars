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
import { ReactNode } from "react";
import Header from "./Header";
import { motion } from "framer-motion";

export interface LayoutProps {
  title: string;
  map: ReactNode;
  imageSrc: string;
  prefixTitle: string;
  showBack?: boolean;
  actions?: ReactNode;
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
      <Flex
        direction="column"
        position="fixed"
        boxSize="full"
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Header back={showBack} />
        <Container>
          <LeftPanel
            flex={[map ? "1" : "0", "1"]}
            title={title}
            prefixTitle={prefixTitle}
            imageSrc={imageSrc}
            map={map}
          />
          <RightPanel flex={[map ? "0" : "1", "1"]}>{children}</RightPanel>
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
}: {
  title?: string;
  prefixTitle?: string;
  map?: ReactNode;
  imageSrc?: string;
} & StyleProps) => {
  return (
    <VStack my="auto" flex={["0", "1"]} {...props}>
      <VStack
        zIndex="overlay"
        position={map ? "absolute" : "unset"}
        pointerEvents="none"
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
