import { HStack, StyleProps, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Sparkles } from "@/components/icons";
import BorderImage from "@/components/icons/BorderImage";
import { Avatar } from "@/components";

export interface ChatEventProps {
  avatar?: string,
  conectedUser?: boolean,
  children: ReactNode,
  type?: 'action' | 'game' | 'message'
}

export const ChatEvent = ({
  children,
  conectedUser,
  type = 'message',
  ...props
}: ChatEventProps & StyleProps) => {
  let chatEvent;
  switch (type) {
    case "action":
      chatEvent = (
        <HStack
          w="full"
          spacing='6px'
          color="neon.500"
          justify="center"
          fontFamily="chicago-flf"
          fontSize="14px"
          {...props}
        >
          <Sparkles />
          <Text>
            {children}
          </Text>
          <Sparkles inverted />
        </HStack>
      )
      break;
    case "game":
      chatEvent = (
        <HStack
          w="full"
          spacing='6px'
          color="neon.500"
          justify="center"
          fontSize="16px"
          {...props}
        >
          <Sparkles />
          <Text>{children}</Text>
          <Sparkles inverted />
        </HStack>
      )
      break;
    case "message":
      chatEvent = (
        <HStack
          w="100%"
          justify={conectedUser ? 'flex-end' : 'flex-start'}
        >
          <Avatar name="PersonA" width="36px" height="36px" />
          <Text
            p="7px 12px"
            borderRadius="8px"
            style={{
              borderImageSlice: "4",
              borderImageWidth: "2px",
              borderImageSource: `url("data:image/svg+xml,${BorderImage({
                color: "#202F20",
                isPressed: false,
              })}")`
            }}
          >
            {children}
          </Text>
        </HStack>
      )
      break;
  }

  return chatEvent;
}