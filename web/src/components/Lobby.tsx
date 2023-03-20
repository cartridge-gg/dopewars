import React, { useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import Container from "./Container";
import Players from "./Players";
import Timer from "./Timer";
import Pill from "./Pill";

interface LobbyProps {
  addresses: string[];
  startInSeconds: number;
  onLeave?: () => void;
  onContinue?: () => void;
}

const Lobby: React.FC<LobbyProps> = ({
  addresses,
  startInSeconds,
  onLeave,
  onContinue,
}) => {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <Container
      leftHeading={<Text>
        Lobby <Pill>{addresses.length}</Pill>
      </Text>}
      rightHeading={
        <Timer
          startInSeconds={startInSeconds}
          onEnd={() => setGameStarted(true)}
        />
      }
      footer={
        <Flex w="full" direction="column">
          {gameStarted ? (
            <Button w="full" onClick={onContinue}>
              Continue
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={onLeave}>
                Leave
              </Button>
              <Button variant="secondary" isDisabled>
                Waiting for game to start
              </Button>
            </>
          )}
        </Flex>
      }
    >
      <Players addresses={addresses} />
    </Container>
  );
};

export default Lobby;
