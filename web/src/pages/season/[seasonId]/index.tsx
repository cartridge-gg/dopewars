import { Button } from "@/components/common";
import { HustlerIcon, Hustlers } from "@/components/hustlers";
import {
  Alert,
  Cigarette,
  Clock,
  CopsIcon,
  GangIcon,
  Gem,
  Heart,
  PaperCashIcon,
  PaperIcon,
  Siren,
  User,
  Warning,
} from "@/components/icons";
import { Cocaine } from "@/components/icons/drugs";
import { Layout } from "@/components/layout";
import { HustlerAvatarIcon } from "@/components/pages/profile/HustlerAvatarIcon";
import {
  cashModeColor,
  cashModeColorKeys,
  drugsModeColor,
  drugsModeColorKeys,
  encountersModeColor,
  encountersModeColorKeys,
  encountersModeOddsColor,
  encountersModeOddsColorKeys,
  healthModeColor,
  healthModeColorKeys,
  turnsModeColor,
  turnsModeColorKeys,
  wantedModeColor,
  wantedModeColorKeys,
} from "@/dojo/helpers";
import {
  useDojoContext,
  useRegisteredGamesBySeason,
  useRouterContext,
  useSeasonByVersion,
  useSystems,
} from "@/dojo/hooks";
import {
  Dopewars_Game as Game,
  Dopewars_SeasonSettings as SeasonSettings,
  Dopewars_SortedList as SortedList,
} from "@/generated/graphql";

import { useToast } from "@/hooks/toast";
import colors from "@/theme/colors";
import { formatCashHeader } from "@/utils/ui";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Text,
  UnorderedList,
  VStack,
  HStack,
  Heading,
  Card,
  Divider,
  CardBody,
} from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { num, shortString } from "starknet";

interface Claimable {
  totalClaimable: number;
  totalClaimed: number;
  gameIds: Array<number>;
}

export default function SeasonIndex() {
  const { router, seasonId } = useRouterContext();

  const { registeredGames, isFetched, refetch: refetchRegisteredGames } = useRegisteredGamesBySeason(seasonId || 0);
  const { season, seasonSettings, sortedList } = useSeasonByVersion(seasonId || 0);

  if (!season || !seasonSettings) return null;

  return (
    <Layout
      customLeftPanel={<SeasonLeftPanel seasonId={seasonId} seasonSettings={seasonSettings} sortedList={sortedList} />}
      rigthPanelScrollable={false}
      footer={<Button onClick={() => router.push("/season")}>ALL SEASONS</Button>}
    >
      <VStack boxSize="full" gap={6}>
        {/*       
          <Card>
            <CardBody>
              <Text>SEASON Winner HERE </Text>
            </CardBody>
          </Card> */}

        <VStack w="full">
          <GamesTable games={registeredGames} />
        </VStack>
      </VStack>
    </Layout>
  );
}

const SeasonLeftPanel = ({
  seasonId,
  seasonSettings,
  sortedList,
}: {
  seasonId?: number;
  seasonSettings: SeasonSettings;
  sortedList?: SortedList;
}) => {
  return (
    <VStack flex={1} w="full" h="full" alignItems="center" marginBottom={["30px", "50px"]} gap={0}>
      <Text textStyle="subheading" textAlign="center" fontSize={["9px", "11px"]}>
        SEASON {seasonId}
      </Text>
      <Heading fontSize={["24px", "40px"]} fontWeight="400" mb={["0px", "20px"]} textAlign="center">
        {seasonSettings.cash_mode} {seasonSettings.health_mode} <br /> {seasonSettings.turns_mode}
      </Heading>

      <VStack>
        <SeasonSettingsTable settings={seasonSettings} />
      </VStack>
    </VStack>
  );
};

