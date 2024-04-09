import { Button } from "@/components/common";
import { CopsIcon, GangIcon } from "@/components/icons";
import { Footer, Layout } from "@/components/layout";
import { HustlerProfile } from "@/components/pages/profile/HustlerProfile";
import { Loadout } from "@/components/pages/profile/Loadout";
import { Inventory } from "@/components/player";
import { GameClass } from "@/dojo/class/Game";
import {
  GameCreatedData,
  GameOverData,
  ParseEventResult,
  TradeDrugData,
  TravelEncounterData,
  TravelEncounterResultData,
  TraveledData,
  UpgradeItemData,
} from "@/dojo/events";
import { WorldEvents } from "@/dojo/generated/contractEvents";
import {
  encountersActionName,
  encountersActionNameKeys,
  outcomeNames,
  outcomeNamesKeys,
  reputationRanks,
  reputationRanksKeys,
} from "@/dojo/helpers";
import { useConfigStore, useGameStore, useRouterContext } from "@/dojo/hooks";
import { ConfigStoreClass, LocationConfigFull } from "@/dojo/stores/config";
import { EncounterOutcomes, Encounters, EncountersAction, ItemSlot } from "@/dojo/types";
import { IsMobile, formatCash } from "@/utils/ui";
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
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { shortString } from "starknet";

type LogByDay = {
  day: number;
  location: LocationConfigFull | undefined;
  logs: ParseEventResult[];
};

const Logs = () => {
  const { router, gameId } = useRouterContext();

  const { account } = useAccount();
  const configStore = useConfigStore();
  const { game, gameInfos, gameEvents } = useGameStore();

  const [playerHustlerId, setPlayerHustlerId] = useState(0);

  const [logs, setLogs] = useState<LogByDay[]>([]);
  const listRef = useRef(null);

  const isMobile = IsMobile();

  useEffect(() => {
    if (!gameEvents?.sortedEvents) return;

    const logsByDay = [];

    let dayLogs: LogByDay = {
      day: 0,
      location: undefined,
      logs: [],
    };

    for (let log of gameEvents?.sortedEvents) {
      if (log.parsed.eventType === WorldEvents.GameCreated) {
        // setPlayerName((log.parsed as GameCreatedData).playerName);
        setPlayerHustlerId((log.parsed as GameCreatedData).hustlerId);
      }

      if (log.parsed.eventType === WorldEvents.Traveled) {
        // create new day
        logsByDay.push(dayLogs);

        const travelEvent = log.parsed as TraveledData;

        dayLogs = {
          day: travelEvent.turn,
          location: configStore.getLocationById(travelEvent.toLocationId),
          logs: [],
        };
      } else {
        // push other events in dayLogs
        dayLogs.logs.push(log.parsed);
      }
    }
    logsByDay.push(dayLogs);

    // move day 0 hood events to day 0 location events
    const day0HoodIndex = logsByDay.findIndex((i) => i.day === 0 && !i.location);
    const day0Index = logsByDay.findIndex((i) => i.day === 0 && i.location);

    if (day0HoodIndex > -1 && day0Index > -1) {
      const day0Hood = logsByDay[day0HoodIndex];
      const day0 = logsByDay[day0Index];
      day0.logs.unshift(...day0Hood.logs);
      day0Hood.logs = [];
      logsByDay[day0HoodIndex] = day0Hood;
      logsByDay[day0Index] = day0;
    }

    setLogs(logsByDay);
  }, [gameEvents?.sortedEvents, configStore]);

  useEffect(() => {
    if (!listRef.current) return;
    const lastEl = listRef.current["lastElementChild"];
    // @ts-ignore
    lastEl && lastEl.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  //const rigthPanelMaxH = isMobile ? (playerId ? "calc(100vh - 140px)" : "calc(100vh - 400px)") : "auto";
  const rigthPanelMaxH = isMobile ? "calc(100vh - 140px)" : "auto";

  if (!logs || !game) {
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
              if (gameInfos?.game_over || !account || account.address !== gameInfos?.player_id) {
                router.push("/");
              } else {
                // return to game
                router.back();
              }
            }}
          >
            Back
          </Button>
        </Footer>
      }
      isSinglePanel={true}
      // CustomLeftPanel={CustomLeftPanel}
      // rigthPanelMaxH={rigthPanelMaxH}
    >
      <VStack w="full" h={["100%", "calc(100% - 100px)"]}>
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
                  {logs && logs.map((log) => renderDay(configStore, game, log))}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
        {isMobile && <Box display="block" minH={"80px"} w="full" />}
      </VStack>
    </Layout>
  );
};

export default observer(Logs);

const CustomLeftPanel = () => {
  const { game, gameInfos } = useGameStore();

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
      <Text textStyle="subheading" textAlign="center" fontSize={["9px", "11px"]}>
        {game ? reputationRanks[game.player.drugLevel as reputationRanksKeys] : ""}
      </Text>
      <Heading fontSize={["36px", "48px"]} fontWeight="400" mb={["0px", "20px"]}>
        {shortString.decodeShortString(gameInfos?.player_name || "")}
      </Heading>

      <Box maxW="350px" w="100%">
        <Inventory hidePawnshop={true} />
      </Box>

      <HustlerProfile />
    </VStack>
  );
};

