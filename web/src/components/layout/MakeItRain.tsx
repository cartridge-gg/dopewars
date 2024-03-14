import { Acid, Cocaine, Heroin, Ketamine, Ludes, Shrooms, Speed, Weed } from "@/components/icons/drugs";
import { Box, StyleProps, keyframes } from "@chakra-ui/react";

const fallingAnim = keyframes`
  0% {
    opacity: 1;
    transform: translate(0, -100%) rotateZ(0deg);
  }

  50% {
    opacity: 1;
  }

  75% {
    opacity: 0.8;
    transform: translate(100px, 75vh) rotateZ(270deg);
  }

  100% {
    opacity: 0;
    transform: translate(150px, 100vh) rotateZ(360deg);
  }
`;

const drugs = [Acid, Cocaine, Heroin, Ludes, Speed, Weed, Shrooms, Ketamine];

const FallingStuff = ({ duration = 6 }) => {
  const randSize = 32 + Math.floor(Math.random() * 32);
  const dOffset = duration / 10;
  return (
    <Box
      position="absolute"
      left={`${Math.random() * 100}%`}
      top={`-${Math.random() * 25}%`}
      animation={`${fallingAnim} infinite ${duration}s linear`}
      userSelect="none"
      pointerEvents="none"
      transform="translate3d(0, -100%, 0)"
      css={{
        animationPlayState: "running",
        "&:nth-of-type(5n + 5)": { animationDelay: `${dOffset * 1.3}s` },
        "&:nth-of-type(3n + 2)": { animationDelay: `${dOffset * 1.8}s` },
        "&:nth-of-type(2n + 5)": { animationDelay: `${dOffset * 2.7}s` },
        "&:nth-of-type(3n + 10)": { animationDelay: `${dOffset * 3.8}s` },
        "&:nth-of-type(7n + 2)": { animationDelay: `${dOffset * 4.9}s` },
        "&:nth-of-type(4n + 5)": { animationDelay: `${dOffset * 5.5}s` },
        "&:nth-of-type(3n + 7)": { animationDelay: `${dOffset * 7.5}s` },
      }}
    >
      {drugs[Math.floor(Math.random() * drugs.length)]({
        w: `${randSize}px`,
        h: `${randSize}px`,
      })}
    </Box>
  );
};

export const MakeItRain = ({ count = 42, ...props }: { count?: number } & StyleProps) => (
  <Box position="fixed" w="100%" height="100%" zIndex={999} bg="transparent" pointerEvents="none">
    {[...Array(count)].map((_, i) => (
      <FallingStuff key={i} duration={3 + Math.ceil(Math.random() * 5)} />
    ))}
  </Box>
);
