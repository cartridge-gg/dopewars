import Layout from "@/components/Layout";
import { Footer } from "@/components/Footer";

import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import {
  getActionName,
  getDrugById,
  getDrugByType,
  getLocationById,
  getOutcomeInfo,
  getOutcomeName,
  getShopItem,
  getShopItemByType,
} from "@/dojo/helpers";
import { useSystems } from "@/dojo/hooks/useSystems";

import { HStack, Heading, ListItem, Text, UnorderedList, VStack, Box, Tooltip, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import { useEffect, useRef, useState } from "react";
import { IsMobile, formatCash } from "@/utils/ui";
import { Bag, DollarBag, Event } from "@/components/icons";
import { usePlayerLogs } from "@/dojo/queries/usePlayerLogs";
import { GameCreatedData, WorldEvents } from "@/dojo/generated/contractEvents";
import {
  AdverseEventData,
  AtPawnshopEventData,
  BoughtEventData,
  BoughtItemEventData,
  ConsequenceEventData,
  CreateEventData,
  DecisionEventData,
  GameOverEventData,
  JoinedEventData,
  ParseEventResult,
  SoldEventData,
  TraveledEventData,
} from "@/dojo/events";
import { Action, Outcome, PlayerStatus } from "@/dojo/types";
import { SCALING_FACTOR } from "@/dojo/constants";
import { Profile } from "@/components/ProfileButton";

type LogByDay = {
  day: number;
  location: string;
  logs: ParseEventResult[];
};

export default function Logs() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const playerId = router.query.playerId as string;

  const { account, playerEntityStore } = useDojoContext();
  const { playerEntity } = playerEntityStore;

  const { playerLogs, isFetched } = usePlayerLogs({ gameId, playerId: playerId || account?.address });

  const [logs, setLogs] = useState<LogByDay[]>([]);
  const listRef = useRef(null);

  const isMobile = IsMobile();

  useEffect(() => {
    if (!playerLogs) return;

    const logsByDay = [];

    let dayLogs: LogByDay = {
      day: 0,
      location: "Hood",
      logs: [],
    };

    for (let log of playerLogs?.parsedLogs) {
      //console.log(`${log.log.node?.id} - ${log.parsed.eventName}`)
      if (log.parsed.eventType === WorldEvents.Traveled) {
        // create new day
        logsByDay.push(dayLogs);

        const travelEvent = log.parsed as TraveledEventData;

        dayLogs = {
          day: travelEvent.turn,
          location: travelEvent.toLocation,
          logs: [],
        };
      } else {
        // push other events in dayLogs
        dayLogs.logs.push(log.parsed);
      }
    }
    logsByDay.push(dayLogs);

    setLogs(
      logsByDay,
      // .sort((a, b) => a.day - b.day)
    );
  }, [playerLogs]);

  useEffect(() => {
    if (!listRef.current) return;
    const lastEl = listRef.current["lastElementChild"];
    // @ts-ignore
    lastEl && lastEl.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  if (!isFetched || !logs) {
    return <></>;
  }

  return (
    <Layout
      leftPanelProps={{
        prefixTitle: "",
        title: `Hustler Logs`,
        imageSrc: "/images/will-smith-with-attitude.png",
      }}
      CustomLeftPanel={!playerId ? Profile : undefined}
      footer={
        <Footer>
          <Button
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
      rigthPanelMaxH={isMobile ? "calc(100vh - 400px)" : "auto"}
    >
      <VStack w="full" ref={listRef}>
        {logs && logs.map((log) => /*log.logs.length > 0 &&*/ renderDay(log))}
      </VStack>
    </Layout>
  );
}

function renderDay(log: LogByDay) {
  return (
    <>
      {log.location !== "Hood" && (
        <HStack w="full" mt={["20px", "30px"]}>
          {getLocationById(log.location)?.icon({ color: "neon.500" })}
          <Text fontSize={["10px", "12px"]} w="full" textStyle="subheading" color="neon.500">
            DAY {log.day + 1} - {log.location}
          </Text>
        </HStack>
      )}

      <UnorderedList listStyleType="none" w="full">
        {log.logs.map((i, idx) => {
          const key = `key-${log.day}-${idx}`;

          switch (i.eventType) {
            case WorldEvents.BoughtItem:
              return renderBoughtItem(i as BoughtItemEventData, key);
              break;

            case WorldEvents.Bought:
              return renderBought(i as BoughtEventData, key);
              break;

            case WorldEvents.Sold:
              return renderSold(i as SoldEventData, key);
              break;

            case WorldEvents.AdverseEvent:
              return renderAdverse(i as AdverseEventData, log, key);
              break;

            case WorldEvents.PlayerJoined:
              return renderPlayerJoined(i as JoinedEventData, key);
              break;

            case WorldEvents.GameOver:
              return renderGameOver(i as GameOverEventData, key);
              break;

            case WorldEvents.AtPawnshop:
              if (log.day > 0) {
                // return renderAtPawnshop(i as AtPawnshopEventData, key);
              }
              break;

            default:
              break;
          }
        })}
      </UnorderedList>
    </>
  );
}

function renderPlayerJoined(log: JoinedEventData, key: string) {
  return (
    <ListItem w="full" pt="0">
      <Text
        w="full"
        fontStyle="headings"
        fontSize={["16px", "20px"]}
        textTransform="uppercase"
        my="20px"
        textAlign="center"
      >
        {log.playerName}&apos;s life
      </Text>
    </ListItem>
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

function renderAtPawnshop(log: GameOverEventData, key: string) {
  return <Line key={key} icon={DollarBag} text={`At Pawnshop`} />;
}

function renderBoughtItem(log: BoughtItemEventData, key: string) {
  const item = getShopItemByType(Number(log.itemId), Number(log.level));
  return (
    <Line
      key={key}
      icon={item.icon}
      text={`Bought ${item.name}`}
      total={`- ${formatCash(log.cost)}`}
      color="yellow.400"
      iconColor="yellow.400"
    />
  );
}

function renderBought(log: BoughtEventData, key: string) {
  const drug = getDrugByType(Number(log.drugId));
  return (
    <Line
      key={key}
      icon={drug!.icon}
      text={`Bought ${drug!.name}`}
      quantity={log.quantity}
      total={`- ${formatCash(log.cost / SCALING_FACTOR)}`}
    />
  );
}

function renderSold(log: SoldEventData, key: string) {
  const drug = getDrugByType(Number(log.drugId));
  return (
    <Line
      key={key}
      icon={drug!.icon}
      text={`Sold ${drug!.name}`}
      quantity={log.quantity}
      total={`+ ${formatCash(log.payout / SCALING_FACTOR)}`}
    />
  );
}

function renderAdverse(log: AdverseEventData, dayLog: LogByDay, key: string) {
  const status = Number(log.playerStatus);
  const encounter = status === 1 ? "Gang" : "Cops";

  const decisions = dayLog.logs
    .filter((i) => i.eventType === WorldEvents.Decision)
    .map((i) => i as DecisionEventData)
    .map((i) => getActionName(i.action))
    .join(", ");

  const consequences = dayLog.logs
    .filter((i) => i.eventType === WorldEvents.Consequence)
    .map((i) => i as ConsequenceEventData);

  const lastConsequence = consequences.length > 0 ? consequences[consequences.length - 1] : undefined;
  const lastConsequenceName = lastConsequence ? getOutcomeName(lastConsequence.outcome) : "";

  const totalHpLoss =
    dayLog.logs.length > 0
      ? dayLog.logs
          .filter((i) => i.eventType === WorldEvents.Consequence)
          .map((i) => i as ConsequenceEventData)
          .map((i) => i.healthLoss)
          .reduce((prev, curr) => {
            return prev + curr;
          }, log.healthLoss)
      : log.healthLoss;

  return (
    <FightLine
      key={key}
      icon={Event}
      text={`Meet ${encounter}`}
      result={lastConsequenceName}
      resultInfos={lastConsequence}
      consequence={`-${totalHpLoss} HP`}
      decisions={decisions}
      color="yellow.400"
    />
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
