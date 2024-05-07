import { DollarBag, Roll } from "@/components/icons";
import { Header } from "@/components/layout";

import { Container, Flex, HStack, Heading, Text, VStack } from "@chakra-ui/react";

import { Button } from "@/components/common";

import { useGameStore, useRegisteredGamesBySeason, useRouterContext, useSystems } from "@/dojo/hooks";

import { formatCash } from "@/utils/ui";
import { useAccount } from "@starknet-react/core";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Game } from "@/generated/graphql";

const Register = observer(() => {
  const { router, gameId } = useRouterContext();
  const { game } = useGameStore();

  const { isPending, registerScore } = useSystems();

  const { registeredGames, isFetched } = useRegisteredGamesBySeason(game?.gameInfos.season_version || 1);

  const [position, setPosition] = useState(0);
  const [prev, setPrev] = useState<Game | undefined>(undefined);

  useEffect(() => {
    if (!game) return;
    const filtered = registeredGames.filter((i) => i.final_score >= game?.player.cash);
    const sorted = filtered.sort((a, b) => b.final_score - a.final_score);

    const prev = sorted.length > 0 ? sorted[sorted.length - 1] : undefined;

    setPrev(prev);
    setPosition(sorted.length + 1);
  }, [registeredGames, game]);

  const onRegister = async () => {
    try {
      // TODO: should retrieve prev just before submitting tx

      const prevGameId = prev ? prev.game_id : 0;
      const prevPlayerId = prev ? prev.player_id : 0;

      const res = await registerScore(gameId!, prevGameId, prevPlayerId);
    } catch (e: any) {
      console.log(e);
    }
  };

  if (!game) return null;

  return (
    <>
      <Flex direction="column">
        <Header />
        <Container overflowY="auto">
          <VStack flex={["0", "1"]} my="auto">
            {/* {isDead && (
              <Text fontSize="11px" fontFamily="broken-console" padding="0.5rem 0.5rem 0.25rem">
                You died ...
              </Text>
            )} */}

            <Heading fontSize={["30px", "48px"]} fontWeight="normal">
              Register you score
            </Heading>

            <Text>{formatCash(game?.player.cash)}</Text>
            <Text>Position : {position}</Text>

            <Button isLoading={isPending} onClick={() => onRegister()}>
              Register
            </Button>
          </VStack>
        </Container>
      </Flex>
    </>
  );
});

export default Register;
