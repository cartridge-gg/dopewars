import { useConfigStore, useDojoContext, useGameStore, useRouterContext } from "@/dojo/hooks";
import { Card, Divider, HStack, StyleProps, Text, Tooltip, VStack } from "@chakra-ui/react";
import { Hustler, Hustlers } from "./hustlers";

export const Inventory = ({ ...props }: StyleProps) => {
  const { gameId } = useRouterContext();
  const { account } = useDojoContext();
  const { game, gameInfos } = useGameStore();
  const configStore = useConfigStore();

  return (
    <VStack {...props} w="full" align="flex-start" pb="0" gap={[0, "6px"]}>
      <HStack w="full" justify={"space-between"}>
        {/* <HStack color={playerEntity?.drugCount === 0 ? "neon.500" : "yellow.400"} justify="center">
          <Bag />
          <Text>
            {playerEntity?.drugCount}/{playerEntity?.getTransport()}
          </Text>
        </HStack> */}
      </HStack>

      <HStack w="full" flexWrap="wrap" justify="space-between">
        <Card h="40px" px="20px" justify="center">
          <HStack gap="10px" justify="flex-end">
            <PlayerItem item={game?.items.attack} />
            <VerticalDivider />
            <PlayerItem item={game?.items.defense} />
            <VerticalDivider />
            <PlayerItem item={game?.items.speed} />
            <VerticalDivider />
            <PlayerItem item={game?.items.transport} />
            {/* {playerEntity?.items.length === 0 && <Text color="neon.500">No gear</Text>} */}
          </HStack>
        </Card>

        <Hustler hustler={gameInfos?.avatar_id as Hustlers} width="60px" height="60px" />

        <Card h="40px" px="20px" justify="center">
          <HStack gap="10px" justify="flex-start">
            <Text color="neon.500">No product</Text>

            {/* {playerEntity?.drugCount === 0 ? (
            ) : (
              playerEntity?.drugs.map((drug, key) => {
                const drugConfig = configStore.getDrug(drug.id)!;
                return (
                  drug.quantity > 0 && (
                    <>
                      <HStack gap="10px" key={`item-${key * 2}`}>
                        <HStack color="yellow.400">
                          {drugConfig.icon({ boxSize: "26" })}
                          <Text>{drug.quantity}</Text>
                        </HStack>
                      </HStack>
                      <Divider
                        key={`item-${key * 2 + 1}`}
                        h="10px"
                        orientation="vertical"
                        borderWidth="1px"
                        borderColor="neon.600"
                        _last={{ display: "none" }}
                      />
                    </>
                  )
                );
              })
            )} */}
          </HStack>
        </Card>
      </HStack>
    </VStack>
  );
};

const PlayerItem = ({ item }) => {
  return (
    <HStack gap="10px" key={`item-${item.item_id}`}>
      <Tooltip label={`${item.name} (+${item.stat} ${item.statName})`}>
        <HStack color="yellow.400">
          <>
            {/* <Text>{item.name}</Text> */}
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
  return (
    <Divider _last={{ display: "none" }} h="10px" orientation="vertical" borderWidth="1px" borderColor="neon.600" />
  );
};
