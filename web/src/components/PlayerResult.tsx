import React from "react";
import { Box, Button, Flex, Spacer, Text } from "@chakra-ui/react";
import Container from "./Container";
import Players from "./Players";

interface PlayerResult {
  address: string;
  rank: number;
  money: number;
}

interface ResultsProps {
  playerResults: PlayerResult[];
  onLeaveMatch?: () => void;
}

const Results: React.FC<ResultsProps> = ({ playerResults, onLeaveMatch }) => {
  return (
    <Container
      leftHeading={<Text>Results</Text>}
      footer={
        <Flex w="full" direction="column">
          <Button w="full" onClick={onLeaveMatch}>
            Leave Match
          </Button>
        </Flex>
      }
    >
      <Box borderRadius={4} border="2px solid black">
        {playerResults.map((result, index) => (
          <Flex
            fontSize="14px"
            key={index}
            w="full"
            p="10px 12px"
            gap="8px"
            bg="#141011"
          >
            <Text color="white" opacity="0.5">
              {result.rank}
            </Text>
            <Text color="white">
              {result.address}
            </Text>
            <Spacer />
            <Text color="white" opacity="0.5">
              ${result.money}
            </Text>
          </Flex>
        ))}
      </Box>
    </Container>
  );
};

export default Results;
