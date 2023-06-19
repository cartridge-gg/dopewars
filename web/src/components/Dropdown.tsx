import { HStack, Spacer, StyleProps, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { ArrowInput } from "./icons";

export interface DropdownOptionProps {
  label?: string;
  text: string;
  value: number|string;
}

export interface DropdownProps {
  options: DropdownOptionProps[],
  value: DropdownOptionProps,
}

export const Dropdown = ({
  options,
  value,
  ...props
}: DropdownProps & StyleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value);

  const toggleOpen = () => setIsOpen(!isOpen);

  const onOptionClicked = (value: DropdownOptionProps) => () => {
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
        <ArrowInput
          direction="down"
          size="md"
        />
      </HStack>
      {isOpen && (
        <VStack position="absolute" w="full" p="4px" backgroundColor="neon.700">
          <VStack w="full" gap="2px" backgroundColor="neon.600">
            {/* Selected option */}
            {options.map(option => (
              option.value === selectedOption.value && (
                <DropdownOption option={option} active onClick={onOptionClicked(option)} key={option.value} />
              )
            ))}
            {/* Other options */}
            {options.map(option => (
              option.value != selectedOption.value && (
                <DropdownOption option={option} onClick={onOptionClicked(option)} key={option.value} />
              )
            ))}
          </VStack>
        </VStack>
      )}
    </VStack>
  )
}

const DropdownOption = ({ 
  active,
  option,
  onClick,
}: {
  active?: boolean;
  option: DropdownOptionProps;
  onClick?: () => void;
}) => (
  <HStack 
    role="group"
    w="full"
    p="12px 6px"
    gap="8px"
    color={active ? 'neon.200' : 'neon.500'}
    backgroundColor="neon.700"
    _hover={{
      color: 'neon.900',
      backgroundColor: 'neon.200'
    }}
    onClick={onClick}
  >
    <Text>{option.text}</Text>
    {option.label && (
      <Text color={active ? 'yellow.400' : 'neon.500'} _groupHover={{ color: 'neon.900' }}>{option.label}</Text>
    )}
  </HStack>
)
