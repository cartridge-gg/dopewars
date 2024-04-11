import { Modal, ModalBody, ModalContent, ModalOverlay, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Loader } from "./Loader";

export const LoadingModal = observer(() => {
  const [isLoading, setIsLoading] = useState(false);

  // useLayoutEffect(() => {
  //   const onDOMContentLoaded = (event: any) => {
  //     if (event.target.readyState === "complete") {
  //       setIsLoading(false);
  //     }
  //   };

  //   window.addEventListener("load", (event) => {
  //     onDOMContentLoaded(event);
  //   }, false);
  //   return () => {
  //     window.removeEventListener("load", onDOMContentLoaded);
  //   };
  // }, []);

  return (
    <Modal motionPreset="slideInBottom" isCentered isOpen={isLoading} onClose={() =>{}}>
      <ModalOverlay />
      <ModalContent bg="bg.dark" maxW="360px">
        <ModalBody p={6}>
          <VStack w="full" gap={6}>
            <Loader text="LOADING ASSETS ..." />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
