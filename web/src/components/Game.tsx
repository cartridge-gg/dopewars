import { Button, Flex, Text } from "@chakra-ui/react";
import Container from "./Container";
import Calendar from "./icons/Calendar";
import Wallet from "./icons/Wallet";
import ProductsTable from "./Products";

interface GameProps {
  city: string;
  currentDay: number;
  totalDays: number;
  cashBalance: number;
}

const Game = ({ city, currentDay, totalDays, cashBalance }: GameProps) => {
  return (
    <Container
      leftHeading={<Text>{city}</Text>}
      rightHeading={
        <Flex align="center" gap="10px">
          <Flex align="center" gap="8px">
            <Calendar /> {currentDay}/{totalDays}
          </Flex>{" "}
          <Flex align="center" gap="8px">
            <Wallet /> ${cashBalance}
          </Flex>
        </Flex>
      }
      footer={
        <Button
          variant="primary"
          w="full"
          onClick={() => console.log("Travel button clicked")}
        >
          Travel
        </Button>
      }
    >
      <ProductsTable products={[
        {
            cost: 100,
            id: 1,
            name: "Apple",
            quantity: 10,
        },
        {
            cost: 100,
            id: 2,
            name: "Meow",
            quantity: 10,
        },
      ]} />
    </Container>
  );
};

export default Game;
