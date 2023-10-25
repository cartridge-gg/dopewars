import Image from "next/image";
import { Footer } from "@/components/Footer";
import Layout from "@/components/Layout";
import { getLocationById, getOutcomeInfo } from "@/dojo/helpers";
import { Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { useMemo } from "react";
import { OutcomeInfo, PlayerStatus } from "@/dojo/types";
import { Outcome } from "@/dojo/types";
import { playSound, Sounds } from "@/hooks/sound";
import { useEffect, useState} from "react";

export default function Consequence() {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const { account, playerEntityStore } = useDojoContext();
  const { playerEntity} = playerEntityStore;

  const [outcome, setOutcome] = useState<OutcomeInfo|undefined>(undefined);
  const [isDead, setIsDead] = useState<boolean>(false);
  
  const response = useMemo(() => outcome?.getResponse(true), [outcome]);

  useEffect(() => {
    const outcomeInfos = getOutcomeInfo(
      router.query.status as PlayerStatus,
      Number(router.query.outcome),
    )
   setOutcome(outcomeInfos);
  }, [router.query.status, router.query.outcome]);

  useEffect(() => {
    if (outcome && outcome.type === Outcome.Died) {
      setIsDead(true)
      playSound(Sounds.GameOver);
    }
  }, [outcome]);

  if (!router.isReady || !playerEntity || !outcome) {
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
            {outcome.title}
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
        <VStack width="full" maxW="500px" h="100%" justifyContent="space-between">
          <VStack textAlign="center">
            <Text>{response}</Text>
            <Text color="yellow.400">
              {outcome.description && `* ${outcome.description} *`}
            </Text>
          </VStack>
          <Footer position={["relative", "relative"]}>
            {!isDead ? (
              <Button
                w="full"
                onClick={() => {
                  console.log(outcome);
                  if (outcome.type == Outcome.Captured) {
                    return router.push(
                      `/${gameId}/event/decision`,
                    );
                  }
                  
                  if ( playerEntity.status === PlayerStatus.AtPawnshop){
                    router.push(`/${gameId}/pawnshop`);
                  }

                  if ( playerEntity.status === PlayerStatus.Normal){
                    router.push(`/${gameId}/${getLocationById(playerEntity.locationId)?.slug}`);
                  }
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
