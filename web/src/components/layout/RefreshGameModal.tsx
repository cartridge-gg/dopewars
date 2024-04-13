import { useDojoContext, useRouterContext } from "@/dojo/hooks";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

export const RefreshGameModal = observer(() => {
  const { router, gameId } = useRouterContext();
  const { uiStore } = useDojoContext();

  return (
    <Modal motionPreset="slideInBottom" isCentered isOpen={uiStore.modals.refreshGame !== undefined} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent bg="bg.dark" maxW="360px">
        <ModalHeader textAlign="center">Im lost</ModalHeader>
        <ModalBody p={6}>
          <VStack w="full" gap={6}>
            <HStack w="full" justifyContent="center">
              <Button
                onClick={() => {
                  uiStore.closeRefreshGame();

                  if (gameId) {
                    router.push(`/${gameId}`);
                  } else {
                    router.push("/");
                  }
                }}
              >
                REFRESH PLZ
              </Button>
              <Button onClick={() => uiStore.closeRefreshGame()}>CANCEL</Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
