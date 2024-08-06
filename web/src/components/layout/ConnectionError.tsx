import { Button, Flex, Image, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ChainSelector } from "../wallet";

const ConnectionError = ({ errors }: { errors: (string | undefined)[] }) => {
  const router = useRouter();

  return (
    <Flex minH="100dvh" alignItems="center" justifyContent="center">
      <VStack>
        <VStack fontSize="16px">
          <VStack fontSize="16px">
            <Image src="/images/events/smoking_gun.gif" alt="rip" w="200px" h="200px" mx="auto" />
             <Text>Playtest has ended!</Text>
            {/* <Text>Unable to connect</Text>
            {errors.map((e,key) => {
              if (e) {
                return <Text key={key}>{e}</Text>;
              }
            })} */}
          </VStack>

          {/* <VStack fontSize="16px" gap={6}>
            <Text>Try to refresh</Text>
            <Button
              variant="pixelated"
              onClick={() => {
                router.reload();
              }}
            >
              REFRESH
            </Button>
            <Text>or switch chain</Text>
            <ChainSelector
              canChange={true}
              onChange={() => {
                router.reload();
              }}
            />
          </VStack> */}

        </VStack>
      </VStack>
    </Flex>
  );
};

export default ConnectionError;
