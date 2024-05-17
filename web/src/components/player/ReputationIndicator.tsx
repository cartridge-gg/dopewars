import { Card, HStack, StyleProps, Text } from "@chakra-ui/react";
import { DynamicReputation } from "../icons";
import { Tooltip } from "../common";
import colors from "@/theme/colors";

const getRep = (rep: number, step: number): number => {
  return Math.max(0, rep - step * 20);
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
          <DynamicReputation value={getRep(reputation, 0)} max={20} color={colors.yellow["400"].toString()} />
          <DynamicReputation value={getRep(reputation, 1)} max={20} color={colors.yellow["400"].toString()} />
          <DynamicReputation value={getRep(reputation, 2)} max={20} color={colors.yellow["400"].toString()} />
          <DynamicReputation value={getRep(reputation, 3)} max={20} color={colors.yellow["400"].toString()} />
          <DynamicReputation value={getRep(reputation, 4)} max={20} color={colors.yellow["400"].toString()} />
        </HStack>
        {/* <PowerMeter
        text={reputationRanks[game.player.drugLevel as reputationRanksKeys]}
        basePower={0}
        power={game.player.drugLevel}
        maxPower={4}
        displayedPower={4}
        bg="transparent"
      />
      <Progress
        position="absolute"
        bottom="4px"
        h="4px"
        px="6px"
        colorScheme="neon"
        w="full"
        zIndex={0}
        value={((game.player.reputation % 20) * 100) / 20}
      /> */}
      </Card>
    </Tooltip>
  );
};
