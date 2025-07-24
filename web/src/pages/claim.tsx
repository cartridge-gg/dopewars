import { Button } from "@/components/common";
import { Footer, Layout } from "@/components/layout";
import EthProvider from "@/components/wallet/EthProvider";
import { useRouterContext } from "@/dojo/hooks";
import { Heading, Text, VStack } from "@chakra-ui/react";

import ClaimComponent from "@/components/pages/claim/ClaimComponent";
import { DesktopOnly } from "@/components/wallet/DesktopOnly";

export default function Claim() {
  const { router } = useRouterContext();
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

            <ClaimComponent />
          </VStack>
        </DesktopOnly>
      </Layout>
    </EthProvider>
  );
}
