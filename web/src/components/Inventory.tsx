import { useConfigStore, useDojoContext, useGameStore, useRouterContext } from "@/dojo/hooks";
import { ItemConfigFull } from "@/dojo/stores/config";
import { Button, Card, Divider, HStack, StyleProps, Text, Tooltip, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { Hustler, Hustlers } from "./hustlers";
import { Bag } from "./icons";

export const Inventory = observer(({ ...props }: StyleProps) => {
  const { gameId, router } = useRouterContext();
  const { account } = useDojoContext();
  const { game, gameInfos } = useGameStore();
  const configStore = useConfigStore();

  if (!game || !configStore) return null;

  return (
    <VStack {...props} w="full" align="flex-start" pb="0" gap={[0, "6px"]}>
      <HStack w="full" justify="flex-end">
        <HStack color={game?.drugs.quantity === 0 ? "neon.500" : "yellow.400"} justify="center">
          <Bag />
          <Text>
            {game.drugs.drug ? (game?.drugs.quantity * configStore.getDrug(game.drugs.drug?.drug).weight) / 100 : 0}/
            {game.items.transport.stat / 100} LBS
          </Text>
        </HStack>
      </HStack>

      <Button
        isDisabled={!game.isShopOpen}
        onClick={() => {
          router.push(`/${gameId}/pawnshop`);
        }}
      >
        PAWNSHOP
      </Button>

      <HStack w="full" flexWrap="wrap" justify="space-between">
        <Card h="40px" px="20px" justify="center">
          <HStack gap="10px" justify="flex-end">
            <PlayerItem item={game.items.attack} />
            <VerticalDivider />
            <PlayerItem item={game.items.defense} />
            <VerticalDivider />
            <PlayerItem item={game.items.speed}  />
            <VerticalDivider />
            <PlayerItem item={game.items.transport}/>
          </HStack>
        </Card>

        <Hustler hustler={gameInfos?.avatar_id as Hustlers} width="60px" height="60px" />

        <Card h="40px" px="20px" justify="center">
          <HStack gap="10px" justify="flex-start">
            {game.drugs.quantity === 0 && <Text color="neon.500">No product</Text>}
            {game.drugs.quantity > 0 && game.drugs.drug && (
              <HStack gap="10px">
                <HStack color="yellow.400">
                  {configStore.getDrug(game.drugs.drug.drug)?.icon({ boxSize: "26" })}
                  <Text>{game.drugs.quantity}</Text>
                </HStack>
              </HStack>
            )}
          </HStack>
        </Card>
      </HStack>
    </VStack>
  );
});

const PlayerItem = ({ item, ...props }: { item: ItemConfigFull}) => {
  if (!item) return null;

  const stat = item.statName === "INV" ? item.stat / 100 : item.stat;
  return (
    <HStack gap="10px" {...props}>
      <Tooltip label={`${item.name} (+${stat} ${item.statName})`}>
        <HStack color="yellow.400">
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
