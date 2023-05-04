import React, { createContext, useContext, useState } from "react";
import Modal from "./";

type ModalContextProps = {
  openModal: (
    title: string,
    content: React.ReactNode,
    footerContent?: React.ReactNode,
    size?: "sm" | "md" | "lg" | "xl" | "full",
  ) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextProps>({
  openModal: () => {},
  closeModal: () => {},
});

export const useModal = () => {
  return useContext(ModalContext);
};

type ModalProviderProps = {
  children: React.ReactNode;
};

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<React.ReactNode>(null);
  const [footerContent, setFooterContent] = useState<
    React.ReactNode | undefined
  >(undefined);
  const [size, setSize] = useState<"sm" | "md" | "lg" | "xl" | "full">("md");

  const openModal = (
    title: string,
    content: React.ReactNode,
    footerContent?: React.ReactNode,
    size: "sm" | "md" | "lg" | "xl" | "full" = "md",
  ) => {
    setTitle(title);
    setContent(content);
    setFooterContent(footerContent);
    setSize(size);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={title}
        footerContent={footerContent}
        size={size}
      >
        {content}
      </Modal>
    </ModalContext.Provider>
  );
};
