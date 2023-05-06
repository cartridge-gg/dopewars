import { StyleProps, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";

const Content = ({
  children,
  ...props
}: { children: ReactNode } & StyleProps) => (
  <VStack
    w="full"
    position="relative"
    top={["20px", "20%"]}
    px={["24px", "80px"]}
    maxWidth={["full", "800px"]}
    {...props}
  >
    {children}
  </VStack>
);

export default Content;
