import Image from "next/image";
import { Footer } from "@/components/Footer";
import Layout from "@/components/Layout";
import { getOutcomeInfo } from "@/dojo/helpers";
import { Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Button from "@/components/Button";

export default function Consequence() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const outcome = getOutcomeInfo(
    Number(router.query.status),
    Number(router.query.outcome),
  );

  const response = outcome.getResponse(true);

  if (!router.isReady) {
    return <></>;
  }

  return (
    <>
      <Layout isSinglePanel>
        <VStack>
          <Text
            textStyle="subheading"
            fontSize={["10px", "11px"]}
            letterSpacing="0.25em"
          >
            You...
          </Text>
          <Heading fontSize={["40px", "48px"]} fontWeight="400">
            {outcome.name}
          </Heading>
        </VStack>
        <Image
          alt={outcome.name}
          src={outcome.imageSrc}
          width={400}
          height={400}
        />
        <VStack maxWidth="500px">
          <VStack textAlign="center">
            <Text>{response}</Text>
            <Text color="yellow.400">
              {outcome.description && `* ${outcome.description} *`}
            </Text>
          </VStack>
          <Footer position={["absolute", "relative"]}>
            <Button
              w="full"
              onClick={() => {
                router.push(`/${gameId}/turn`);
              }}
            >
              Continue
            </Button>
          </Footer>
        </VStack>
      </Layout>
    </>
  );
}
