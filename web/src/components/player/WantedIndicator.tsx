import { StyleProps, HStack, Text, VStack } from "@chakra-ui/react";
import { Siren } from "../icons";

import { blinkAnim } from "./HealthIndicator";
import { ReactNode } from "react";
import Tooltip from "../Tooltip";

const WantedIndicator = ({ wanted, ...props }: { wanted: number } & StyleProps) => {
  return (
    <Tooltip   title="Wanted Level" text="Likelihood of encountering an adverse or being caught while escaping">
      <HStack
        color={wanted > 68 ? "red" : wanted > 29 ? "yellow.400" : "neon.400"}
        animation={wanted >= 85 ? `${blinkAnim} infinite 0.5s linear` : "none"}
        {...props}
      >
        <Siren /> <Text>{wanted}</Text>
      </HStack>
    </Tooltip>
  );
};

export default WantedIndicator;
