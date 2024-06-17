import { Button } from "@/components/common";

import { PaperIcon } from "@/components/icons";
import { Layout } from "@/components/layout";
import { SeasonInfos, useRouterContext, useSeasons } from "@/dojo/hooks";

import { formatCash } from "@/utils/ui";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, VStack, Text } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";

export default function SeasonIndex() {
  const { router, seasonId } = useRouterContext();
  const { account } = useAccount();

  const { seasons, refetch } = useSeasons();

  return (
    <Layout
      leftPanelProps={{
        prefixTitle: "Dope Wars",
        title: `Seasons`,
        imageSrc: "/images/landing/main.png",
      }}
      rigthPanelScrollable={false}
      // rigthPanelMaxH="calc(100dvh - 230px)"
      footer={<Button onClick={() => router.push("/")}>HOME</Button>}
    >
      <VStack boxSize="full" gap={6}>
        <VStack w="full">
          <SeasonsTable seasons={seasons} />
        </VStack>
      </VStack>
    </Layout>
  );
}

export const SeasonsTable = ({ seasons }: { seasons: SeasonInfos[] }) => {
  const { account } = useAccount();
  const { router } = useRouterContext();
  return (
    <TableContainer position="relative" w="full" maxH="calc(100dvh - 300px)" overflow="hidden" overflowY="auto">
      <Table size="sm">
        <Thead position="sticky" top="0" bg="neon.900">
          <Tr>
            <Th></Th>
            <Th isNumeric>Entrants</Th>
            <Th isNumeric>Paid</Th>
            <Th isNumeric>Paper Jackpot</Th>
          </Tr>
        </Thead>
        <Tbody>
          {seasons.map((season, idx) => {
            if (!season) return;

            const seasonName = season.seasonSettings
              ? `${season.seasonSettings.cash_mode} ${season.seasonSettings.health_mode} ${season.seasonSettings.turns_mode}`
              : "";

            return (
              <Tr key={idx} cursor="pointer" onClick={() => router.push(`/season/${season.season.version}`)}>
                <Td>
                  <VStack alignItems="flex-start">
                    <Text color="neon.500" fontSize="11px" lineHeight={1}>
                      SEASON {season.season.version}
                    </Text>

                    <Text>{"\""}{seasonName}{"\""}</Text>
                  </VStack>
                </Td>

                <Td isNumeric>{season.sortedList?.size}</Td>
                <Td isNumeric>{season.sortedList?.processed ? season.sortedList?.process_size : "?"}</Td>
                <Td isNumeric>
                  {formatCash(season.season.paper_balance).replace("$", "")} <PaperIcon />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
