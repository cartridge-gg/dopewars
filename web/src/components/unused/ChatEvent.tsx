import { Sparkles } from "@/components/icons";
import BorderImage from "@/components/icons/PressableBorderImage";
import colors from "@/theme/colors";
import { Divider, HStack, StyleProps, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Avatar } from "../avatar/Avatar";
import { AvatarName } from "../avatar/avatars";

export interface ChatEventProps {
  avatar?: string;
  connectedUser?: boolean;
  children: ReactNode;
  type?: "action" | "alert" | "game" | "message";
  user?: {
    avatar?: AvatarName;
  };
}

export const ChatEvent = ({
  children,
  connectedUser,
  type = "message",
  user,
  ...props
}: ChatEventProps & StyleProps) => {
  let chatEvent;
  switch (type) {
    case "action":
      chatEvent = (
        <HStack
          w="full"
          spacing="6px"
          color="neon.500"
          justify="center"
          fontFamily="chicago-flf"
          fontSize="14px"
          {...props}
        >
          <Sparkles />
          <Text>{children}</Text>
          <Sparkles inverted />
        </HStack>
      );
      break;
    case "alert":
      chatEvent = (
        <HStack
          w="full"
          spacing="6px"
          color="yellow.400"
          justify="center"
          fontSize="16px"
          textTransform="uppercase"
          {...props}
        >
          <Divider borderColor="yellow.400" />
          <Text>{children}</Text>
          <Divider borderColor="yellow.400" />
        </HStack>
      );
      break;
    case "game":
      chatEvent = (
        <HStack
          w="full"
          spacing="6px"
          color="neon.500"
          justify="center"
          fontSize="16px"
          {...props}
        >
          <Sparkles />
          <Text>{children}</Text>
          <Sparkles inverted />
        </HStack>
      );
      break;
    case "message":
      chatEvent = (
        <HStack w="100%" flexDirection={connectedUser ? "row-reverse" : "row"}>
          <Avatar size="lg" name={user?.avatar ? user.avatar : "PersonA"} />
          <Text
            p="7px 12px"
            borderRadius="8px"
            style={{
              borderImageSlice: "4",
              borderImageWidth: "2px",
              borderImageSource: `url("data:image/svg+xml,${BorderImage({
                color: colors.neon["700"].toString(),
                isPressed: false,
              })}")`,
            }}
          >
            {children}
          </Text>
        </HStack>
      );
      break;
  }

  return chatEvent;
};
