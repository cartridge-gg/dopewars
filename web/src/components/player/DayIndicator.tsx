import { StyleProps, HStack, Text, VStack } from "@chakra-ui/react";

import { ReactNode } from "react";
import { Calendar } from "../icons/archive";

const DayIndicator = ({ day, ...props }: { wanted: number } & StyleProps) => {
  return (
      <HStack
      
        {...props}
      >
        <Calendar /> <Text>{day}</Text>
      </HStack>
  );
};

export default DayIndicator;
