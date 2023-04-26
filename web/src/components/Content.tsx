import { StyleProps, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";

const Content = ({
  children,
  ...props
}: { children: ReactNode } & StyleProps) => (
  <VStack maxWidth={["full", "full", "full", "640px"]} {...props}>
    {children}
  </VStack>
);

export default Content;
