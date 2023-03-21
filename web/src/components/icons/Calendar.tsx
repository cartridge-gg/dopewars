import React from "react";
import { Icon, useStyleConfig } from "@chakra-ui/react";

const Calendar = (props: any) => {
  const { variant, size, ...rest } = props;
  const styles = useStyleConfig("Icon", { variant, size });

  return (
    <Icon viewBox="0 0 14 16" __css={styles} fill="currentColor" {...rest}>
      <path d="M4.75 0V0.75V2H9.25V0.75V0H10.75V0.75V2H14V4.5V6V14.5V16H12.5H1.5H0V14.5V6V4.5V2H3.25V0.75V0H4.75ZM12.5 6H1.5V14.5H12.5V6ZM7 8V12H3V8H7Z" />
    </Icon>
  );
};

export default Calendar;
