import Header from "@/components/Header";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  HStack,
  Text,
  Spacer,
  Circle,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@chakra-ui/react";
import Window from "@/components/Window";
import { Arrow, Chat, Calendar, Wallet, City } from "@/components/icons";
import { DrugList } from "@/components/icons/drugs";

export default function Location() {
  return (
    <>
      <Header />
      <Container centerContent>
        <Window>
          <Card h="full">
            <CardHeader fontSize="17px">
              <HStack>
                <Arrow /> <Text>HOME</Text>
              </HStack>
              <Spacer />
              <HStack gap="20px">
                <HStack>
                  <Chat />
                  <Circle bgColor="gray.600" size="20px">
                    <Text fontSize="10px">2</Text>
                  </Circle>
                </HStack>
                <HStack>
                  <Calendar fill="gray.400" />
                  <Text>1/30</Text>
                </HStack>
                <HStack>
                  <Wallet fill="gray.400" />
                  <Text>$420</Text>
                </HStack>
              </HStack>
            </CardHeader>
            <CardBody overflowY="scroll">
              <Accordion allowToggle>
                <HStack px="12px" fontSize="14px" py="8px">
                  <City boxSize="18px" />
                  <Text>Brooklyn</Text>
                </HStack>
                <HStack px="12px" fontSize="14px" color="gray.500">
                  <Text flex="1">Product</Text>
                  <Text flex="1" align="center">
                    Cost
                  </Text>
                  <Text flex="1" align="center">
                    Quantity
                  </Text>
                </HStack>
                {DrugList.map((drug, index) => (
                  <AccordionItem key={index}>
                    <AccordionButton>
                      <HStack flex="1">
                        {drug.icon}
                        <Text>{drug.name}</Text>
                      </HStack>
                      <Text flex="1">$$$</Text>
                      <Text flex="1"></Text>
                    </AccordionButton>
                    <AccordionPanel>
                      <HStack>
                        <Button variant="default" fontSize="14px" flex="1">
                          Buy
                        </Button>
                        <Button variant="default" fontSize="14px" flex="1">
                          Sell
                        </Button>
                      </HStack>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardBody>
            <CardFooter>
              <Button flex="1">Travel</Button>
            </CardFooter>
          </Card>
        </Window>
      </Container>
    </>
  );
}
