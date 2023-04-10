import { Box, Flex, StyleProps } from "@chakra-ui/react";
import { ReactNode } from "react";

const Window = ({
  children,
  ...rest
}: { children?: ReactNode } & StyleProps) => {
  return (
    <Flex
      w={["full", "full", "600px"]}
      h={["full", "full", "800px"]}
      p="12px"
      direction="column"
      bgImage={`url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23111' stroke-width='8' stroke-dasharray='100%2c 20%2c 40%2c 40' stroke-dashoffset='58' stroke-linecap='square'/%3e%3c/svg%3e")`}
      gap="12px"
      {...rest}
    >
      {children}
    </Flex>
  );
};

export default Window;