export const SeasonSettingsTable = ({ settings }: { settings?: SeasonSettings }) => {
  const { account } = useAccount();

  return (
    <Card>
      <CardBody>
        <TableContainer position="relative">
          <Table size="sm">
            <Tbody>
              <Tr>
                <Td w="30px">
                  <PaperCashIcon />
                </Td>
                <Td>Initial Cash</Td>

                <Td color={cashModeColor[settings?.cash_mode as cashModeColorKeys].toString()}>
                  {settings?.cash_mode}
                </Td>
              </Tr>
              <Tr>
                <Td w="30px">
                  <Heart />
                </Td>
                <Td>Initial Health</Td>

                <Td color={healthModeColor[settings?.health_mode as healthModeColorKeys].toString()}>
                  {settings?.health_mode}
                </Td>
              </Tr>
              <Tr>
                <Td w="30px">
                  <Clock />
                </Td>
                <Td>Max Turns</Td>

                <Td color={turnsModeColor[settings?.turns_mode as turnsModeColorKeys].toString()}>
                  {settings?.turns_mode}
                </Td>
              </Tr>
              <Tr>
                <Td w="30px">
                  <Cigarette />
                </Td>
                <Td>Drugs</Td>

                <Td color={drugsModeColor[settings?.drugs_mode as drugsModeColorKeys].toString()}>
                  {settings?.drugs_mode}
                </Td>
              </Tr>
              <Tr>
                <Td w="30px">
                  <GangIcon />
                </Td>
                <Td>Encounters</Td>

                <Td color={encountersModeColor[settings?.encounters_mode as encountersModeColorKeys].toString()}>
                  {settings?.encounters_mode}
                </Td>
              </Tr>
              <Tr>
                <Td w="30px">
                  <CopsIcon />
                </Td>
                <Td>Encounters Odds</Td>
                <Td
                  color={encountersModeOddsColor[
                    settings?.encounters_odds_mode as encountersModeOddsColorKeys
                  ].toString()}
                >
                  {settings?.encounters_odds_mode}
                </Td>
              </Tr>
              <Tr>
                <Td w="30px" borderBottomColor="transparent">
                  <Siren />
                </Td>
                <Td borderBottomColor="transparent">Wanted</Td>
                <Td
                  color={wantedModeColor[settings?.wanted_mode as wantedModeColorKeys].toString()}
                  borderBottomColor="transparent"
                >
                  {settings?.wanted_mode}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};

export const GamesTable = ({ games }: { games: Game[] }) => {
  const { account } = useAccount();

  return (
    <TableContainer position="relative" w="full" maxH="calc(100dvh - 300px)" overflow="hidden" overflowY="auto">
      <Table size="sm">
        <Thead position="sticky" top="0" bg="neon.900">
          <Tr>
            {/* <Th isNumeric>gameId</Th> */}
            <Th isNumeric>Rank</Th>
            <Th>Hustler</Th>
            <Th isNumeric>Cash</Th>
            <Th isNumeric>Payout</Th>
            <Th>Claimed</Th>
          </Tr>
        </Thead>
        <Tbody>
          {games.map((game, idx) => {
            if (!game) return;

            const isPlayer = game.player_id === account?.address;
            const color = isPlayer ? colors.yellow["400"].toString() : colors.neon["400"].toString();
            return (
              <Tr color={color} key={idx}>
                {/* <Td isNumeric>{game.game_id}</Td> */}
                <Td isNumeric>{game.position > 0 ? game.position : idx + 1}</Td>
                <Td>
                  <HStack>
                    <HustlerAvatarIcon
                      gameId={game.game_id}
                      hustlerId={game.hustler_id}
                      // @ts-ignore
                      tokenIdType={game?.token_id_type}
                      // @ts-ignore
                      tokenId={game?.token_id}
                    />
                    <Text>{game.player_name as string}</Text>
                  </HStack>
                </Td>
                <Td isNumeric>{formatCashHeader(game.final_score)}</Td>
                <Td isNumeric>{game.claimable > 0 ? game.claimable : "-"}</Td>
                <Td>{game.claimed && <Cigarette />}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
