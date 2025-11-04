import { ChatEvent, ChatInput } from "@/components";
import { AvatarName } from "@/components/avatar/avatars";
import { Layout } from "@/components/layout";
import { Box, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

interface ChatEventType {
  connectedUser?: boolean;
  text: string;
  type?: "action" | "alert" | "game" | "message";
  user?: {
    avatar?: AvatarName;
  };
}

const defaultChatMessages: ChatEventType[] = [
  {
    text: "Game Created",
    type: "game",
  },
  {
    text: "Hi, ready to play? ... extra text to show text wrapping",
    type: "message",
    user: {
      avatar: "PersonJ",
    },
  },
  {
    text: "Hi, ready to play?",
    type: "message",
    user: {
      avatar: "PersonD",
    },
  },
  {
    text: "Hi, ready to play?",
    type: "message",
    user: {
      avatar: "PersonB",
    },
  },
  {
    connectedUser: true,
    text: "glhf",
    type: "message",
    user: {
      avatar: "PersonA",
    },
  },
  {
    text: "New",
    type: "alert",
  },
  {
    text: "Shinobi was Mugged",
    type: "action",
  },
   {
    text: "PersonQ",
    type: "message",
    user: {
      avatar: "PersonQ",
    },
  },
   {
    text: "PersonP",
    type: "message",
    user: {
      avatar: "PersonP",
    },
  },
];

export default function Chat() {
  const [messages, setMessages] = useState<ChatEventType[]>(defaultChatMessages);
  const [messageValue, setMessageValue] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageValue(event.target.value);
  };
  const handleSendMessage = () => {
    setMessages((oldMessages) => [
      ...oldMessages,
      {
        connectedUser: true,
        text: messageValue,
        type: "message",
      },
    ]);
    setMessageValue("");
  };

  return (
    <Layout
      leftPanelProps={{
        title: "The Wire",
        imageSrc: "url('/images/pager.gif');",
      }}
    >
      <VStack spacing="16px">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <ChatEvent connectedUser={message.connectedUser} type={message.type} user={message.user} key={index}>
              {message.text}
            </ChatEvent>
          ))
        ) : (
          <Text color="neon.500">Its a little lonely in here...</Text>
        )}
      </VStack>
      <Box w="100%" p="24px">
        <ChatInput value={messageValue} onChange={handleChange} onSend={handleSendMessage} />
      </Box>
    </Layout>
  );
}
