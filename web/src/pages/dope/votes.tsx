import { Footer, Layout } from "@/components/layout";
import { useDojoContext, useRouterContext } from "@/dojo/hooks";
import { Button, HStack, Box, Text, VStack, Heading, Input, Link } from "@chakra-ui/react";
import { getContractByName } from "@dojoengine/core";
import { useDojoTokens } from "@/dope/hooks";
import { useAccount } from "@starknet-react/core";
import { useMemo, useState } from "react";
import { useVotes } from "@/dope/hooks/useVotes";
import { PaperIcon } from "@/components/icons";
import { ChildrenOrConnect } from "@/components/wallet";

export default function Dope() {
  const { router } = useRouterContext();
  const { account } = useAccount();

  const {
    chains: { selectedChain },
    clients: { toriiClient },
  } = useDojoContext();

  const dopeLootAddress = useMemo(() => {
    return getContractByName(selectedChain.manifest, "dope", "DopeLoot")!.address;
  }, [selectedChain]);

  const addresses = useMemo(() => {
    return [dopeLootAddress];
  }, [selectedChain.manifest]);

  const { tokens, tokensBalances, accountTokens, refetch, isLoading } = useDojoTokens(
    toriiClient,
    addresses,
    account?.address,
  );

  const { votingPower, delegateTo, delegates } = useVotes(dopeLootAddress, account);
  const [manualAddress, setManualAddress] = useState("");

  return (
    <Layout
      isSinglePanel
      footer={
        <Footer>
          <Button
            w={["80%", "auto"]}
            px={["auto", "20px"]}
            onClick={() => {
              router.back();
            }}
          >
            Back
          </Button>
        </Footer>
      }
    >
      <ChildrenOrConnect>
        <VStack w="full" gap={6} flexWrap="wrap" alignItems="center" justifyContent="center">
          <VStack>
            <Text textStyle="subheading" fontSize={["11px", "11px"]} my={["10px", "0"]} letterSpacing="0.25em">
              DopeLoot
            </Text>
            <Heading fontSize={["30px", "48px"]} fontWeight="400" textAlign="center">
              Voting Power
            </Heading>
          </VStack>
          <VStack mt={6}>
            <Text>Total DopeLoot: {tokensBalances?.length}</Text>
            <Text>Voting power: {votingPower.toString()}</Text>
            <Text>Delegated to: </Text>
            <Text>
              {delegates} {BigInt(delegates) === BigInt(account?.address || 0) && "(you)"}
            </Text>
          </VStack>
          <Button onClick={() => delegateTo(account?.address || "")}>Self Delegate</Button>

          <VStack mt={6}>
            <Text>Or delegate your voting power</Text>
            <Text>to another address</Text>
          </VStack>
          <Input
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            maxW="420px"
            fontSize="10px"
          />
          <Button onClick={() => delegateTo(manualAddress)}>Delegate</Button>

          {/* TODO: use right link */}
          <Link
            href={`https://snapshot.box/#/sn:0x009fedaf0d7a480d21a27683b0965c0f8ded35b3f1cac39827a25a06a8a682a4`}
            target="_blank"
            display="flex"
            flexDirection="row"
            alignItems="center"
            mt={6}
          >
            <PaperIcon mr={2} /> <Text>GOUVERNANCE</Text>
          </Link>
        </VStack>
      </ChildrenOrConnect>

      <Box minH="80px"></Box>
    </Layout>
  );
}
