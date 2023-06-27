import { HStack, StyleProps } from "@chakra-ui/react"
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
  return (
    <HStack w="100%" {...props}>
      <Input 
        placeholder="Say Something!"
        backgroundColor="neon.600"
        p="0 12px"
        value={value}
        onChange={onChange}
      />
      <Button p="0 6px" onClick={onSend}>
        <SendMessage size="lg" />
      </Button>
    </HStack>
  )
}