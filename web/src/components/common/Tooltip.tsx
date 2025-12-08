import { Tooltip as ChakraTooltip, PlacementWithLogical, Text, VStack } from "@chakra-ui/react";
import { ReactNode, useState } from "react";

export function Tooltip({
  children,
  color = "neon.400",
  title,
  text,
  content,
  placement = "left",
}: {
  children: ReactNode;
  color: string;
  title?: string;
  text?: string;
  content?: ReactNode;
  placement?: PlacementWithLogical;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ChakraTooltip
      // hasArrow
      isOpen={isOpen}
      placement={placement}
      label={<TooltipContent title={title} content={content} text={text} color={color} />}
    >
      <span
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onTouchStart={() => setIsOpen(true)}
        onTouchEnd={() => setIsOpen(false)}
      >
        {children}
      </span>
    </ChakraTooltip>
  );
}

const TooltipContent = ({
  title,
  text,
  content,
  color,
  placement,
}: {
  title?: string;
  content?: ReactNode;
  text?: string;
  color: string;
  placement?: string;
}) => (
  <VStack w="full" alignItems="flex-start" maxW="260px" p="2px" color={color} gap={0}>
    {title && <Text fontSize="16px">{title}</Text>}
    {text && <Text opacity={0.5}>{text}</Text>}
    {content ? <> {content}</> : ""}
  </VStack>
);
