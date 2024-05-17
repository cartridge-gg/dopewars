import { useDojoContext } from "@/dojo/hooks";
import { Modal, ModalBody, ModalContent, ModalOverlay, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Loader } from "../layout/Loader";

export const DeployingModal = observer(() => {
  const { burnerManager, isPrefundingPaper } = useDojoContext();

  const [text, setText] = useState("Loading ...");

  // const isDeploying = useMemo(() => {
  //   return burnerManager?.isDeploying
  // }, [burnerManager, burnerManager?.isDeploying]);

  // useEffect(() => {
  //   setIsDeploying(burnerManager?.isDeploying);
  // }, [burnerManager?.isDeploying]);

  const [isDeploying, setIsDeploying] = useState(false);
  useEffect(() => {
    const handle = setInterval(() => {
      setIsDeploying(burnerManager?.isDeploying || false);
    }, 500);
    return () => {
      clearInterval(handle);
    };
  }, [burnerManager?.isDeploying]);

  useEffect(() => {
    if (isDeploying) {
      setText("Deploying burner...");
    }

    if (isPrefundingPaper) {
      setText("Paper Airdrop burner...");
    }
  }, [isDeploying, isPrefundingPaper]);

  return (
    <Modal motionPreset="slideInBottom" isCentered isOpen={isDeploying || isPrefundingPaper} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent bg="bg.dark" maxW="360px">
        <ModalBody p={6}>
          <VStack w="full" gap={6}>
            <Loader text={text} />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
