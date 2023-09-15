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

const Dot = ({
  step,
  currentStep,
  onClick,
}: {
  step: boolean;
  onClick: () => void;
}) => {
  const isCurrent = step == currentStep;
  return (
    <Box
      onClick={onClick}
      cursor={"pointer"}
      bgColor={isCurrent ? "neon.200" : "neon.500"}
      w={isCurrent ? "16px" : "12px"}
      h={isCurrent ? "16px" : "12px"}
      rounded={"full"}
    ></Box>
  );
};

const TutorialStep = ({
  step,
}: {
  step: { step: number; title: string; desc: string };
}) => {
  return (
    <>
      <VStack gap="20px" justifyContent={"center"}>
        <VStack textAlign={"center"} pt="20px">
          <Heading fontSize="20px">{step.title}</Heading>
          <Text color="neon.500">{step.desc}</Text>
        </VStack>
        <Image
          src={`/images/tutorial/tuto${step.step}.png`}
          alt={`step${step.step}`}
          w="full"
          minH={["200px","320px"]}
          objectFit={["cover","contain"]}
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

  const onNext = () => {
    if (currentStep == steps.length) {
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
      <ModalContent maxH="70vh" maxWidth={"600px"} mx="10px">
        <ModalBody justifyContent="center" minH={"360px"}>
          <Box position={"relative"}>
            {steps.map((step) => {
              if (step.step !== currentStep) return null;
              return <TutorialStep step={step} key={step.step} />;
            })}
          </Box>
        </ModalBody>
        <ModalFooter justifyContent="center" w="full">
          <VStack>
            <HStack gap="10px"  mb="16px">
              {steps.map((step) => {
                return (
                  <Dot
                    step={step.step}
                    currentStep={currentStep}
                    onClick={() => setCurrentStep(step.step)}
                  />
                );
              })}
            </HStack>

            <Button onClick={onNext} w="full" hoverSound="" clickSound={currentStep == steps.length ? Sounds.Magnum357 : Sounds.HoverClick}>
              {currentStep == steps.length ? "READY TO HUSTLE" : "NEXT"}
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Tutorial;
