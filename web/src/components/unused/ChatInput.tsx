import { Button, Input } from "@/components/common";
import { SendMessage } from "@/components/icons";
import { HStack, StyleProps } from "@chakra-ui/react";

export interface ChatInputProps {
  value: string;
  onChange: (_: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
}

export const ChatInput = ({ value, onChange, onSend, ...props }: ChatInputProps & StyleProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && value) {
      onSend();
    }
  };

  return (
    <HStack w="100%" {...props}>
      <Input
        placeholder="Say Something!"
        backgroundColor="neon.700"
        p="0 12px"
        _hover={{
          backgroundColor: "neon.600",
        }}
        _focus={{
          backgroundColor: "neon.600",
        }}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      <Button p="0 6px" isDisabled={!value} onClick={onSend}>
        <SendMessage size="lg" />
      </Button>
    </HStack>
  );
};
