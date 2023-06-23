import { ChatEvent, ChatInput } from "@/components";
import Content from "@/components/Content";
import Layout from "@/components/Layout";
import { Box, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

interface ChatEventType {
  conectedUser?: boolean,
  text: string,
  type?: 'action' | 'game' | 'message',
}

const defaultChatMessages: ChatEventType[] = [
  {
    text: 'Game Created',
    type: 'game',
  },
  {
    text: 'Hi, ready to play? ... extra text to show text wrapping',
    type: 'message',
  },
  {
    text: 'Hi, ready to play?',
    type: 'message',
  },
  {
    text: 'Hi, ready to play?',
    type: 'message',
  },
  {
    conectedUser: true,
    text: 'glhf',
    type: 'message',
  },
  {
    text: 'Shinobi was Mugged',
    type: 'action',
  },
];

export default function Chat() {
  const [messages, setMessages] = useState<ChatEventType[]>(defaultChatMessages);

  return (
    <Layout
      title="The Wire"
      backgroundImage="url('https://static.cartridge.gg/games/dope-wars/ryo/chat.png');"
      justifyContent="space-between"
    >
      <Content
        maxH="calc(100vh - 250px)"
        overflowX="auto"
        flexDirection='column-reverse'
      >
        <VStack spacing="16px">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <ChatEvent
                conectedUser={message.conectedUser}
                type={message.type}
                key={index}
              >
                {message.text}
              </ChatEvent>
            ))
          ) : (
            <Text color="neon.500">Its a little lonely in here...</Text>
          )}
        </VStack>
      </Content>
      <Box w="100%" p="24px">
        <ChatInput />
      </Box>
    </Layout>
  )
}