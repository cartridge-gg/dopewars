import { Flex, StyleProps } from "@chakra-ui/react";
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
      bgColor="gray.800"
      borderRadius="4px"
      border="2px solid"
      borderColor="gray.900"
      direction="column"
      gap="12px"
      {...rest}
    >
      {children}
    </Flex>
  );
};

export default Window;
