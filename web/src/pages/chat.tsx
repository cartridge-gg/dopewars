import Header from "@/components/Header";
import { Arrow, Sparkle } from "@/components/icons";
import { Field, Form, Formik } from "formik";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import Window from "@/components/Window";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Container,
  Text,
  HStack,
  VStack,
  Spacer,
  Button,
  Input,
  Divider,
  Circle,
  StyleProps,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import NextLink from "next/link";

type MessageType = {
  name: string;
  icon?: ReactNode;
  isOwn?: true;
  message: string;
};

type EventType = {
  event: string;
};

type EntryType = MessageType | EventType;

export default function Chat() {
  const router = useRouter();
  const bottomRef = React.createRef<HTMLDivElement>();
  const [entries, setEntries] = useState<EntryType[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [msgInput, setMsgInput] = useState<string>("");

  useEffect(() => {
    const entries: EntryType[] = [
      { event: "Game Created" } as EventType,
      { name: "0x13..113", message: "Hi, ready to play?" } as MessageType,
      { name: "0x45..653", message: "GL HF!" } as MessageType,
      {
        name: "Player",
        message: "This is a really long message and it should wrap around",
      } as MessageType,
      { event: "You joined the game" } as EventType,
    ];

    setEntries(entries);
  }, [setEntries]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsgInput(e.target.value);
  };

  const onSend = useCallback(() => {
    const msg: MessageType = {
      name: "0xyou",
      message: msgInput,
      isOwn: true,
    };

    entries.push(msg);
    setEntries(entries);
    setMsgInput("");
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgInput, entries, setEntries]);
  return (
    <>
      <Header />
      <Container centerContent>
        <Window bgColor="gray.700">
          <Card h="full">
            <CardHeader>
              <HStack as={NextLink} href="/" flex="1">
                <Arrow />
                <Text fontSize="14px">BACK</Text>
              </HStack>
              <HStack flex="1" justify="center">
                <Text>Chat</Text>
              </HStack>
              <HStack flex="1"></HStack>
            </CardHeader>
            {/** TODO: Fix to bottom behavior and styling */}
            <CardBody px="36px" overflowY="hidden">
              <VStack gap="10px">
                {entries.map((entry, index) => {
                  if ("message" in entry) {
                    return <Message {...entry} key={index} />;
                  } else {
                    return <Event {...entry} key={index} />;
                  }
                })}
              </VStack>
              <Box ref={bottomRef} />
            </CardBody>
            <Divider />
            <CardFooter flexDirection="column">
              <Formik initialValues={{}} onSubmit={onSend}>
                {() => (
                  <Form>
                    <Input
                      placeholder="Say something!"
                      value={msgInput}
                      onChange={handleInput}
                      mb="12px"
                    />
                    <Button onClick={onSend} w="full">
                      Send
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardFooter>
          </Card>
        </Window>
      </Container>
    </>
  );
}

const Message = ({
  name,
  icon,
  message,
  isOwn = false,
  ...rest
}: {
  name: string;
  icon?: ReactNode;
  isOwn?: boolean;
  message: string;
} & StyleProps) => (
  <HStack
    gap="18px"
    w="full"
    {...rest}
    flexDirection={isOwn ? "row-reverse" : "row"}
  >
    <Circle bgColor="gray.600" size="36px" />
    <HStack layerStyle="card" p="8px" align="flex-start">
      {!isOwn && <Text color="gray.400">{name}:</Text>}
      <Text>{message}</Text>
    </HStack>
  </HStack>
);

const Event = ({ event }: { event: string }) => {
  return (
    <HStack color="gray.400" w="full" justify="center" fontSize="14px">
      <Sparkle />
      <Text>{event}</Text>
      <Sparkle />
    </HStack>
  );
};
