import React from "react";
import { Icon, useStyleConfig } from "@chakra-ui/react";

const Wallet = (props: any) => {
  const { variant, size, ...rest } = props;
  const styles = useStyleConfig("Icon", { variant, size });

  return (
    <Icon viewBox="0 0 16 14" __css={styles} fill="currentColor" {...rest}>
      <path d="M0.75 0H0V0.75V13.25V14H0.75H15.25H16V13.25V3.75V3H15.25H3.75H3V4.5H3.75H14.5V12.5H1.5V1.5H14.25H15V0H14.25H0.75ZM12 9.5C12.2652 9.5 12.5196 9.39464 12.7071 9.20711C12.8946 9.01957 13 8.76522 13 8.5C13 8.23478 12.8946 7.98043 12.7071 7.79289C12.5196 7.60536 12.2652 7.5 12 7.5C11.7348 7.5 11.4804 7.60536 11.2929 7.79289C11.1054 7.98043 11 8.23478 11 8.5C11 8.76522 11.1054 9.01957 11.2929 9.20711C11.4804 9.39464 11.7348 9.5 12 9.5Z" />
    </Icon>
  );
};

export default Wallet;
