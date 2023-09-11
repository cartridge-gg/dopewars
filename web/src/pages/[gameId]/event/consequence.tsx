import CrtEffect from "@/components/CrtEffect";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import Layout from "@/components/Layout";
import { getOutcomeByType } from "@/dojo/helpers";
import { Outcome } from "@/dojo/types";
import { usePlayerStore } from "@/hooks/state";
import { Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Consequence() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const outcome = getOutcomeByType(Number(router.query.outcome as string));
  const { history } = usePlayerStore();

  const isInitial = history.includes(outcome.type);
  const narration = outcome.getNarration(isInitial);

  if (!router.isReady) {
    return <></>;
  }

  return (
    <>
      <Layout isSinglePanel={true}>
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
          width={500}
          height={500}
        />
        <VStack maxWidth="500px">
          <VStack textAlign="center">
            <Text>{narration}</Text>
            <Text color="yellow.400">
              {outcome.type == Outcome.Captured
                ? `* Lost half your cash and stash *`
                : ""}
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
      <CrtEffect />
    </>
  );
}
