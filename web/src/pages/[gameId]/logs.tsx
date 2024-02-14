import { Footer } from "@/components/Footer";
import Layout from "@/components/Layout";

import Button from "@/components/Button";
import { Profile } from "@/components/ProfileButton";
import { Event as EventIcon } from "@/components/icons";
import {
  ConsequenceEventData,
  GameCreatedData,
  GameOverEventData,
  ParseEventResult,
  TradeDrugData,
  TravelEncounterData,
  UpgradeItemData,
} from "@/dojo/events";
import { WorldEvents } from "@/dojo/generated/contractEvents";
import { useConfigStore, useDojoContext, useGameStore, useRouterContext } from "@/dojo/hooks";
import { ConfigStore } from "@/dojo/stores/config";
import { Encounters, Outcome } from "@/dojo/types";
import { IsMobile, formatCash } from "@/utils/ui";
import { Box, HStack, Heading, Image, ListItem, Text, Tooltip, UnorderedList, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";

type LogByDay = {
  day: number;
  location: string;
  logs: ParseEventResult[];
};

const Logs = () => {
  const { router, gameId, playerId } = useRouterContext();

  const { account } = useDojoContext();
  const configStore = useConfigStore();
  const { gameEvents } = useGameStore();

  const [playerName, setPlayerName] = useState("");
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
        setPlayerName((log.parsed as GameCreatedData).playerName);
      }

      if (log.parsed.eventType === WorldEvents.Traveled) {
        // create new day
        logsByDay.push(dayLogs);

        const travelEvent = log.parsed as TraveledEventData;

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
    const day0HoodIndex = logsByDay.findIndex((i) => i.day === 0 && i.locationId === 0 /*"Hood"*/);
    const day0Index = logsByDay.findIndex((i) => i.day === 0 && i.locationId !== 0 /*"Hood"*/);
    if (day0HoodIndex > -1 && day0Index > -1) {
      const day0Hood = logsByDay[day0HoodIndex];
      const day0 = logsByDay[day0Index];
      day0.logs.unshift(...day0Hood.logs);
      day0Hood.logs = [];
      logsByDay[day0HoodIndex] = day0Hood;
      logsByDay[day0Index] = day0;
    }

    setLogs(logsByDay);
  }, [gameEvents?.sortedEvents]);

  useEffect(() => {
    if (!listRef.current) return;
    const lastEl = listRef.current["lastElementChild"];
    // @ts-ignore
    lastEl && lastEl.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const rigthPanelMaxH = isMobile ? (playerId ? "calc(100vh - 140px)" : "calc(100vh - 400px)") : "auto";

  if (!logs) {
    return <></>;
  }

  return (
    <Layout
      CustomLeftPanel={CustomLeftPanel}
      footer={
        <Footer>
          <Button
            w={["full", "auto"]}
            px={["auto", "20px"]}
            onClick={() => {
              if (playerId && playerId !== "") {
                router.push("/");
              } else {
                router.back();
              }
            }}
          >
            Back
          </Button>
        </Footer>
      }
      rigthPanelMaxH={rigthPanelMaxH}
    >
      <VStack w="full" ref={listRef}>
        {logs && logs.map((log) => /*log.logs.length > 0 &&*/ renderDay(configStore, log))}
      </VStack>
    </Layout>
  );
};

export default observer(Logs);

const CustomLeftPanel = () => {
  return (
    <VStack w="full" h="full" justifyContent="center" alignItems="center" flex="1">
      <Heading fontSize={["36px", "48px"]} fontWeight="400" mb={["0px", "20px"]}>
        Hustler Log
      </Heading>
      <Profile />
    </VStack>
  );
};

function renderDay(configStore: ConfigStore, log: LogByDay) {
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
              return renderUpgradeItem(configStore, i as UpgradeItemData, key);
              break;

            case WorldEvents.TravelEncounter:
              return renderTravelEncounter(i as TravelEncounterData, log, key);
              break;

            case WorldEvents.GameOver:
              // return renderGameOver(i as GameOverEventData, key);
              break;

            default:
              break;
          }
        })}
      </UnorderedList>
    </>
  );
}

