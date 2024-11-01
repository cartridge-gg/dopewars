import { Image, Text, VStack } from "@chakra-ui/react";
import { OG } from "./OG";

export const Loader = ({ text = "LOADING ..." }: { text?: string }) => {
  return (
    <VStack gap={3}>
      <Image src="/images/loading.gif" alt="loading" width="60px" height="60px" margin="auto" />
      <Text fontFamily="broken-console" fontSize="12px" color="neon.500">
        {text}
      </Text>
    </VStack>
  );
};

export const OGLoader = ({ text = "LOADING ..." }: { text?: string }) => {
  return (
    <VStack gap={3}>
      <OG id={Math.floor(Math.random() * 500)} />
      <Text fontFamily="broken-console" fontSize="12px" color="neon.500">
        {text}
      </Text>
    </VStack>
  );
};
