import { cardPixelatedStyle } from "@/theme/styles";
import { HStack, Link, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Alert, ExternalLink } from "./icons";

export const Toast = ({
  message,
  icon,
  link,
}: {
  message: string;
  icon?: React.FC;
  link?: string;
}) => {
  return (
    <HStack
      {...cardPixelatedStyle({})}
      h="40px"
      p="30px"
      mb={["80px", "20px"]}
      bgColor="neon.200"
      color="neon.900"
      justify="space-between"
    >
      <HStack>
        <>
          {icon ? icon({ size: "lg" }) : <Alert size="lg" />}
          <Text>{message}</Text>
        </>
      </HStack>
      {link && (
        <Link href={link} isExternal>
          <ExternalLink />
        </Link>
      )}
    </HStack>
  );
};
