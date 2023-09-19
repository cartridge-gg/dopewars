import { cardPixelatedStyle } from "@/theme/styles";
import { HStack, Link, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Alert, Close, ExternalLink } from "./icons";

export const Toast = ({
  message,
  icon,
  link,
  onClose,
}: {
  message: string;
  icon?: React.FC;
  link?: string;
  onClose: () => void;
}) => {
  return (
    <HStack
      {...cardPixelatedStyle({})}
      // h="40px"
      p={["8px", "20px"]}
      mb={["16px", "20px"]}
      fontSize={["14px", "16px"]}
      lineHeight={["1.2", "1.5"]}
      bgColor="neon.200"
      color="neon.900"
      justify="space-between"
      pointerEvents="all"
      onClick={onClose}
    >
      <HStack>
        <>
          {icon ? icon({ size: "lg" }) : <Alert size="lg" />}
          <Text>{message}</Text>
        </>
      </HStack>
      <Close onClick={onClose} cursor="pointer" />
      {/* {link && (
        <Link href={link} isExternal>
          <ExternalLink />
        </Link>
      )} */}
    </HStack>
  );
};
