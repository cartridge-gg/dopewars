import { Tooltip as ChakraTooltip, Text, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function Tooltip({
  children,
  color,
  title,
  text,
}: {
  children: ReactNode;
  color: string;
  title: string;
  text: string;
}) {
  return <ChakraTooltip  hasArrow label={<TooltipContent title={title} text={text} color={color} />}>{children}</ChakraTooltip>;
}

const TooltipContent = ({ title, text, color }: { title: string; text: string; color: string }) => {
  return (
    <VStack w="full" alignItems="flex-start" maxW="260px" p="2px" color={color} gap={0}>
      <Text fontSize="16px">{title}</Text>
      <Text opacity={0.5}>{text}</Text>
    </VStack>
  );
};
