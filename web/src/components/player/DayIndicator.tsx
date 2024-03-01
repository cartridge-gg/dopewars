import { HStack, StyleProps, Text } from "@chakra-ui/react";

import { Calendar } from "../icons/archive";

export const DayIndicator = ({ day, ...props }: { day: number } & StyleProps) => {
  return (
      <HStack
      
        {...props}
      >
        <Calendar /> <Text>{day}</Text>
      </HStack>
  );
};


