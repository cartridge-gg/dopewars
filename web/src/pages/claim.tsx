import { Button } from "@/components/common";
import { Footer, Layout } from "@/components/layout";
import EthProvider from "@/components/wallet/EthProvider";
import { useDojoContext, useRouterContext } from "@/dojo/hooks";
import { Heading, Text, VStack } from "@chakra-ui/react";

import { DesktopOnly } from "@/components/wallet/DesktopOnly";
import ClaimComponentFree from "@/components/pages/claim/ClaimComponentFree";
import { useEffect, useMemo } from "react";

export default function Claim() {
  const { router } = useRouterContext();
  const {
    chains: { selectedChain },
  } = useDojoContext();

  useEffect(() => {
    if (["mainnet", "sepolia"].includes(selectedChain.chainConfig.network)) {
      router.replace("/");
    }
  }, [selectedChain]);

  return (
    <EthProvider>
      <Layout
        isSinglePanel
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
      >
        <DesktopOnly>
          <VStack boxSize="full" gap="10px">
            <Text textStyle="subheading" fontSize={["10px", "11px"]} letterSpacing="0.25em">
              Dope
            </Text>

            <Heading fontSize={["30px", "48px"]} fontWeight="400" textAlign="center">
              Migration
            </Heading>

            <ClaimComponentFree />
          </VStack>
        </DesktopOnly>
      </Layout>
    </EthProvider>
  );
}
