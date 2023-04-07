import Header from "@/components/Header";
import Window from "@/components/Window";
import { Container, Text } from "@chakra-ui/react";

export default function Create() {
  return (
    <>
      <Header />
      <Container centerContent>
        <Window bgColor="gray.700" border="none"></Window>
      </Container>
    </>
  );
}
