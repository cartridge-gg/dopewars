import { Box } from "@chakra-ui/react";
import { Global } from "@emotion/react";

export const OG = ({ id }: { id: number }) => {
  return (
    <>
      <Global
        styles={`
        @keyframes walk {
            0% {
                background-position: 0px 0px;
            }
            100% {
                background-position: -2400px 0px;
            }
        }
        `}
      />
      <Box
        display="block"
        position="absolute"
        w="300px"
        h="300px"
        css={{
          imageRendering: "pixelated",
     
          background: `url(https://api.dopewars.gg/hustlers/${id}/sprites/composite.png) 0% 0% / auto 800%`,
          animation: "walk 1s steps(8) infinite",
        }}
      ></Box>
    </>
  );
};
