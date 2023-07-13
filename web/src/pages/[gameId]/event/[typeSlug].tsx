import Header from "@/components/Header";
import { VStack, Text, Heading, Image, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { TravelEvents } from "@/hooks/state";
import { getEventBySlug, getLocationByName } from "@/hooks/ui";
import { usePlayerEntity } from "@/hooks/dojo/entities/usePlayerEntity";
import CrtEffect from "@/components/CrtEffect";

export default function Event() {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const event = getEventBySlug(router.query.typeSlug as string);
  const { player: playerEntity } = usePlayerEntity({
    gameId,
    address: process.env.NEXT_PUBLIC_PLAYER_ADDRESS!,
  });

  if (!playerEntity) {
    return <></>;
  }
  const location = getLocationByName(playerEntity.location_name);
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
            You were...
          </Text>
          <Heading fontSize={["40px", "48px"]} fontWeight="400">
            {event.name}
          </Heading>
        </VStack>
        <Image src={event.imageSrc} width={["250px", "auto"]} />
        <VStack gap="40px">
          <VStack>
            <Text>They caugh you slipping</Text>
            <Text color="yellow.400">* {event.text} *</Text>
          </VStack>
          <Button
            onClick={() => {
              if (event.name === TravelEvents.Arrested) {
                router.push(`/${gameId}/travel`);
              } else {
                router.push(`/${gameId}/${location.slug}`);
              }
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
