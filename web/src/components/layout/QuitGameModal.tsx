import { useDojoContext } from "@/dojo/hooks";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

export const QuitGameModal = observer(() => {
  const router = useRouter();
  const { uiStore } = useDojoContext();

  return (
    <Modal motionPreset="slideInBottom" isCentered isOpen={uiStore.modals.quitGame !== undefined} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent bg="bg.dark" maxW="360px">
        <ModalHeader textAlign="center">Quit game</ModalHeader>
        <ModalBody p={6}>
          <VStack w="full" gap={6}>
            <Text>Are you sure ?</Text>
            <HStack w="full" justifyContent="center">
              <Button
                onClick={() => {
                  uiStore.closeQuitGame();
                  router.push("/");
                }}
              >
                YES
              </Button>
              <Button onClick={() => uiStore.closeQuitGame()}>CANCEL</Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
