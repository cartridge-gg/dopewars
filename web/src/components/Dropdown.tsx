import { HStack, Spacer, StyleProps, Text, VStack } from "@chakra-ui/react"
import { useState } from "react";
import { ArrowEnclosed } from "./icons";

export interface DropdownOption {
  label?: string;
  text: string;
  value: number|string;
}

export interface DropdownProps {
  options: DropdownOption[],
  value: DropdownOption,
}

export const Dropdown = ({
  options,
  value,
  ...props
}: DropdownProps & StyleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value);

  const toggleOpen = () => setIsOpen(!isOpen);

  const onOptionClicked = (value: DropdownOption) => () => {
    setSelectedOption(value);
    setIsOpen(false);
  };

  return (
    <VStack position="relative" {...props}>
      <HStack w="full" onClick={toggleOpen}>
        <Text>{selectedOption.text}</Text>
        {selectedOption.label && (
          <Text color="yellow.400">{selectedOption.label}</Text>
        )}
        <Spacer />
        <ArrowEnclosed 
          variant="caret"
          direction="down"
          size="sm"
        />
      </HStack>
      {isOpen && (
        <VStack position="absolute" w="full" p="4px" backgroundColor="neon.700">
          <VStack w="full" gap="2px" backgroundColor="neon.600">
            {options.map(option => (
              <HStack 
                role="group"
                w="full"
                p="12px 6px"
                gap="8px"
                backgroundColor="neon.700"
                _hover={{
                  color: 'neon.900',
                  backgroundColor: 'neon.200'
                }}
                onClick={onOptionClicked(option)}
                key={option.value}
              >
                <Text>{option.text}</Text>
                {option.label && (
                  <Text color="yellow.400" _groupHover={{ color: 'neon.900' }}>{option.label}</Text>
                )}
              </HStack>
            ))}
          </VStack>
        </VStack>
      )}
    </VStack>
  )
}