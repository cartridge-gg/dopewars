import { Layout, OG } from "@/components/layout";
import { useRouterContext } from "@/dojo/hooks";
import { Sounds, playSound } from "@/hooks/sound";
import { Box, Flex, Text } from "@chakra-ui/react";

export default function Custom404() {
  const { router } = useRouterContext()
  return (
    <Layout isSinglePanel={true}>
      <Flex boxSize="full" alignItems="center" justifyContent="center" flexDirection="column">

        <Box w="300px" h="300px" cursor="crosshair" onClick={()=> {
          playSound(Sounds.Magnum357)
          setTimeout(() => {
            playSound(Sounds.Ooo, 0.5)
          }, 420)
          router.push("/")
        }}>
          <OG id={Math.floor(Math.random()* 500)} />
        </Box>
        <Text>Are you lost hustler ?</Text>
      </Flex>
    </Layout>
  );
}
