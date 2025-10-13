import { Button } from "@/components/common";
import { tryBetterErrorMsg, useDojoContext, useRouterContext } from "@/dojo/hooks";
import { checkTxReceipt, sleep } from "@/dope/helpers";
import { useToast } from "@/hooks/toast";
import { Table, TableContainer, Tbody, Td, Text, Tr, VStack } from "@chakra-ui/react";
import { useAccount, useConnect } from "@starknet-react/core";
import { useState } from "react";

import claims from "./snapshot-dopeLoot-22728943-merkle_drop.json";

export default function ClaimComponentFree() {
  const {
    contracts: { getDojoContract },
  } = useDojoContext();
  const dopeLootClaimContract = getDojoContract("dope-DopeLootClaim");

  const { account } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function onClaim(entry: any) {
    if (!account) return;

    setIsLoading(true);

    try {
      // @ts-ignore
      const execution = await account?.execute([
        {
          contractAddress: dopeLootClaimContract.address,
          entrypoint: "claim_from_forwarder",
          calldata: [
            // @ts-ignore
            account.address,
            // @ts-ignore
            ...entry[2],
          ],
        },
      ]);

      let txReceipt = await account.waitForTransaction(execution.transaction_hash, {
        retryInterval: 200,
        successStates: ["PRE_CONFIRMED", "ACCEPTED_ON_L2", "ACCEPTED_ON_L1"],
      });

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
      <TableContainer>
        <Table gap={6}>
          <Tbody>
            {claims.map((i) => {
              return (
                <Tr maxW="1000px" key={`${i[0]}-${i[1]}`}>
                  <Td>
                    <Button onClick={() => onClaim(i)}>CLAIM</Button>
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
    </VStack>
  );
}
