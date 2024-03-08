import { cardPixelatedStyle } from "@/theme/styles";
import { HStack, Text } from "@chakra-ui/react";
import { Cigarette, Close } from "../icons";

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
      p={["8px", "16px"]}
      mt={["10px", "16px"]}
      fontSize={["14px", "16px"]}
      lineHeight={["1.2", "1.5"]}
      bgColor={isError ? "red" : "neon.600"}
      color={isError ? "neon.700" : "neon.400"}
      justify="space-between"
      pointerEvents="all"
      onClick={onClose}
    >
      <HStack w="full">
        <>
          {icon ? icon({ size: "lg" }) : <Cigarette size="lg" />}
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
