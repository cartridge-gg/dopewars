import { HStack, StyleProps, Text } from "@chakra-ui/react"
import Input from "@/components/Input"
import Button from "./Button"
import { SendMessage } from "@/components/icons"

export interface ChatInputProps {
  value: string;
  onChange: (_: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
}

export const ChatInput = ({
  value,
  onChange,
  onSend,
  ...props
}: ChatInputProps & StyleProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && value) {
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
          backgroundColor: 'neon.600'
        }}
        _focus={{
          backgroundColor: 'neon.600'
        }}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      <Button 
        p="0 6px"
        isDisabled={!value}
        onClick={onSend}
      >
        <SendMessage size="lg" />
      </Button>
    </HStack>
  )
}