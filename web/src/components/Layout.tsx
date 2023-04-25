import {
  SimpleGrid,
  VStack,
  Heading,
  Text,
  Box,
  StyleProps,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import Header from "./Header";

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
      <SimpleGrid columns={[1, 1, 1, 2]} h="100vh">
        <VStack
          backgroundImage={backgroundImage}
          backgroundSize="contain"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
        >
          <VStack gap="10px" position="relative" top="20%">
            <Text textTransform="uppercase">{prefixTitle}</Text>
            <Heading fontSize="24px">{title}</Heading>
          </VStack>
        </VStack>
        <VStack {...props}>{children}</VStack>
      </SimpleGrid>
    </>
  );
};

const Content = ({
  children,
  ...props
}: { children: ReactNode } & StyleProps) => {
  return <VStack {...props}>{children}</VStack>;
};

export default Layout;