function renderDay(configStore: ConfigStoreClass, game: GameClass, log: LogByDay) {
  return (
    <>
      {log.location && (
        <HStack w="full" mt={["20px", "30px"]}>
          {log.location.icon({ color: "neon.500" })}
          <Text fontSize={["10px", "12px"]} w="full" textStyle="subheading" color="neon.500">
            DAY {log.day + 1} - {log.location.name}
          </Text>
        </HStack>
      )}

      <UnorderedList listStyleType="none" w="full">
        {log.logs.map((i, idx) => {
          const key = `key-${log.day}-${idx}`;

          switch (i.eventType) {
            case WorldEvents.TradeDrug:
              return renderTradeDrug(configStore, i as TradeDrugData, key);
              break;

            case WorldEvents.UpgradeItem:
              return renderUpgradeItem(configStore, game, i as UpgradeItemData, key);
              break;

            case WorldEvents.TravelEncounter:
              return renderTravelEncounter(i as TravelEncounterData, log, key);
              break;

            case WorldEvents.GameOver:
              return renderGameOver(i as GameOverData, key);
              break;

            default:
              break;
          }
        })}
      </UnorderedList>
    </>
  );
}

function renderTradeDrug(configStore: ConfigStoreClass, log: TradeDrugData, key: string) {
  const drug = configStore.getDrugById(Number(log.drugId))!;
  const action = log.isBuy ? "Bought" : "Sold";
  const sign = log.isBuy ? "-" : "+";
  const totalPrice = log.price * log.quantity;
  return (
    <Line
      key={key}
      icon={drug.icon}
      text={`${action} ${drug.name}`}
      quantity={log.quantity}
      total={`${sign} ${formatCash(totalPrice)}`}
    />
  );
}

function renderUpgradeItem(configStore: ConfigStoreClass, game: GameClass, log: UpgradeItemData, key: string) {
  let item_id = 0;
  switch (log.itemSlot) {
    case ItemSlot.Weapon:
      item_id = game.items.hustlerConfig.weapon.base.id;
      break;
    case ItemSlot.Clothes:
      item_id = game.items.hustlerConfig.clothes.base.id;
      break;
    case ItemSlot.Feet:
      item_id = game.items.hustlerConfig.feet.base.id;
      break;
    case ItemSlot.Transport:
      item_id = game.items.hustlerConfig.transport.base.id;
      break;
    default:
      item_id = 0;
      break;
  }

  const item = configStore.getHustlerItemByIds(item_id, log.itemSlot, log.itemLevel);

  return (
    <Line
      key={key}
      icon={item.icon}
      text={`Bought ${item.upgradeName}`}
      total={`- ${formatCash(item.tier.cost)}`}
      color="yellow.400"
      iconColor="yellow.400"
    />
  );
}

function renderTravelEncounter(log: TravelEncounterData, dayLog: LogByDay, key: string) {
  const encounter = log.encounterId === Encounters.Cops ? "Cops" : "Gang";
  const icon = log.encounterId === Encounters.Cops ? CopsIcon : GangIcon;

  const results = dayLog.logs
    .filter((i) => i.eventType === WorldEvents.TravelEncounterResult)
    .map((i) => i as TravelEncounterResultData);

  const lastEncouterResult = results.length > 0 ? results[results.length - 1] : undefined;
  const lastEncounterResultName = lastEncouterResult
    ? outcomeNames[lastEncouterResult.outcome as outcomeNamesKeys]
    : "";

  const action = lastEncouterResult?.action;
  const totalHpLoss = lastEncouterResult
    ? log.healthLoss + lastEncouterResult?.dmgTaken.map((i) => i[0]).reduce((p, c) => p + c, 0)
    : log.healthLoss;

  return (
    <FightLine
      key={key}
      icon={icon}
      text={`Meet ${encounter} Lvl ${log.level}`}
      result={lastEncounterResultName}
      resultInfos={lastEncouterResult}
      consequence={`-${totalHpLoss} HP`}
      action={action}
      color="yellow.400"
    />
  );
}

function renderGameOver(log: GameOverData, key: string) {
  return (
    <ListItem w="full" mt="40px">
      <Text w="full" fontStyle="headings" fontSize={["16px", "20px"]} textTransform="uppercase" textAlign="center">
        WP <br /> ~ {log.playerName} ~
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
  key,
  color = "neon.400",
  iconColor = "neon.400",
}: {
  icon?: React.FC;
  text?: string;
  quantity?: number | string;
  total?: number | string;
  key: string;
  color?: string;
  iconColor?: string;
}) => {
  return (
    <ListItem w="full" key={key} py="6px" borderBottom="solid 1px" mt="6px" fontSize={["12px", "16px"]}>
      <HStack w="full">
        <HStack flex="4" color={color}>
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
  key,
  color,
}: {
  icon?: React.FC;
  text?: string;
  result?: string;
  resultInfos?: TravelEncounterResultData;
  consequence?: string;
  action?: EncountersAction;
  key: string;
  color?: string;
}) => {
  const [resultTooltip, setResultTooltip] = useState("");

  useEffect(() => {
    if (resultInfos && resultInfos.outcome === EncounterOutcomes.Victorious) {
      setResultTooltip(`+ ${formatCash(resultInfos.cashEarnt)}`);
    } else if (resultInfos && resultInfos.outcome === EncounterOutcomes.Paid) {
      if (resultInfos.cashLoss > 0) {
        setResultTooltip(`- ${formatCash(resultInfos.cashLoss)}`);
      } else {
        setResultTooltip(`- ${resultInfos.drugLoss.reduce((p, c) => p + c, 0)} Drugs`);
      }
    } else {
      setResultTooltip("");
    }
  }, [resultInfos, result]);

  return (
    <ListItem w="full" key={key} py="6px" borderBottom="solid 1px" mt="6px" fontSize={["12px", "16px"]}>
      <HStack w="full">
        <HStack flex="4" color="yellow.400">
          <Box w="30px">{icon && icon({ boxSize: "24px" })}</Box>
          <Tooltip
            label={action !== undefined ? encountersActionName[action as encountersActionNameKeys] : ""}
            placement="right-end"
          >
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
