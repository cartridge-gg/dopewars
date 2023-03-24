import React from "react";
import { Icon, useStyleConfig } from "@chakra-ui/react";

const Road = (props: any) => {
  const { variant, size, ...rest } = props;
  const styles = useStyleConfig("Icon", { variant, size });

  return (
    <Icon viewBox="0 0 18 14" __css={styles} fill="currentColor" {...rest}>
      <path d="M8.05556 0.388885H4.27778L0.5 13.6111H8.05556V11.7222V10.7778H9.94444V11.7222V13.6111H17.5L13.7222 0.388885H9.94444V2.27777V3.22222H8.05556V2.27777V0.388885ZM9.94444 6.05555V7.94444V8.88889H8.05556V7.94444V6.05555V5.11111H9.94444V6.05555Z" />
    </Icon>
  );
};

export default Road;
