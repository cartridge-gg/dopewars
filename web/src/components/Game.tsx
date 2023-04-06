import { Button, Flex, Text } from "@chakra-ui/react";
import Container from "./Container";
import Event from "./Event";
import { Calendar, Wallet } from "./icons";
import Product from "./Product";
import ProductsTable from "./Products";
import Travel from "./Travel";

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
      {/* <ProductsTable products={[
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
      ]} /> */}
      {/* <Product 
        product={{
            cost: 100,
            id: 1,
            name: "Apple",
            quantity: 10,
        }}
        isBuying={true}
      /> */}
      {/* <Travel destinations={[{
        id: 1,
        name: "New York",
        travelDays: 1,
      }, {
        id: 2,
        name: "New York",
        travelDays: 100,
      }]} /> */}
      <Event
        event={{
          title: "You were mugged in the subway !!",
          description: "They got away with half of your supply",
          location: "New York",
          product: {
            id: 1,
            name: "Apple",
            cost: 100,
            quantity: 10,
          },
          change: 0,
        }}
      />
    </Container>
  );
};

export default Game;
