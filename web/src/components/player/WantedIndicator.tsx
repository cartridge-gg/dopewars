import { HStack, StyleProps, Text } from "@chakra-ui/react";
import { Siren } from "../icons";

import { Tooltip } from "../common";
import { blinkAnim } from "./HealthIndicator";

export const WantedIndicator = ({ wanted, ...props }: { wanted: number } & StyleProps) => {
  return (
    <Tooltip color="yellow.400" title="Wanted Level" text="Likelihood of encountering Cops or Gangs">
      <HStack w="70px"
        color={wanted > 68 ? "red" : wanted > 29 ? "yellow.400" : "neon.400"}
        animation={wanted >= 85 ? `${blinkAnim} infinite 0.5s linear` : "none"}
        {...props}
      >
        <Siren /> <Text>{wanted}%</Text>
      </HStack>
    </Tooltip>
  );
};
