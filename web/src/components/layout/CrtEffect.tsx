import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

//#121010
export const CrtEffect = () => {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      boxSize="full"
      pointerEvents="none"
      // zIndex="overlay"
      zIndex={2600}
      sx={{
        filter: "saturate(1) brightness(1) contrast(1.2)",
      }}
      // flicker
      _after={{
        content: '""',
        position: "absolute",
        top: "0",
        left: "0",
        boxSize: "full",
        background: "rgba(18, 16, 16, 0.06)",
        opacity: 0,
        zIndex: "overlay",
        pointerEvents: "none",
        // performance issues ?
        // animation: `${flicker} 0.1s infinite`,
      }}
      //scanlines
      _before={{
        content: '""',
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        background:
          "linear-gradient(rgba(0,0,0,0) 50%, rgba(20, 20, 20, 0.2) 10%), linear-gradient(90deg ,rgba(255, 0, 0, 0.06),rgba(0, 255, 0, 0.03),rgba(0,0,255,0.01))",
        zIndex: "overlay",
        backgroundSize: "100% 2px, 3px 100%",
        pointerEvents: "none",
      }}
    />
  );
};

const flicker = keyframes`
  0% {
    opacity: 0.7;
  }
  10% {
    opacity: 0.7;
  }
  20% {
    opacity: 0.9;
  }
  30% {
    opacity: 0.5;
  }
  40% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.7;
  }
  60% {
    opacity: 0.5;
  }
  70% {
    opacity: 0.5;
  }
  80% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.9;
  }
  100% {
    opacity: 0.6;
  }`;


