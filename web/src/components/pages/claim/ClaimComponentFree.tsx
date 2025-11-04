import { Button } from "@/components/common";
import { tryBetterErrorMsg, useDojoContext, useRouterContext, waitForTransaction } from "@/dojo/hooks";
import { checkTxReceipt, sleep } from "@/dope/helpers";
import { useToast } from "@/hooks/toast";
import {
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useAccount, useConnect } from "@starknet-react/core";
import { useState } from "react";

import lootClaims from "./snapshot-dopeLoot-22728943-merkle_drop-mainnet.json";
import ogClaims from "./snapshot-dopeHustlers-22728943-merkle_drop-mainnet.json";

export default function ClaimComponentFree() {
  const {
    contracts: { getDojoContract },
  } = useDojoContext();
  const dopeLootClaimContract = getDojoContract("dope-DopeLootClaim");

  const { account } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function onClaim(entry: any, entrypoint: string) {
    if (!account) return;

    setIsLoading(true);

    try {
      // @ts-ignore
      const execution = await account?.execute([
        {
          contractAddress: dopeLootClaimContract.address,
          entrypoint,
          calldata: [
            // @ts-ignore
            account.address,
            // @ts-ignore
            entry[2].length,
            // @ts-ignore
            ...entry[2],
          ],
        },
      ]);

      const txReceipt = await waitForTransaction(account, execution.transaction_hash);

      checkTxReceipt(txReceipt);

      setTimeout(() => {
        setIsLoading(false);
      }, 1_000);

      return toast({
        message: `You claimed!!`,
      });
    } catch (e: any) {
      setIsLoading(false);

      return toast({
        message: tryBetterErrorMsg(e?.message),
        isError: true,
      });
    }
  }

  return (
    <VStack w="full" mt={6}>
      <Tabs variant="unstyled" w="full">
        <TabList pb={6}>
          <Tab>LOOT</Tab>
          <Tab>OGs</Tab>
        </TabList>

        <TabPanels mt={0} maxH={"80vh"} overflowY="scroll">
          <TabPanel p={0}>
            <TableContainer>
              <Table gap={6}>
                <Tbody>
                  {lootClaims.map((i) => {
                    return (
                      <Tr maxW="1000px" key={`${i[0]}-${i[1]}`}>
                        <Td>
                          <Button onClick={() => onClaim(i, "claim_loot_from_forwarder")}>CLAIM LOOT</Button>
                        </Td>
                        <Td>{i[0]}</Td>
                        <Td>{i[1]}</Td>
                        <Td>
                          <Text maxWidth="500px" whiteSpace="break-spaces">
                            {(i[2] as string[]).join(", ")}
                          </Text>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel p={0}>
            <TableContainer>
              <Table gap={6}>
                <Tbody>
                  {ogClaims.map((i) => {
                    return (
                      <Tr maxW="1000px" key={`${i[0]}-${i[1]}`}>
                        <Td>
                          <Button onClick={() => onClaim(i, "claim_og_from_forwarder")}>CLAIM OG</Button>
                        </Td>
                        <Td>{i[0]}</Td>
                        <Td>{i[1]}</Td>
                        <Td>
                          <Text maxWidth="500px" whiteSpace="break-spaces">
                            {(i[2] as string[]).join(", ")}
                          </Text>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}
