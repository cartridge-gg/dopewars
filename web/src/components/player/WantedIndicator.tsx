import { Box, HStack, StyleProps, Text } from "@chakra-ui/react";
import { Alert, Siren } from "../icons";

import { Tooltip } from "../common";
import { blinkAnim } from "./HealthIndicator";

enum ThreatLevels {
  High = "HIGH",
  Medium = "MED",
  Low = "LOW",
}

export const WantedIndicator = ({
  wantedTick,
  highLimit,
  ...props
}: { wantedTick: number; highLimit: number } & StyleProps) => {
  const threatLevel =
    wantedTick >= highLimit || wantedTick >= 5
      ? ThreatLevels.High
      : wantedTick >= 2
      ? ThreatLevels.Medium
      : ThreatLevels.Low;

  return (
    <Tooltip color="yellow.400" title="Wanted Level" text="Likelihood of encountering Cops or Gangs">
      <HStack
        w="70px"
        color={threatLevel === ThreatLevels.High ? "red" : "neon.400"}
        animation={threatLevel === ThreatLevels.High ? `${blinkAnim} infinite 0.5s linear` : "none"}
        {...props}
      >
        {threatLevel === ThreatLevels.High ? (
          <Box boxSize="24px">
            <Alert width="20px" height="20px" />
          </Box>
        ) : (
          <Siren />
        )}{" "}
        <Text fontSize="11px" textStyle="subheading" lineHeight={1}>
          {threatLevel}
        </Text>
      </HStack>
    </Tooltip>
  );
};
