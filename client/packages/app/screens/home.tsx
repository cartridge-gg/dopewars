import {
  Container,
  Button,
  VStack,
  HStack,
  Spacer,
  Text,
  Header,
} from "app/components";
import { Bell } from "app/components/icons/Bell";
import { Clock } from "app/components/icons/Clock";

const players = [
  { name: "0x1234...5678" },
  { name: "0x1234...5678" },
  { name: "0x1234...5678" },
  { name: "0x1234...5678" },
  { name: "0x1234...5678" },
];

export function HomeScreen() {
  return (
    <>
      <VStack className="flex-1 bg-gray-400">
        <Header />
        <HStack className="mx-3 mb-3 flex-1 justify-center">
          <Container className="m-3 max-w-md rounded-md border-2 bg-gray-800 p-3">
            <VStack>
              <HStack className="pb-3">
                <HStack>
                  <Bell fill="white" />
                  <Spacer className="w-2" />
                  <Text
                    className="leading-6 text-white"
                    style={{ fontFamily: "ChicagoFLF" }}
                  >
                    Lobby
                  </Text>
                </HStack>
                <Spacer />
                <HStack>
                  <Clock fill="white" />
                  <Spacer className="w-2" />
                  <Text
                    className="text-green leading-6"
                    style={{ fontFamily: "ChicagoFLF" }}
                  >
                    18m 37s
                  </Text>
                </HStack>
              </HStack>
              <VStack className="rounded-md border-black bg-gray-900">
                {players.map((player, i) => (
                  <HStack className="justify-between p-3">
                    <HStack>
                      <Text
                        className="text-white"
                        style={{ fontFamily: "ChicagoFLF" }}
                      >
                        {i + 1}
                      </Text>
                      <Spacer className="w-10" />
                      <Text
                        className="text-white"
                        style={{ fontFamily: "ChicagoFLF" }}
                      >
                        {player.name}
                      </Text>
                    </HStack>
                    <Text
                      className="text-gray-400"
                      style={{ fontFamily: "ChicagoFLF" }}
                    >
                      --
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>
            <Spacer />
            <Button title="Join" variant="secondary" />
          </Container>
        </HStack>
      </VStack>
    </>
  );
}
