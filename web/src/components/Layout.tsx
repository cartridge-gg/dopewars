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
  title: string;
  map: ReactNode;
  prefixTitle: string;
  backgroundImage: string;
  children: ReactNode;
}

import CrtEffect from "./CrtEffect";

const Layout = ({
  title,
  map,
  prefixTitle,
  backgroundImage,
  children,
  ...props
}: Partial<LayoutProps> & StyleProps) => {
  return (
    <>
      <Header />
      <Flex
        position="fixed"
        top="0"
        left="0"
        boxSize="full"
        gap={["40px", 0]}
        direction={["column", "row"]}
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <VStack
          // convert to next/image for better optimization
          backgroundImage={`linear-gradient(to bottom, #172217 0%, transparent 40%, transparent 90%, #172217 100%), ${backgroundImage}`}
          backgroundSize="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          minHeight="180px"
          flex={[map ? "1" : "0", "1"]}
          justify={[map ? "flex-start" : "flex-end", "flex-start"]}
          position="relative"
        >
          <Flex position="absolute" boxSize="full" justify="center">
            {map}
          </Flex>
          <VStack
            gap="10px"
            top={["10%", "20%"]}
            position="relative"
            pointerEvents="none"
            zIndex="1"
          >
            <Text textStyle="subheading" fontSize="11px">
              {prefixTitle}
            </Text>
            <Heading fontSize="24px">{title}</Heading>
          </VStack>
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

export default Layout;
