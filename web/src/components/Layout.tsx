import {
  VStack,
  HStack,
  Heading,
  Text,
  StyleProps,
  Flex,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import Header from "./Header";
import Image from "next/image";
import { IsMobile } from "@/utils/ui";
import { motion } from "framer-motion";

export interface LayoutProps {
  backHeader?: boolean,
  title: string;
  map: ReactNode;
  prefixTitle: string;
  backgroundImage: string;
  children: ReactNode;
}

import CrtEffect from "./CrtEffect";

const Layout = ({
  backHeader,
  title,
  prefixTitle,
  map,
  backgroundImage,
  children,
  ...props
}: Partial<LayoutProps> & StyleProps) => {
  return (
    <>
      <Header back={backHeader} />
      <Flex
        position="fixed"
        top="0"
        left="0"
        boxSize="full"
        direction={["column", "row"]}
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <VStack
          // convert to next/image for better optimization
          backgroundImage={[
            "",
            `linear-gradient(to bottom, #172217 0%, transparent 40%, transparent 90%, #172217 100%), ${backgroundImage}`,
          ]}
          backgroundSize="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          minHeight="200px"
          flex={[map ? "1" : "0", "1"]}
          justify={[map ? "flex-start" : "space-around", "flex-start"]}
          position="relative"
        >
          <Title title={title} prefixTitle={prefixTitle} hasMap={!!map} />
          <Flex position="absolute" top="0" boxSize="full" justify="center">
            {map}
          </Flex>
        </VStack>
        <VStack
          flex={map && IsMobile() ? "0" : "1"}
          overflowY="scroll"
          {...props}
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {children}
        </VStack>
      </Flex>
      <CrtEffect />
    </>
  );
};

const Title = ({
  title,
  prefixTitle,
  hasMap,
}: {
  prefixTitle?: string;
  title?: string;
  hasMap?: boolean;
}) => (
  <VStack
    spacing="0"
    w="full"
    h={[hasMap ? "15%" : "50%", "30%"]}
    position="absolute"
    pointerEvents="none"
    justify="flex-end"
    zIndex="2"
    background={hasMap ? "linear-gradient(to top, transparent, #172217)" : ""}
  >
    <Text textStyle="subheading" fontSize="11px">
      {prefixTitle}
    </Text>
    <Heading fontSize={["40px", "48px"]}>{title}</Heading>
  </VStack>
);

export default Layout;
