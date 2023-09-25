"use client";

import {
  Text,
  VStack,
  HStack,
  Divider,
  Card,
  Heading,
  Image,
  Box,
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
import { useDojo } from "@/dojo";

declare global {
  interface Window {
    workbox: {
      messageSkipWaiting(): void;
      register(): void;
      addEventListener(name: string, callback: () => unknown): void;
    };
  }
}

const PwaUpdater = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onConfirmActivate = () => window.workbox.messageSkipWaiting();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;

      wb.addEventListener("controlling", () => {
        window.location.reload();
      });
      wb.addEventListener("waiting", () => setIsOpen(true));
      wb.register();
    }
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={()=>{}} isCentered>
      <ModalOverlay />
      <ModalContent maxH="90vh" maxWidth={"600px"}>
        <ModalBody justifyContent="center" minH={"360px"}>
          <div></div>

          <VStack gap="20px" justifyContent="center">
            <VStack textAlign="center" pt="20px">
              <Heading fontSize="20px" fontFamily="dos-vga" fontWeight="normal">
                OUTDATED !
              </Heading>
              <Text color="neon.500">Yo bro, a new version is available!</Text>
            </VStack>
            <Image
              src={`/images/will-smith-with-attitude.png`}
              alt={`yo`}
              w={["200px", "320px"]}
              objectFit={["cover", "contain"]}
            />
          </VStack>

          <ModalFooter justifyContent="center" w="full" pb="30px">
            <Button onClick={onConfirmActivate}>Reload and update</Button>
            {/* <Button oncClick={() => setIsOpen(false)}>Cancel</Button> */}
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default PwaUpdater;
