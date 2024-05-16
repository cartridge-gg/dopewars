import { backward, forward, initMediaStore, pause, play, useMediaStore, volume } from "@/hooks/media";
import { generatePixelBorderPath } from "@/utils/ui";
import {
  Box,
  BoxProps,
  Flex,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  StyleProps,
  VStack,
  keyframes,
} from "@chakra-ui/react";
import React, { ReactNode, useEffect, useState } from "react";
import { Backward, Forward, Note, Pause, Play, Volume } from "../icons";

const slideAnim = keyframes`  
  0% {transform: translateX( 0%);}
  100% {transform: translateX(-100%);}
`;

const ClickFeedback = ({
  children,
  duration = 200,
  ...props
}: { children: ReactNode; duration?: number } & StyleProps & BoxProps) => {
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    if (clicked) {
      setTimeout(() => {
        setClicked(false);
      }, duration);
    }
  }, [clicked, duration]);

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setClicked(true);
    props.onClick && props.onClick(e);
  };

  return (
    <Box
      p={1}
      cursor="pointer"
      {...props}
      bg={clicked ? "neon.600" : "transparent"}
      transitionDelay="0"
      onClick={onClick}
    >
      {children}
    </Box>
  );
};

export const MediaPlayer = ({ ...props }: StyleProps) => {
  const mediaStore = useMediaStore();
  const songTitle = mediaStore.medias[mediaStore.currentIndex]?.name || "LOADING ...";
  const height = "48px";

  useEffect(() => {
    const init = async () => {
      await initMediaStore();
    };
    init();
  }, []);

  return (
    <VStack w="auto">
      <Flex
        w="320px"
        h={height}
        direction="row"
        alignItems="normal"
        className={mediaStore.isPlaying ? "mediaplayer-playing" : "mediaplayer-paused"}
        borderRadius={6}
        bg="neon.700"
        overflow="hidden"
        sx={{
          ".mediaplayer-status,.mediaplayer-commands": {
            transition: "all .2s",
          },
        }}
        clipPath={`polygon(${generatePixelBorderPath()})`}
      >
        <Box
          className="mediaplayer-status"
          w="180px"
          h={height}
          display="flex"
          flexDirection="row"
          flexShrink={0}
          overflow="hidden"
          alignItems="center"
          m={0}
          // pr={4}
        >
          <Box>
            <Note m={1} />
          </Box>

          <Flex direction="row" overflow="hidden" whiteSpace="nowrap" userSelect="none">
            <Box position="relative" pl={6} animation={`${slideAnim} infinite 8s linear`} willChange="transform">
              {songTitle}
            </Box>
            <Box position="relative" pl={6} animation={`${slideAnim} infinite 8s linear`} willChange="transform">
              {songTitle}
            </Box>
          </Flex>
        </Box>

        <Flex
          className="mediaplayer-commands"
          h={height}
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          m={0}
          ml="10px"
        >
          <HStack alignItems="center" justifyContent="center">
            <ClickFeedback>
              <Backward onClick={backward} />
            </ClickFeedback>

            <ClickFeedback>{mediaStore.isPlaying ? <Pause onClick={pause} /> : <Play onClick={play} />}</ClickFeedback>

            <ClickFeedback>
              <Forward onClick={forward} />
            </ClickFeedback>
          </HStack>
        </Flex>
      </Flex>

      <HStack w="full" px={1}>
        <Volume />

        <Slider
          variant="small"
          min={0}
          max={1}
          step={0.05}
          value={mediaStore.volume}
          onChange={(e: number) => {
            volume(e);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </HStack>
    </VStack>
  );
};

// export const MediaPlayer = ({ ...props }: StyleProps) => {
//   const mediaStore = useMediaStore();
//   const songTitle =
//     mediaStore.medias[mediaStore.currentIndex]?.name || "LOADING ...";
//   const height = "48px";

//   useEffect(() => {
//     const init = async () => {
//       await initMediaStore();
//     };
//     init();
//   }, []);

//   return (
//     <Flex
//       w={{ base: "320px", md: "140px" }}
//       h={height}
//       direction={{ base: "row", md: "column" }}
//       alignItems="normal"
//       className={
//         mediaStore.isPlaying ? "mediaplayer-playing" : "mediaplayer-paused"
//       }
//       borderRadius={6}
//       bg={{ md: "neon.700" }}
//       overflow="hidden"
//       _hover={{
//         lg: {
//           ".mediaplayer-status, .mediaplayer-commands": {
//             transform: `translateY(-${height})`,
//           },
//         },
//       }}
//       sx={{
//         ".mediaplayer-status,.mediaplayer-commands": {
//           transition: "all .2s",
//         },
//         "&.mediaplayer-paused": {
//           ".mediaplayer-status, .mediaplayer-commands": {
//             md: {
//               transform: `translateY(-${height})`,
//             },
//           },
//         },
//       }}
//       clipPath={`polygon(${generatePixelBorderPath()})`}
//     >
//       <Box
//         className="mediaplayer-status"
//         w="140px"
//         h={height}
//         display="flex"
//         flexDirection="row"
//         flexShrink={0}
//         overflow="hidden"
//         alignItems="center"
//         m={0}
//         pr={4}
//       >
//         <Box>
//           <Note m={1} />
//         </Box>

//         <Flex
//           direction="row"
//           overflow="hidden"
//           whiteSpace="nowrap"
//           userSelect="none"
//         >
//           <Box
//             position="relative"
//             pl={6}
//             animation={`${slideAnim} infinite 8s linear`}
//             willChange="transform"
//           >
//             {songTitle}
//           </Box>
//           <Box
//             position="relative"
//             pl={6}
//             animation={`${slideAnim} infinite 8s linear`}
//             willChange="transform"
//           >
//             {songTitle}
//           </Box>
//         </Flex>
//       </Box>

//       <Flex
//         className="mediaplayer-commands"
//         h={height}
//         alignItems="center"
//         justifyContent="center"
//         flexShrink={0}
//         m={0}
//         ml={{ base: "30px", md: "0" }}
//       >
//         <HStack alignItems="center" justifyContent="center">
//           <ClickFeedback>
//             <Backward onClick={backward} />
//           </ClickFeedback>

//           <ClickFeedback>
//             {mediaStore.isPlaying ? (
//               <Pause onClick={pause} />
//             ) : (
//               <Play onClick={play} />
//             )}
//           </ClickFeedback>

//           <ClickFeedback>
//             <Forward onClick={forward} />
//           </ClickFeedback>
//         </HStack>
//       </Flex>
//     </Flex>
//   );
// };
