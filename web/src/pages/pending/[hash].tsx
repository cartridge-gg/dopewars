import Content from "@/components/Content";
import Layout from "@/components/Layout";
import { Image, Link, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Pending() {
  const router = useRouter();
  const { hash } = router.query as { hash: string };

  return (
    <Layout
      title="New game"
      prefixTitle="Start a"
      headerImage="/images/watch.png"
      headerImageMaxWidth="240px"
    >
      <Content>
        <VStack gap="24px" height="60vh" justifyContent="center">
          <Image src="/images/loading.gif" alt="loading..." />
          <VStack>
            <Text>Transaction pending...</Text>
            <Link color="yellow.400">View on Starkscan</Link>
          </VStack>
        </VStack>
      </Content>
    </Layout>
  );
}
