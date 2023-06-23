import { HStack, Text } from "@chakra-ui/react"
import Input from "@/components/Input"
import Button from "./Button"
import { SendMessage } from "@/components/icons"

export const ChatInput = () => {
  return (
    <HStack w="100%">
      <Input 
        placeholder="Say Something!"
        backgroundColor="neon.600"
        p="0 12px"
      />
      <Button p="0 6px">
        <SendMessage size="lg" />
      </Button>
    </HStack>
  )
}