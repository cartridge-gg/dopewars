import { breakpoint } from "@/utils/ui";
import { StyleProps, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";

const Content = ({
  children,
  ...props
}: { children: ReactNode } & StyleProps) => (
  <VStack
    w="full"
    px={breakpoint("24px", "80px")}
    maxWidth={breakpoint("full", "800px")}
    {...props}
  >
    {children}
  </VStack>
);

export default Content;
