import {
  SimpleGrid,
  VStack,
  Heading,
  Text,
  StyleProps,
  Flex,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import Header from "./Header";
import Image from "next/image";
import { breakpoint } from "@/utils/ui";

export interface LayoutProps {
  title: string;
  prefixTitle: string;
  backgroundImage: string;
  children: ReactNode;
}

const Layout = ({
  title,
  prefixTitle,
  backgroundImage,
  children,
  ...props
}: Partial<LayoutProps> & StyleProps) => {
  return (
    <>
      <Header />
      <Flex h="100vh" direction={["column", "column", "column", "row"]}>
        <VStack
          backgroundImage={`linear-gradient(to bottom, #172217 0%, transparent 40%, transparent 90%, #172217 100%), ${backgroundImage}`}
          backgroundSize="cover"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          minHeight="180px"
          flex={breakpoint("0", "1")}
          justify={breakpoint("flex-end", "flex-start")}
        >
          <VStack
            gap="10px"
            top={breakpoint("0", "20%")}
            position={["static", "static", "static", "relative"]}
          >
            <Text textStyle="subheading" fontSize="11px">
              {prefixTitle}
            </Text>
            <Heading fontSize="24px">{title}</Heading>
          </VStack>
        </VStack>
        <VStack flex="1" alignItems="flex-start" {...props}>
          {children}
        </VStack>
      </Flex>
    </>
  );
};

export default Layout;
