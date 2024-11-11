import { HStack, Spacer, StyleProps, Text } from "@chakra-ui/react";
import { useState } from "react";
import { ArrowInput } from "../icons";

interface InputNumberProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (_: number) => void;
}

export const InputNumber = ({ min = 0, max, step = 1, value, onChange, ...props }: InputNumberProps & StyleProps) => {
  const [isFlashed, setIsFlashed] = useState(false);

  const onClick = (newValue: number) => {
    setIsFlashed(true);
    onChange(newValue);
    setTimeout(() => {
      setIsFlashed(false);
    }, 200);
  };

  return (
    <HStack w="full" {...props}>
      <Text color={isFlashed ? "neon.900" : "neon.200"} backgroundColor={isFlashed ? "neon.200" : "transparent"}>
        {value}
      </Text>
      <Spacer />
      <ArrowInput
        size="md"
        cursor="pointer"
        disabled={max && value >= max ? true : false}
        onClick={() => onClick(value + step)}
      />
      <ArrowInput
        size="md"
        direction="down"
        cursor="pointer"
        disabled={value <= min ? true : false}
        onClick={() => onClick(value - step)}
      />
    </HStack>
  );
};
