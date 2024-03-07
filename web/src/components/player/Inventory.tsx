import { reputationRanks, reputationRanksKeys, statName } from "@/dojo/helpers";
import { useConfigStore, useDojoContext, useGameStore, useRouterContext } from "@/dojo/hooks";
import { HustlerItemConfigFull } from "@/dojo/stores/config";
import { ItemSlot } from "@/dojo/types";
import { Card, Divider, HStack, StyleProps, Text, VStack, keyframes } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { Tooltip } from "../common";
import { Bag, Cigarette, PawnshopIcon } from "../icons";

import colors from "@/theme/colors";
import { PowerMeter } from "./PowerMeter";

const blinkAnim = keyframes`  
  0% {background-color: ${colors.neon[900]} ;}   
  50% {background-color: ${colors.neon[700]};}   
`;

export const Inventory = observer(({ hidePawnshop = false, ...props }: StyleProps & { hidePawnshop?: boolean }) => {
  const { gameId, router } = useRouterContext();
  const { account } = useDojoContext();
  const { game, gameInfos } = useGameStore();
  const configStore = useConfigStore();

  if (!game || !configStore) return null;

  return (
    <VStack {...props} w="full" align="flex-start" pb="0" gap={6}>
      {!hidePawnshop && (
        <VStack w="full" alignItems="flex-start">
          <Text textStyle="subheading" fontSize="11px" color="neon.500" h="24px" lineHeight="24px">
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
            opacity={game.isShopOpen ? 1 : 0.5}
            animation={game.isShopOpen ? `${blinkAnim} 6s linear infinite` : "none"}
            onClick={() => {
              if (game.isShopOpen) {
                router.push(`/${gameId}/pawnshop`);
              }
            }}
          >
            <PawnshopIcon ml={-1} />
            <Text ml={3}>{game.isShopOpen ? "Open" : "Closed"}</Text>
          </Card>
        </VStack>
      )}

      <HStack w="full" justifyContent="space-between">
        <VStack w="full" alignItems="flex-start">
          <HStack color="neon.500" justify="center" alignItems="center">
            <Cigarette />
            <Text textStyle="subheading" fontSize="11px" mt={2}>
              REPUTATION
            </Text>
          </HStack>

          <Card h="40px" px="5px" justify="center" alignItems="center">
            <PowerMeter
              text={reputationRanks[game.encounters.level as reputationRanksKeys]}
              basePower={0}
              power={Math.ceil((game.encounters.level + 1) / 3)}
              maxPower={5}
              displayedPower={5}
            />
          </Card>
        </VStack>

        {/* ************** */}

        <VStack w="full" alignItems="flex-end">
          <HStack color={game?.drugs.quantity === 0 ? "neon.500" : "yellow.400"} justify="center" alignItems="center">
            <Bag />
            <Text textStyle="subheading" fontSize="11px" mt={2}>
              {game.drugs.drug ? (game?.drugs.quantity * configStore.getDrug(game.drugs.drug?.drug)!.weight) / 100 : 0}/
              {game.items.transport!.tier.stat / 100} LB
            </Text>
          </HStack>

          <Card h="40px" px="20px" justify="center" minW="140px" alignItems="center">
            <HStack gap="10px" justify="flex-start">
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

  const stat = item.slot === ItemSlot.Transport ? item.tier.stat / 100 : item.tier.stat;
  return (
    <HStack gap="10px" {...props}>
      <Tooltip
        title={`${item.base.name}`}
        text={`${item.upgradeName} (+${stat} ${statName[item.slot]})`}
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
