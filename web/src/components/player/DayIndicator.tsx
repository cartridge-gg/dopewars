import { HStack, StyleProps, Text } from "@chakra-ui/react";
import { Calendar } from "../icons/archive";

export const DayIndicator = ({ day, max, ...props }: { day: number; max?: number } & StyleProps) => {
  return (
    <HStack {...props}>
      <Calendar />{" "}
      <Text>
        {day}
        {max && `/${max}`}
      </Text>
    </HStack>
  );
};
