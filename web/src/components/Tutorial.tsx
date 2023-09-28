import {
  Text,
  VStack,
  HStack,
  Divider,
  Card,
  Heading,
  Image,
  Box,
  Link as ChakraLink,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import { useState, useEffect } from "react";
import { playSound, Sounds } from "@/hooks/sound";
import Dot from "./Dot";
import { useDojo } from "@/dojo2/DojoContext";

const steps = [
  {
    step: 1,
    title: "GAME STATE",
    desc: "Displays important details about the game",
  },
  {
    step: 2,
    title: "BUYING PRODUCT",
    desc: "Buy the ones you can flip for profit",
  },
  {
    step: 3,
    title: "KEEP IT MOVING",
    desc: "Different locations will offer different prices",
  },
  {
    step: 4,
    title: "A WORD OF ADVICE",
    desc: "The streets can be mean, Watch your back.",
  },
];

const TutorialStep = ({
  step,
}: {
  step: { step: number; title: string; desc: string };
}) => {
  return (
    <>
      <VStack gap="20px" justifyContent="center">
        <VStack textAlign="center" pt="20px">
          <Heading fontSize="20px" fontFamily="dos-vga" fontWeight="normal">
            {step.title}
          </Heading>
          <Text color="neon.500">{step.desc}</Text>
        </VStack>
        <Image
          src={`/images/tutorial/tuto${step.step}.png`}
          alt={`step${step.step}`}
          w="full"
          minH={["200px", "320px"]}
          objectFit={["cover", "contain"]}
        />
      </VStack>
    </>
  );
};

const Tutorial = ({
  isOpen,
  close,
}: {
  isOpen: boolean;
  close: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const {
    account,
    burner: { create: createBurner, isDeploying: isBurnerDeploying },
  } = useDojo();

  const onNext = () => {
    if (currentStep == steps.length) {
      if (!account) {
        createBurner();
      }
      close();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  useEffect(() => {
    setCurrentStep(1);
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={close} isCentered>
      <ModalOverlay />
      <ModalContent maxH="90vh" maxWidth={"600px"}>
        <ModalBody justifyContent="center" minH={"360px"}>
          <Box position={"relative"}>
            {steps.map((step) => {
              if (step.step !== currentStep) return null;
              return <TutorialStep step={step} key={step.step} />;
            })}
          </Box>
        </ModalBody>
        <ModalFooter justifyContent="center" w="full" pb="30px">
          <VStack w="full">
            <HStack gap="10px" mb="16px">
              {steps.map((step) => {
                return (
                  <Dot
                    key={`dot-${step.step}`}
                    active={step.step == currentStep}
                    onClick={() => setCurrentStep(step.step)}
                  />
                );
              })}
            </HStack>

            <Button
              onClick={onNext}
              w="full"
              hoverSound={undefined}
              clickSound={
                currentStep == steps.length
                  ? Sounds.Magnum357
                  : Sounds.HoverClick
              }
            >
              {currentStep == steps.length
                ? account
                  ? "READY TO HUSTLE"
                  : "CREATE BURNER"
                : "NEXT"}
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Tutorial;
