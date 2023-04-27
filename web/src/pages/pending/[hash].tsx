import Content from "@/components/Content";
import Weed from "@/components/images/Weed";
import Layout from "@/components/Layout";
import { Link, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Pending() {
  const router = useRouter();
  const { hash } = router.query as { hash: string };

  return (
    <Layout
      title="Pending"
      prefixTitle="You are"
      backgroundImage="url('https://static.cartridge.gg/games/dope-wars/ryo/waiting.png');"
    >
      <Content>
        <VStack gap="24px">
          <Weed />
          <VStack>
            <Text>Transaction pending...</Text>
            <Link>View on Starkscan</Link>
          </VStack>
        </VStack>
      </Content>
    </Layout>
  );
}
