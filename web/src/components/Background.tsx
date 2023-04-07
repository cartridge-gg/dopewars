import { Box } from "@chakra-ui/react";
import { RyoLogo } from "./logos/Ryo";

const Background = () => {
  return (
    <Box position="fixed" top="0" left="0" height="full" width="full">
      <RyoLogo position="fixed" top="0" left="0" />
      <svg xmlns="http://www.w3.org/2000/svg" height="full" width="full">
        <pattern id="p" width="100" height="80" patternUnits="userSpaceOnUse">
          <g
            style={{
              fill: "#313332",
              stroke: "black",
              strokeWidth: "2px",
            }}
          >
            <rect width="100" height="40" />
            <rect x="-50" y="40" width="100" height="40" />
            <rect x="50" y="40" width="100" height="40" />
            <rect y="80" width="100" height="40" />
          </g>
        </pattern>
        <rect fill="url(#p)" width="100%" height="100%" />
      </svg>
    </Box>
  );
};

export default Background;
