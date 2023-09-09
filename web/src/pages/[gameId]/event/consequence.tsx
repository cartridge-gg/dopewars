import CrtEffect from "@/components/CrtEffect";
import Header from "@/components/Header";
import { getOutcome } from "@/hooks/ui";
import { Button, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Consequence() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const outcome = getOutcome(Number(router.query.outcome as string));

  return (
    <>
      <Header />
      <VStack
        position="fixed"
        top="0"
        left="0"
        boxSize="full"
        align="center"
        justify="center"
      >
        <VStack>
          <Text
            textStyle="subheading"
            fontSize={["10px", "11px"]}
            letterSpacing="0.25em"
          >
            You...
          </Text>
          <Heading fontSize={["40px", "48px"]} fontWeight="400">
            {outcome.name}
          </Heading>
        </VStack>
        <Image
          alt={outcome.name}
          src={outcome.imageSrc}
          width={["250px", "auto"]}
        />
        <VStack gap="40px">
          <VStack>
            <Text>{outcome.description}</Text>
            <Text color="yellow.400">* *</Text>
          </VStack>
          <Button
            onClick={() => {
              router.push(`/${gameId}/turn`);
            }}
          >
            Continue
          </Button>
        </VStack>
      </VStack>
      <CrtEffect />
    </>
  );
}
