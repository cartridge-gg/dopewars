import { HStack, StyleProps, Text } from "@chakra-ui/react";

import { IsMobile } from "@/utils/ui";
import { Calendar } from "../icons/archive";

export const DayIndicator = ({ day, max, ...props }: { day: number; max?: number } & StyleProps) => {
  return (
    <HStack {...props}>
      <Calendar />{" "}
      <Text>
        {day}{!IsMobile() && max && `/${max}`}
      </Text>
    </HStack>
  );
};
