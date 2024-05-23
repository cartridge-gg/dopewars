import { Card, HStack, StyleProps, Text } from "@chakra-ui/react";
import { DynamicReputation } from "../icons";
import { Tooltip } from "../common";
import colors from "@/theme/colors";

const getRep = (rep: number, step: number): number => {
  return Math.max(0, rep - step * 20);
};

const getColor = (rep: number, step: number): string => {
  let value = getRep(rep, step);
  return value > 0 ? colors.yellow["400"].toString() : colors.yellow["500"].toString();
};

export const ReputationIndicator = ({ reputation, ...props }: { reputation: number } & StyleProps) => {
  return (
    <Tooltip
      title={`Reputation: ${reputation}`}
      text={`Your actions influence your reputation. Do the right things...`}
      color="yellow.400"
    >
      <Card h="40px" px="6px" justify="center" alignItems="center">
        <HStack>
          <DynamicReputation value={getRep(reputation, 0)} max={20} color={getColor(reputation, 0)} />
          <DynamicReputation value={getRep(reputation, 1)} max={20} color={getColor(reputation, 1)} />
          <DynamicReputation value={getRep(reputation, 2)} max={20} color={getColor(reputation, 2)} />
          <DynamicReputation value={getRep(reputation, 3)} max={20} color={getColor(reputation, 3)} />
          <DynamicReputation value={getRep(reputation, 4)} max={20} color={getColor(reputation, 4)} />
        </HStack>
      </Card>
    </Tooltip>
  );
};
