import { cardPixelatedStyle } from "@/theme/styles";
import { HStack, Link, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Alert, Close, ExternalLink } from "./icons";

export const Toast = ({
  message,
  icon,
  link,
  onClose,
  isError,
}: {
  message: string;
  icon?: React.FC;
  link?: string;
  onClose: () => void;
  isError: boolean;
}) => {
  return (
    <HStack
      {...cardPixelatedStyle({})}
      // h="40px"
      p={["8px", "20px"]}
      mt={["16px", "20px"]}
      fontSize={["14px", "16px"]}
      lineHeight={["1.2", "1.5"]}
      bgColor={isError ? "red" : "neon.200"}
      color="neon.900"
      justify="space-between"
      pointerEvents="all"
      onClick={onClose}
    >
      <HStack w="full">
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
