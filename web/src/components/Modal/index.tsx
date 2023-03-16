import React from "react";
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  ModalProps,
} from "@chakra-ui/react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footerContent,
  size = "md",
}: ModalProps & {
    title: string;
    footerContent?: React.ReactNode;
}) => {
  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        {footerContent && (
          <ModalFooter>
            {footerContent}
          </ModalFooter>
        )}
      </ModalContent>
    </ChakraModal>
  );
};

export default Modal;