function renderTradeDrug(configStore: ConfigStore, log: TradeDrugData, key: string) {
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

function renderUpgradeItem(configStore: ConfigStore, log: UpgradeItemData, key: string) {
  const item = configStore.getItemByIds(log.itemSlot, log.itemLevel);
  return (
    <Line
      key={key}
      icon={item.icon}
      text={`Bought ${item.name}`}
      total={`- ${formatCash(item.cost)}`}
      color="yellow.400"
      iconColor="yellow.400"
    />
  );
}

function renderTravelEncounter(log: TravelEncounterData, dayLog: LogByDay, key: string) {
  // const status = Number(log.playerStatus);
  // const encounter = status === 1 ? "Gang" : "Cops";
  const encounter = log.encounterId === Encounters.Cops ? "Cops" : "Gang";

  const decisions = [];
  const totalHpLoss = log.healthLoss;

  const lastConsequence = "lastConsequence";
  const lastConsequenceName = "lastConsequenceName";

  // const decisions = dayLog.logs
  //   .filter((i) => i.eventType === WorldEvents.Decision)
  //   .map((i) => i as DecisionEventData)
  //   .map((i) => getActionName(i.action))
  //   .join(", ");

  // const consequences = dayLog.logs
  //   .filter((i) => i.eventType === WorldEvents.Consequence)
  //   .map((i) => i as ConsequenceEventData);

  // const lastConsequence = consequences.length > 0 ? consequences[consequences.length - 1] : undefined;
  // const lastConsequenceName = lastConsequence ? getOutcomeName(lastConsequence.outcome) : "";

  // const totalHpLoss =
  //   dayLog.logs.length > 0
  //     ? dayLog.logs
  //         .filter((i) => i.eventType === WorldEvents.Consequence)
  //         .map((i) => i as ConsequenceEventData)
  //         .map((i) => i.healthLoss)
  //         .reduce((prev, curr) => {
  //           return prev + curr;
  //         }, log.healthLoss)
  //     : log.healthLoss;

  return (
    <FightLine
      key={key}
      icon={EventIcon}
      text={`Meet ${encounter} LVL ${log.level}`}
      result={lastConsequenceName}
      resultInfos={lastConsequence}
      consequence={`-${totalHpLoss} HP`}
      decisions={decisions}
      color="yellow.400"
    />
  );
}

function renderGameOver(log: GameOverEventData, key: string) {
  return (
    <ListItem w="full" mt="40px">
      <Text w="full" fontStyle="headings" fontSize={["16px", "20px"]} textTransform="uppercase" textAlign="center">
        RIP <br /> ~ {log.playerName} ~
      </Text>
      <Image src="/images/events/smoking_gun.gif" alt="rip" w="200px" h="200px" mx="auto" />
    </ListItem>
  );
}

// function renderDecision(log: DecisionEventData, key: string) {
//   const action = getActionName(log.action);
//   return <Line key={key} icon={Event} text={` ${action}`} />;
// }

// function renderConsequence(log: ConsequenceEventData, key: string) {
//   const action = "consequence";
//   return <Line key={key} icon={Event} text={` ${action}`} />;
// }

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
  decisions,
  key,
  color,
}: {
  icon?: React.FC;
  text?: string;
  result?: string;
  resultInfos?: ConsequenceEventData;
  consequence?: string;
  decisions?: string;
  key: string;
  color?: string;
}) => {
  const [resultTooltip, setResultTooltip] = useState("");

  useEffect(() => {
    if (resultInfos && resultInfos.outcome === Outcome.Victorious) {
      setResultTooltip(`+ ${formatCash(resultInfos.cashEarnt)}`);
    } else if (resultInfos && resultInfos.outcome === Outcome.Paid) {
      if (resultInfos.cashLoss > 0) {
        setResultTooltip(`- ${formatCash(resultInfos.cashLoss)}`);
      } else {
        setResultTooltip(`- ${resultInfos.drugLoss} Drugs`);
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
          <Tooltip label={decisions} placement="right-end">
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
