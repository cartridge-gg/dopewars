import { Image, Text, VStack } from "@chakra-ui/react";

export const Loader = () => {
  return (
    <VStack gap={3}>
      <Image src="/images/loading.gif" alt="loading" width="60px" height="60px" margin="auto" />
      <Text fontFamily="broken-console" fontSize="12px" color="neon.500">LOADING ...</Text>
    </VStack>
  );
};