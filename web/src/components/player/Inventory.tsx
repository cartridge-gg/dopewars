import { reputationRanks, reputationRanksKeys, statName } from "@/dojo/helpers";
import { useConfigStore, useGameStore, useRouterContext } from "@/dojo/hooks";
import { HustlerItemConfigFull } from "@/dojo/stores/config";
import { Card, Divider, HStack, Progress, StyleProps, Text, VStack, keyframes } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { Tooltip } from "../common";
import { Alert, PawnshopIcon } from "../icons";

import { Sounds, playSound } from "@/hooks/sound";
import colors from "@/theme/colors";
import { useAccount } from "@starknet-react/core";
import { WeightIcon } from "../icons/Weigth";
import { Reputation } from "../icons/items/Reputation";
import { PowerMeter } from "./PowerMeter";

const blinkAnim = keyframes`  
  0% {background-color: ${colors.neon[900]} ;}   
  50% {background-color: ${colors.neon[700]};}   
`;

export const Inventory = observer(({ hidePawnshop = false, ...props }: StyleProps & { hidePawnshop?: boolean }) => {
  const { gameId, router } = useRouterContext();
  const { account } = useAccount();

  const { game, gameInfos } = useGameStore();
  const configStore = useConfigStore();

  if (!game || !configStore) return null;

  return (
    <VStack {...props} w="full" align="flex-start" pb="0" gap={[3, 6]}>
      <HStack w="full" justifyContent="space-between">
        <VStack w="full" alignItems="flex-start" gap={[0, 1]}>
          <HStack color="neon.500" justify="center" alignItems="center">
            <Reputation />
            <Text textStyle="subheading" fontSize={["9px", "11px"]} lineHeight={1}>
              REPUTATION
            </Text>
          </HStack>

          <Tooltip
            title={`Reputation: ${game.player.reputation}`}
            text={`Your actions influence your reputation. Do the right things...`}
            color="yellow.400"
          >
            <Card h="40px" px="4px" justify="center" alignItems="center">
              <PowerMeter
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
              />
            </Card>
          </Tooltip>
        </VStack>

        {/* ************** */}

        <VStack w="full" alignItems="flex-end" gap={[0, 1]}>
          <HStack color={game?.drugs.quantity === 0 ? "neon.500" : "yellow.400"} justify="center" alignItems="center">
            <WeightIcon mb={1} />
            <Text textStyle="subheading" fontSize={["9px", "11px"]} lineHeight={1}>
              {game.drugs.drug ? game?.drugs.quantity * configStore.getDrug(game.drugs.drug?.drug)!.weight : 0}/
              {game.items.transport!.tier.stat}
            </Text>
          </HStack>

          <Card h="40px" px="20px" justify="center" minW="120px" alignItems="center">
            <HStack gap="10px" justify="flex-start" fontSize={["14px", "16px"]}>
              {game.drugs.quantity === 0 && <Text color="neon.500">No product</Text>}
              {game.drugs.quantity > 0 && game.drugs.drug && (
                <HStack gap="10px">
                  <HStack color="yellow.400">
                    {game.drugs.drug?.icon({ boxSize: "26" })}
                    <Text>{game.drugs.quantity}</Text>
                  </HStack>
                </HStack>
              )}
            </HStack>
          </Card>
        </VStack>
      </HStack>

      {!hidePawnshop && (
        <VStack w="full" alignItems="flex-start" gap={[0, 1]}>
          <Text textStyle="subheading" fontSize={["9px", "11px"]} color="neon.500" h="24px" lineHeight="24px">
            PAWNSHOP
          </Text>

          <Card
            cursor={game.isShopOpen ? "pointer" : "not-allowed"}
            w="full"
            h="40px"
            px="20px"
            flexDirection="row"
            justify="center"
            alignItems="center"
            animation={game.isShopOpen ? `${blinkAnim} 6s linear infinite` : "none"}
            onClick={() => {
              if (game.isShopOpen) {
                playSound(Sounds.Door, 0.5);
                router.push(`/${gameId}/pawnshop`);
              }
            }}
          >
            {game.isShopOpen ? <PawnshopIcon ml={-1} /> : <Alert ml={-1} />}
            <Text ml={3} color={game.isShopOpen ? "neon" : "red"}>
              {game.isShopOpen ? "Open" : "Closed"}
            </Text>
          </Card>
        </VStack>
      )}

      {/*
      <HStack w="full" flexWrap="wrap" justify="space-between">
        <Card h="40px" px="20px" justify="center">
          <HStack gap="10px" justify="flex-end">
            <PlayerItem item={game.items.attack!} />
            <VerticalDivider />
            <PlayerItem item={game.items.defense!} />
            <VerticalDivider />
            <PlayerItem item={game.items.speed!} />
            <VerticalDivider />
            <PlayerItem item={game.items.transport!} />
          </HStack>
        </Card> 
      </HStack>
      */}
    </VStack>
  );
});

const PlayerItem = ({ item, ...props }: { item: HustlerItemConfigFull }) => {
  if (!item) return null;

  //const stat = item.slot === ItemSlot.Transport ? item.tier.stat / 100 : item.tier.stat;
  return (
    <HStack gap="10px" {...props}>
      <Tooltip
        title={`${item.base.name}`}
        text={`${item.upgradeName} (+${item.tier.stat} ${statName[item.slot]})`}
        color="yellow.400"
      >
        <HStack>
          <>
            {item.icon &&
              item.icon({
                boxSize: "26",
              })}
          </>
        </HStack>
      </Tooltip>
    </HStack>
  );
};

const VerticalDivider = () => {
  return <Divider h="10px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />;
};
