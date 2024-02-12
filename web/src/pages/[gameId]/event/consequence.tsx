import Button from "@/components/Button";
import { Footer } from "@/components/Footer";
import Layout from "@/components/Layout";
import { getOutcomeInfo } from "@/dojo/helpers";
import { useConfigStore, useDojoContext, useRouterContext } from "@/dojo/hooks";
import { Outcome, OutcomeInfo, PlayerStatus } from "@/dojo/types";
import { Sounds, playSound } from "@/hooks/sound";
import { formatCash } from "@/utils/ui";
import { Box, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

export default function Consequence() {
  const { router, gameId } = useRouterContext();
  const { account } = useDojoContext();
  // const { playerEntity } = usePlayerStore();
  const configStore = useConfigStore();

  const [outcome, setOutcome] = useState<OutcomeInfo | undefined>(undefined);
  const [isDead, setIsDead] = useState<boolean>(false);
  const [payout, setPayout] = useState<number | undefined>(undefined);

  const response = useMemo(() => outcome?.getResponse(true), [outcome]);

  useEffect(() => {
    const outcomeInfos = getOutcomeInfo(router.query.status as PlayerStatus, Number(router.query.outcome));
    setOutcome(outcomeInfos);
    if (router.query.payout) {
      setPayout(Number(router.query.payout));
    }
  }, [router.query.status, router.query.outcome, router.query.payout]);

  useEffect(() => {
    if (outcome && outcome.type === Outcome.Died) {
      setIsDead(true);
      playSound(Sounds.GameOver);
    }
  }, [outcome]);

  if (!router.isReady || !playerEntity || !outcome) {
    return <></>;
  }

  return (
    <>
      <Layout
        isSinglePanel
        footer={
          <Footer>
            {!isDead ? (
              <Button
                w={["full", "auto"]}
                px={["auto", "20px"]}
                onClick={() => {
                  // console.log(outcome);
                  if (outcome.type == Outcome.Captured) {
                    return router.push(`/${gameId}/event/decision`);
                  }

                  // if (playerEntity.status === PlayerStatus.AtPawnshop) {
                  //   router.push(`/${gameId}/pawnshop`);
                  // }

                  // if (playerEntity.status === PlayerStatus.Normal) {
                  //   router.push(
                  //     `/${gameId}/${configStore.getLocation(playerEntity.locationId)?.location.toLowerCase()}`,
                  //   );
                  // }
                }}
              >
                Continue
              </Button>
            ) : (
              <Button
                w="full"
                px={["auto", "20px"]}
                onClick={() => {
                  router.push(`/${gameId}/end`);
                }}
              >
                Game Over
              </Button>
            )}
          </Footer>
        }
      >
        <VStack h="full">
          <VStack>
            <Text textStyle="subheading" fontSize={["10px", "11px"]} letterSpacing="0.25em">
              {outcome.title}
            </Text>
            <Heading fontSize={["36px", "48px"]} fontWeight="400" textAlign="center">
              {outcome.name}
            </Heading>
          </VStack>
          <Image alt={outcome.name} src={outcome.imageSrc} maxH="50vh" height="500px" />
          <VStack width="full" maxW="500px" h="100%" justifyContent="space-between">
            <VStack textAlign="center">
              <Text>{response}</Text>
              <Text color="yellow.400">{outcome.description && `* ${outcome.description} *`}</Text>
              <Text color="yellow.400">{payout && `You confiscated ${formatCash(payout)} `}</Text>
            </VStack>
          </VStack>
          <Box display="block" minH="70px" h="70px" w="full" />
        </VStack>
      </Layout>
    </>
  );
}
