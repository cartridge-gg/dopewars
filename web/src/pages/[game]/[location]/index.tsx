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
export default function Location() {
  return (
    <>
      <Header />
      <Container centerContent>
        <Window></Window>
      </Container>
    </>
  );
}
