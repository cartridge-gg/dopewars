import { Divider, HStack, StyleProps, Text } from "@chakra-ui/react";
import { Bag } from "./icons";
import { Acid, Cocaine, Heroin, Ludes, Speed, Weed } from "./icons/drugs";

export const Inventory = ({ ...props }: StyleProps) => {
  return (
    <HStack {...props}>
      <Bag boxSize="36px" />
      <HStack
        bgColor="neon.800"
        h="full"
        px="30px"
        backgroundImage="linear-gradient(to left, #172217 0%, transparent 10%), linear-gradient(to right, #172217 0%, transparent 10%)"
      >
        <HStack>
          <Ludes boxSize="24px" />
          <Text>25</Text>
        </HStack>
        <Divider orientation="vertical" borderColor="neon.700" h="50%" />
        <HStack>
          <Speed boxSize="24px" />
          <Text>25</Text>
        </HStack>
        <Divider orientation="vertical" borderColor="neon.700" h="50%" />
        <HStack>
          <Weed boxSize="24px" />
          <Text>25</Text>
        </HStack>
        <Divider orientation="vertical" borderColor="neon.700" h="50%" />
        <HStack>
          <Acid boxSize="24px" color="neon.600" />
        </HStack>
        <Divider orientation="vertical" borderColor="neon.700" h="50%" />
        <HStack>
          <Heroin boxSize="24px" color="neon.600" />
        </HStack>
        <Divider orientation="vertical" borderColor="neon.700" h="50%" />
        <HStack>
          <Cocaine boxSize="24px" color="neon.600" />
        </HStack>
      </HStack>
    </HStack>
  );
};
