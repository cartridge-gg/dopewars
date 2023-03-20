import React, { ReactNode } from "react";
import { Box, BoxProps } from "@chakra-ui/react";

interface PillProps extends BoxProps {
  children: ReactNode;
  color?: string;
}

const Pill: React.FC<PillProps> = ({ children, color = "rgba(255, 255, 255, 0.2)", ...rest }) => {
  return (
    <Box
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      px="10px"
      borderRadius="16px"
      backgroundColor={color}
      fontSize="14px"
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Pill;
