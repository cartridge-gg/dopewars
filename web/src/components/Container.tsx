import { Flex, Spacer } from "@chakra-ui/react";
import { Children, ReactNode } from "react";

interface ContainerProps {
  leftHeading?: ReactNode;
  rightHeading?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}

const Container = ({
  leftHeading,
  rightHeading,
  children,
  footer,
}: ContainerProps) => {
  return (
    <Flex
      gap="12px"
      p="12px"
      color="white"
      border="2px solid black"
      bg="#202221"
      w="576px"
      h="92%"
      direction="column"
      borderRadius={4}
    >
      <Flex textTransform="uppercase" w="full">
        {leftHeading}
        <Spacer />
        {rightHeading}
      </Flex>
      {children}
      {footer && (
        <>
          <Spacer />
          <Flex borderTop="2px solid black" m="-12px" bg="#141011" p="12px">
            {footer}
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default Container;
