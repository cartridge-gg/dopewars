import Image from "next/image";
import { Footer } from "@/components/Footer";
import Layout from "@/components/Layout";
import { getOutcomeInfo } from "@/dojo/helpers";
import { Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import { PlayerStatus } from "@/dojo/types";
import { Outcome } from "@/dojo/types";
import { playSound, Sounds } from "@/hooks/sound";
import { useEffect } from "react";

export default function Consequence() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const outcome = getOutcomeInfo(
    Number(router.query.status),
    Number(router.query.outcome),
  );
  const isDead = outcome.type == Outcome.Died;
  const response = outcome.getResponse(true);

  useEffect(() => {
    if ( outcome.type == Outcome.Died) {
      playSound(Sounds.GameOver);
    }
   
  }, [outcome]);
  

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
            {!isDead ? (
              <Button
                w="full"
                onClick={() => {
                  router.push(`/${gameId}/turn`);
                }}
              >
                Continue
              </Button>
            ) : (
              <Button
                w="full"
                onClick={() => {
                  router.push(`/${gameId}/end`);
                }}
              >
                Game Over
              </Button>
            )}
          </Footer>
        </VStack>
      </Layout>
    </>
  );
}
