import Image from "next/image";
import { Footer } from "@/components/Footer";
import Layout from "@/components/Layout";
import { getOutcomeInfo } from "@/dojo/helpers";
import { Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import { Outcome } from "@/dojo/types";
import { usePlayerEntity } from "@/dojo/entities/usePlayerEntity";
import { useDojo } from "@/dojo";
import { useMemo } from "react";

export default function Consequence() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const outcome = getOutcomeInfo(
    Number(router.query.status),
    Number(router.query.outcome),
  );

  const { account } = useDojo();
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: account?.address,
  });

  const response = useMemo(() => outcome.getResponse(true), [outcome]);

  if (!router.isReady || !playerEntity) {
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
                console.log(outcome);
                if (outcome.type == Outcome.Captured) {
                  return router.push(
                    `/${gameId}/event/decision?nextId=${playerEntity.locationId}`,
                  );
                }

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
