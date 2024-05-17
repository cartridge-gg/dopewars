import { Button } from "@/components/common";

import { PaperIcon } from "@/components/icons";
import { Layout } from "@/components/layout";
import { SeasonInfos, useRouterContext, useSeasons } from "@/dojo/hooks";

import { formatCash } from "@/utils/ui";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, VStack } from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";

export default function SeasonIndex() {
  const { router, seasonId } = useRouterContext();
  const { account } = useAccount();

  const { seasons, refetch } = useSeasons();

  return (
    <Layout
      leftPanelProps={{
        prefixTitle: "RYO",
        title: `Seasons`,
        imageSrc: "/images/sunset.png",
      }}
      rigthPanelScrollable={false}
      // rigthPanelMaxH="calc(100vh - 230px)"
      footer={<Button onClick={() => router.push("/")}>BACK</Button>}
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
    <TableContainer position="relative" w="full" maxH="calc(100vh - 300px)" overflow="hidden" overflowY="auto">
      <Table size="md">
        <Thead position="sticky" top="0" bg="neon.900">
          <Tr>
            {/* <Th isNumeric>gameId</Th> */}
            <Th isNumeric></Th>
            <Th isNumeric>Total Entrants</Th>
            <Th isNumeric>Total Paid</Th>
            <Th isNumeric>Total Paper</Th>
          </Tr>
        </Thead>
        <Tbody>
          {seasons.map((season, idx) => {
            if (!season) return;

            return (
              <Tr key={idx} cursor="pointer" onClick={() => router.push(`/season/${season.season.version}`)}>
                <Td isNumeric>SEASON {season.season.version}</Td>
                <Td isNumeric>{season.sortedList?.size}</Td>
                <Td isNumeric>{season.sortedList?.process_size}</Td>
                <Td isNumeric>
                  {" "}
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
