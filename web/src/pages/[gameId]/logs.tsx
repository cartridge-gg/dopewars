import { Button } from "@/components/common";
import { Cigarette, CopsIcon, GangIcon } from "@/components/icons";
import { Footer, Layout } from "@/components/layout";
import {
  GameOver,
  TradeDrug,
  Traveled,
  TravelEncounter,
  TravelEncounterResult,
  UpgradeItem,
} from "@/components/layout/GlobalEvents";
import { HustlerProfile } from "@/components/pages/profile/HustlerProfile";
import { Loadout } from "@/components/pages/profile/Loadout";
import { Inventory, PowerMeter } from "@/components/player";
import { DojoEvent } from "@/dojo/class/Events";
import { GameClass } from "@/dojo/class/Game";
import { useConfigStore, useGameStore, useRouterContext } from "@/dojo/hooks";
import { EncounterOutcomes, EncountersAction, ItemSlot } from "@/dojo/types";
import { formatCash } from "@/utils/ui";
import {
  Box,
  Flex,
  HStack,
  Heading,
  Image,
  ListItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { getGearItem } from "@/dope/helpers";
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { num, shortString } from "starknet";

type IndexedDojoEvent = {
  index: number;
  dojoEvent: DojoEvent;
};

const Logs = () => {
  const { router } = useRouterContext();

  const { account } = useAccount();
  const configStore = useConfigStore();
  const { game, gameInfos, gameEvents } = useGameStore();

  const [sortedEvents, setSortedEvents] = useState<IndexedDojoEvent[]>([]);
  const listRef = useRef(null);

  useEffect(() => {
    if (!gameEvents?.sortedEvents) return;

    // for (const e of gameEvents?.sortedEvents) {
    //   console.log(e.eventName, e.event);
    // }

    const sortedEvents = gameEvents?.sortedEvents
      .flatMap((event: DojoEvent) => {
        switch (event.eventName) {
          case "Traveled":
            return [
              {
                index: (event.event as Traveled).turn * 100,
                dojoEvent: event,
              },
            ];

          case "TradeDrug":
            return [
              {
                index: (event.event as TradeDrug).turn * 100 + event.idx + ((event.event as TradeDrug).is_buy ? 30 : 1),
                dojoEvent: event,
              },
            ];

          case "UpgradeItem":
            return [
              {
                index: (event.event as UpgradeItem).turn * 100 + event.idx + 20,
                dojoEvent: event,
              },
            ];

          case "TravelEncounter":
            return [
              {
                index: (event.event as TravelEncounter).turn * 100 + event.idx + 50,
                dojoEvent: event,
              },
            ];

          case "TravelEncounterResult":
            return [
              {
                index: (event.event as TravelEncounterResult).turn * 100 + event.idx + 50 + 1,
                dojoEvent: event,
              },
            ];

          case "GameOver":
            return [
              {
                index: (event.event as GameOver).turn * 100 + event.idx + 69 + 1,
                dojoEvent: event,
              },
            ];

          default:
            return [];
        }
      })
      .sort((a, b) => a.index - b.index);

    // for (const e of sortedEvents) {
    //   console.log(e.index, e.dojoEvent.eventName, e.dojoEvent.event);
    // }

    setSortedEvents(sortedEvents);
  }, [gameEvents?.sortedEvents, gameEvents?.sortedEvents.length, configStore]);

  useEffect(() => {
    if (!listRef.current) return;
    const lastEl = listRef.current["lastElementChild"];
    // @ts-ignore
    lastEl && lastEl.scrollIntoView({ behavior: "smooth" });
  }, [sortedEvents]);

  if (!sortedEvents || !game) {
    return <></>;
  }

  return (
    <Layout
      footer={
        <Footer>
          <Button
            w={["full", "auto"]}
            px={["auto", "20px"]}
            onClick={() => {
              router.back();
            }}
          >
            Back
          </Button>
        </Footer>
      }
      isSinglePanel={true}
    >
      <VStack w="full" h={["100%", "calc(100% - 120px)"]}>
        <Flex w="full" direction={["column", "row"]} gap={[0, "80px"]} h={["auto", "100%"]}>
          <CustomLeftPanel />

          <Tabs variant="unstyled" w="full" flex={1} h={["auto", "100%"]}>
            <TabList>
              <Tab>Loadout</Tab>
              <Tab>Activity</Tab>
            </TabList>

            <TabPanels w="full" h={["auto", "100%"]}>
              <TabPanel w="full" maxH="600px" h={["auto", "100%"]} overflowY={["auto", "scroll"]}>
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                  <Loadout />
                </Box>
              </TabPanel>
              <TabPanel w="full" maxH="600px" h={["auto", "100%"]} overflowY={["auto", "scroll"]}>
                <VStack w="full" mt={["-20px", "-30px"]} ref={listRef}>
                  <UnorderedList listStyleType={"none"} w="full">
                    {sortedEvents &&
                      sortedEvents.map((dojoEvent) => {
                        const related =
                          dojoEvent.dojoEvent.eventName === "TravelEncounter"
                            ? sortedEvents.find(
                                (i) =>
                                  i.dojoEvent.eventName === "TravelEncounterResult" &&
                                  i.dojoEvent.event.turn === dojoEvent.dojoEvent.event.turn,
                              )
                            : undefined;

                        return renderEvent(game, dojoEvent, related);
                      })}
                  </UnorderedList>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
        <Box display="block" minH={"80px"} w="full" />
      </VStack>
    </Layout>
  );
};

export default observer(Logs);

const CustomLeftPanel = () => {
  const { game, gameInfos } = useGameStore();
  const { router } = useRouterContext();

  return (
    <VStack
      flex={1}
      w="full"
      h="full"
      justifyContent="center"
      alignItems="center"
      marginBottom={["30px", "50px"]}
      gap={0}
    >
      <Heading
        fontSize={["30px", "48px"]}
        fontWeight="400"
        mb={["0px", "20px"]}
        cursor="pointer"
        onClick={() => {
          router.push(`/game/history/0x${BigInt(game?.gameInfos.player_id || 0).toString(16)}`);
        }}
      >
        {shortString.decodeShortString(num.toHexString(BigInt(gameInfos?.player_name?.value)) || "")}
      </Heading>

      <Box maxW="350px" w="100%">
        <Inventory hidePawnshop={true} />
      </Box>

      <HustlerProfile />

      <HStack justifyContent={"space-between"} mt={6}>
        <Text color="yellow.400">STAKE x{game?.gameInfos.multiplier}</Text>
        <PowerMeter basePower={0} maxPower={10} power={game?.gameInfos.multiplier} />
      </HStack>
    </VStack>
  );
};

function renderEvent(game: GameClass, indexedEvent: IndexedDojoEvent, relatedEvent?: IndexedDojoEvent) {
  switch (indexedEvent.dojoEvent.eventName) {
    case "Traveled":
      return renderTraveled(game, indexedEvent.dojoEvent.event as Traveled, `tr-${indexedEvent.index}`);

    case "TradeDrug":
      return renderTradeDrug(game, indexedEvent.dojoEvent.event as TradeDrug, `td-${indexedEvent.index}`);

    case "UpgradeItem":
      return renderUpgradeItem(game, indexedEvent.dojoEvent.event as UpgradeItem, `ui-${indexedEvent.index}`);

    case "TravelEncounter":
      return renderTravelEncounter(
        game,
        indexedEvent.dojoEvent.event as TravelEncounter,
        `te-${indexedEvent.index}`,
        relatedEvent?.dojoEvent.event as TravelEncounterResult,
      );

    case "GameOver":
      return renderGameOver(indexedEvent.dojoEvent.event as GameOver, `go-${indexedEvent.index}`);

    default:
      return null;
  }
}

function renderTraveled(game: GameClass, log: Traveled, key: string) {
  const location = game.configStore.getLocationById(log.to_location_id);
  if (!location) return null;
  return (
    <ListItem w="full" display="flex" alignItems="center" flexDirection="row" key={key} py="6px" mt={["30px", "20px"]}>
      <Box mr="12px">{location.icon({ color: "neon.500" })}</Box>
      <Text fontSize={["10px", "12px"]} w="full" textStyle="subheading" color="neon.500">
        DAY {log.turn} - {location.name}
      </Text>
    </ListItem>
  );
}

function renderTradeDrug(game: GameClass, log: TradeDrug, key: string) {
  const drug = game.configStore.getDrugById(game.seasonSettings.drugs_mode, Number(log.drug_id))!;
  const action = log.is_buy ? "Bought" : "Sold";
  const sign = log.is_buy ? "-" : "+";
  const totalPrice = log.price * log.quantity;
  return (
    <Line
      key={key}
      icon={drug.icon}
      text={`${action} ${drug.name} at ${formatCash(log.price)}`}
      quantity={log.quantity}
      total={`${sign} ${formatCash(totalPrice)}`}
    />
  );
}

function renderUpgradeItem(game: GameClass, log: UpgradeItem, key: string) {
  let gear_item = game.configStore.getGearItemFull(
    getGearItem(BigInt(game.gameInfos.equipment_by_slot ? game.gameInfos.equipment_by_slot[log.item_slot] : 0)),
  );

  return (
    <Line
      key={key}
      icon={Cigarette}
      text={`Upgraded ${gear_item.name}`}
      total={`- ${formatCash(gear_item.levels[log.item_level].cost)}`}
      color="yellow.400"
      iconColor="yellow.400"
    />
  );
}

function renderTravelEncounter(
  game: GameClass,
  log: TravelEncounter,
  key: string,
  lastEncounterResult?: TravelEncounterResult,
) {
  const icon = log.encounter === "Cops" ? CopsIcon : GangIcon;
  const action = lastEncounterResult?.action;
  const totalHpLoss = lastEncounterResult?.dmg_taken.map((i) => i[0]).reduce((p, c) => p + c.value, 0) || 0;

  return (
    <FightLine
      key={key}
      icon={icon}
      text={`Meet ${log.encounter} Lvl ${log.level}`}
      result={lastEncounterResult?.outcome}
      resultInfos={lastEncounterResult}
      consequence={totalHpLoss > 0 ? `-${totalHpLoss} HP` : ""}
      action={action}
      color="yellow.400"
    />
  );
}

function renderGameOver(log: GameOver, key: string) {
  return (
    <ListItem key={key} w="full" mt="40px">
      <Text w="full" fontStyle="headings" fontSize={["16px", "20px"]} textTransform="uppercase" textAlign="center">
        WP <br /> ~ {log.player_name} ~
      </Text>
      <Image src="/images/events/smoking_gun.gif" alt="rip" w="200px" h="200px" mx="auto" />
    </ListItem>
  );
}

/*************************************************************** */

const Line = ({
  icon,
  text,
  quantity,
  total,
  color = "neon.400",
  iconColor = "neon.400",
}: {
  icon?: React.FC;
  text?: string;
  quantity?: number | string;
  total?: number | string;
  color?: string;
  iconColor?: string;
}) => {
  return (
    <ListItem w="full" py="6px" borderBottom="solid 1px" mt="6px" fontSize={["12px", "16px"]}>
      <HStack w="full">
        <HStack flex="6" color={color}>
          <Box w="30px">{icon && icon({ boxSize: "24px", color: iconColor })}</Box>
          <Text>{text}</Text>
        </HStack>

        <HStack justify="right">
          <Text>{quantity}</Text>
        </HStack>
        <Text flex="3" textAlign="right">
          {total}
        </Text>
      </HStack>
    </ListItem>
  );
};

const FightLine = ({
  icon,
  text,
  result,
  resultInfos,
  consequence,
  action,
  color,
}: {
  icon?: React.FC;
  text?: string;
  result?: string;
  resultInfos?: TravelEncounterResult;
  consequence?: string;
  action?: EncountersAction;
  color?: string;
}) => {
  const [resultTooltip, setResultTooltip] = useState("");

  useEffect(() => {
    if (resultInfos && resultInfos.outcome === "Victorious") {
      setResultTooltip(`+ ${formatCash(resultInfos.cash_earnt)}`);
    } else if (resultInfos && resultInfos.outcome === "Paid") {
      if (resultInfos.cash_loss > 0) {
        setResultTooltip(`- ${formatCash(resultInfos.cash_loss)}`);
      } else {
        setResultTooltip(`- ${resultInfos.drug_loss.reduce((p, c) => p + c, 0)} Drugs`);
      }
    } else {
      setResultTooltip("");
    }
  }, [resultInfos, result]);

  return (
    <ListItem w="full" py="6px" borderBottom="solid 1px" mt="6px" fontSize={["12px", "16px"]}>
      <HStack w="full">
        <HStack flex="4" color="yellow.400">
          <Box w="30px">{icon && icon({ boxSize: "24px" })}</Box>
          <Tooltip label={action} placement="right-end">
            <Text>{text}</Text>
          </Tooltip>
        </HStack>

        <HStack justify="right" color="red">
          <Text> {consequence}</Text>
        </HStack>

        <HStack flex="3" justifyContent="flex-end" color={result === "Died" ? "red" : "neon.400"}>
          <Tooltip placement="left" label={resultTooltip}>
            <Text>{result}</Text>
          </Tooltip>
        </HStack>
      </HStack>
    </ListItem>
  );
};
