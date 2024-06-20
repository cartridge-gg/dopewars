import { ScrollDown } from "@/components/icons/ScrollDown";
import { Cartridge } from "@/components/icons/branding/Cartridge";
import { Dojo } from "@/components/icons/branding/Dojo";
import {
  Box,
  Card,
  Link as ChakraLink,
  HStack,
  Heading,
  Image,
  StyleProps,
  Text,
  VStack,
  keyframes,
} from "@chakra-ui/react";

const floatAnim = keyframes`  
  0% {transform: translateY(0%);}
  25% {transform: translateY(-6px);}
  50% {transform: translateY(0%);}
  70% {transform: translateY(8px);}
`;

const steps = [
  {
    step: 1,
    title: "Buy Low",
    desc: "A short description of this step, maybe one to two sentences. Here is one.",
  },
  {
    step: 2,
    title: "Sell High",
    desc: "A short description of this step, maybe one to two sentences. Here is one.",
  },
  {
    step: 3,
    title: "???",
    desc: "A short description of this step, maybe one to two sentences. Here is one.",
  },
  {
    step: 4,
    title: "Profit",
    desc: "A short description of this step, maybe one to two sentences. Here is one.",
  },
];

const HomeStep = ({ step }: { step: { step: number; title: string; desc: string } }) => {
  return (
    <>
      <HStack flexDirection={step.step % 2 == 1 ? "row" : "row-reverse"} gap="20px">
        <Image src={`/images/landing/step${step.step}.png`} alt={`step${step.step}`} w="42%" />

        <VStack w="58%" alignItems="flex-start" py="100px">
          <HStack>
            <Image src={`/images/landing/step${step.step}-icon.png`} alt={`step${step.step}`} w="92px" />
            <VStack alignItems="flex-start">
              <Text
                fontSize="11px"
                fontFamily="broken-console"
                backgroundColor="#174127"
                padding="0.5rem 0.5rem 0.25rem"
              >
                Step {step.step}
              </Text>
              <Heading fontFamily={"ppneuebit"} fontSize="44px" lineHeight={"1"}>
                {step.title}
              </Heading>
            </VStack>
          </HStack>
          {/* <Text p="10px">{step.desc}</Text> */}
        </VStack>
      </HStack>
    </>
  );
};

export const HomeLeftPanel = () => {
  const onScrollDown = () => {
    let steps = document.getElementById("steps");

    setTimeout(() => {
      steps &&
        steps.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
    }, 10);
  };

  return (
    <>
      <VStack
        my="auto"
        flex={["auto", "1"]}
        position="relative"
        maxH={["80px", "800px"]}
        overflow="hidden"
        overflowY="auto"
        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
          "scrollbar-width": "none",
        }}
      >
        <VStack zIndex="2" position="relative">
          <Box w="full" position={"fixed"} top="-40px" >
            <Image
              position="absolute"
              src={"/images/landing/main.png"}
              opacity={0.25}
              width="100%"
              height="194px"
              objectFit={"cover"}
              objectPosition={"top"}
              display={["block", "none"]}
              alt="context"
            />
          </Box>

          <Text textStyle="subheading" fontSize="11px">
            Welcome to
          </Text>
          <Heading fontSize={["30px", "48px"]} fontWeight="normal">
            DOPE WARS
          </Heading>

        </VStack>

        <VStack position="relative" top="-160px" display={["none", "flex"]}>
          <Image src={"/images/landing/main.png"} maxH="75vh" display={["none", "block"]} alt="context" />

          <Box
            id="steps"
            style={{ marginTop: "30px" }}
            position="relative"
            onClick={() => onScrollDown()}
            animation={`${floatAnim} infinite 3s linear`}
            cursor={"pointer"}
          >
            <ScrollDown width="40px" height="40px" />
          </Box>

          <Box>
            {steps.map((step) => {
              return <HomeStep step={step} key={step.step} />;
            })}
          </Box>

          <HStack py="100px">
            <BuiltBy />
          </HStack>
        </VStack>
      </VStack>

      <HStack
        w="calc((100% - 100px) / 2)"
        h="200px"
        position="absolute"
        display={["none", "block"]}
        top="0px"
        marginTop="-80px"
        zIndex={1}
        background="linear-gradient(#172217, #172217, transparent)"
        pointerEvents="none"
      ></HStack>

      <HStack
        w="calc((100% - 100px) / 2)"
        h="200px"
        position="absolute"
        display={["none", "block"]}
        bottom="0px"
        marginBottom="-80px"
        zIndex={1}
        background="linear-gradient(transparent, #172217, #172217)"
        pointerEvents="none"
      ></HStack>
    </>
  );
};

export const BuiltBy = ({ ...props }: StyleProps) => {
  return (
    <Card display="flex" flexDirection="row" p="2" alignItems="center" variant="pixelated" px="5" {...props}>
      <ChakraLink
        href="https://cartridge.gg/"
        target="_blank"
        display="flex"
        justifyContent="center"
        alignItems="center"
        textDecoration="none"
        _hover={{
          color: "cartridgeYellow",
        }}
      >
        BUILT BY <Cartridge ml="2" />
      </ChakraLink>

      <Text px="2" fontSize="xl">
        |
      </Text>
      <ChakraLink
        href="https://dojoengine.org/"
        target="_blank"
        display="flex"
        justifyContent="center"
        alignItems="center"
        textDecoration="none"
        _hover={{
          color: "dojoRed",
        }}
      >
        BUILT WITH <Dojo ml="2" />
      </ChakraLink>
    </Card>
  );
};
