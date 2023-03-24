import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Flex,
    Spacer,
    Text,
  } from "@chakra-ui/react";
  import { ReactNode } from "react";
import Road from "./icons/Road";
  import Pill from "./Pill";
  
  export interface Destination {
    id: number;
    name: string;
    travelDays: number;
  }
  
  interface TravelProps {
    destinations: Destination[];
  }
  
  const Travel = ({ destinations }: TravelProps) => {
    return (
      <Flex bg="#141011" borderRadius={4} border="2px solid black" flexDir="column">
        <Text p="4px 12px" fontSize="14px">
            <Road /> Travel
        </Text>
        <Accordion border="transparent">
        {destinations.map((destination) => (
          <AccordionItem  key={destination.id}>
            <AccordionButton
              p="10px 12px"
              _expanded={{
                bg: "#434345",
              }}
            >
              <Flex  fontSize="14px" w="full" gap="8px">
                <Text>{destination.name}</Text>
                <Spacer />
                <Pill bg="#141011">
                  <Text>{destination.travelDays} days</Text>
                </Pill>
              </Flex>
            </AccordionButton>
            <AccordionPanel bg="#434345">
              <Button
                w="full"
                onClick={() => console.log("Depart clicked")}
              >
                Depart
              </Button>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      </Flex>
    );
  };
  
  export default Travel;
  