import Header from "@/components/Header";
import Window from "@/components/Window";
import { Container } from "@chakra-ui/react";

export default function Create() {
  return (
    <>
      <Header />
      <Container centerContent>
        <Window></Window>
      </Container>
    </>
  );
}
