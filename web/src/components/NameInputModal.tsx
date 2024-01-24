import { Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter, Button, ModalHeader, Text } from "@chakra-ui/react";
import Input from "./Input";
import { useState } from "react";

interface NameInputModalProps {
  isOpen: boolean;
  close: () => void;
  onSubmit: (name: string) => void;
}

export const NameInputModal = ({ isOpen, close, onSubmit }: NameInputModalProps) => {
  const [name, setName] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={close} isCentered size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">ENTER NAME</ModalHeader>
        <ModalBody justifyContent="center" py={4}>
          <Input
            display="flex"
            mx="auto"
            maxLength={20}
            placeholder="Enter your name"
            autoFocus={true}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && name) {
                onSubmit(name);
              }
            }}
          />
          {name.length === 20 && (
            <Text w="full" align="center" color="red">
              Max 20 characters
            </Text>
          )}
        </ModalBody>
        <ModalFooter justifyContent="center" w="full" pb="30px">
          <Button onClick={() => onSubmit(name)} w="full" isDisabled={!name}>
            Play
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
