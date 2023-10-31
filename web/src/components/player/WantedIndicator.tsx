import { StyleProps, HStack, Text } from "@chakra-ui/react";
import { Siren } from "../icons";

import { blinkAnim } from "./HealthIndicator";

const WantedIndicator = ({ wanted, ...props }: { wanted: number } & StyleProps) => {
  return (
    <HStack
      color={wanted > 68 ? "red" : wanted > 29 ? "yellow.400" : "neon.400"}
      animation={wanted >= 85 ? `${blinkAnim} infinite 0.5s linear` : "none"}
      {...props}
    >
      <Siren /> <Text>{wanted}</Text>
    </HStack>
  );
};

export default WantedIndicator;
