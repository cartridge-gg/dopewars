import { StyleProps, Box } from "@chakra-ui/react";

const Dot = ({ active, onClick, ...props }: { active: boolean; onClick: () => void } & StyleProps) => (
  <Box onClick={onClick} cursor={"pointer"} {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {active ? (
        <Box
          as="path"
          d="M5.99667 2V2.99917H3.99833V3.99833H2.99917V5.99667H2V10.0033H2.99917V12.0017H3.99833V13.0008H5.99667V14H10.0033V13.0008H12.0017V12.0017H13.0008V10.0033H14V5.99667H13.0008V3.99833H12.0017V2.99917H10.0033V2H5.99667Z"
          fill="neon.200"
        />
      ) : (
        <Box
          as="path"
          d="M6.66445 4V4.66611H5.33222V5.33222H4.66611V6.66445H4V9.33555H4.66611V10.6678H5.33222V11.3339H6.66445V12H9.33555V11.3339H10.6678V10.6678H11.3339V9.33555H12V6.66445H11.3339V5.33222H10.6678V4.66611H9.33555V4H6.66445Z"
          fill="neon.500"
        />
      )}
    </svg>
  </Box>
);

export default Dot;
