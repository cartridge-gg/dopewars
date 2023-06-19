import {
  Button as ChakraButton,
  ButtonProps,
  StyleProps,
  Text,
  Box,
  keyframes,
  HStack,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { ReactNode, useEffect } from "react";
import { Note, Play, Pause, Backward, Forward } from "./icons";
import {
  initMediaStore,
  play,
  pause,
  useMediaStore,
  backward,
  forward,
} from "@/hooks/media";

const slideAnim = keyframes`  
  0% {transform: translateX( 0%);}
  100% {transform: translateX(-100%);}
`;

// https://codepen.io/girish/pen/dgWqBr
const MediaPlayer = ({ ...props }: StyleProps /*& ButtonProps*/) => {
  const mediaStore = useMediaStore();
  const songTitle =
    mediaStore.medias[mediaStore.currentIndex]?.name || "LOADING ...";

  useEffect(() => {
    const init = async () => {
      await initMediaStore();
    };
    init();
  }, []);

  return (
    <Flex
      w={{ base: "300px", md: "140px" }}
      h="36px"
      direction={{ base: "row", md: "column" }}
      alignItems="normal"
      // spacing={0}
      className={mediaStore.isPlaying ? "mediaplayer-playing" : "mediaplayer-paused"}
      mr={3}
      borderRadius={6}
      bg={{ md: "neon.700" }}
      overflow="hidden"
      _hover={{
        lg: {
          ".mediaplayer-status, .mediaplayer-commands": {
            transform: "translateY(-36px)",
          },
        },
      }}
      sx={{
        ".mediaplayer-status,.mediaplayer-commands": {
          transition: "all .2s",
        },
        "&.mediaplayer-paused": {
          ".mediaplayer-status, .mediaplayer-commands": {
            md:{
              transform: "translateY(-36px)",
            }
          }
         }
      }}
    >
      <Box
        // hidden="true"
        className="mediaplayer-status"
        w="140px"
        h="36px"
        display="flex"
        flexDirection="row"
        flexShrink={0}
        overflow="hidden"
        alignItems="center"
        m={0}
      >
        <Box>
          <Note m={1} />
        </Box>

        <Flex
          direction="row"
          overflow="hidden"
          whiteSpace="nowrap"
          userSelect="none"
        >
          <Box
            animation={`${slideAnim} infinite 8s linear`}
            position="relative"
            pl={6}
          >
            {songTitle}
          </Box>
          <Box
            animation={`${slideAnim} infinite 8s linear`}
            position="relative"
            pl={6}
          >
            {songTitle}
          </Box>
        </Flex>
      </Box>

      <Flex
        className="mediaplayer-commands"
        h="36px"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
        m={0}
        ml={{ base: "30px", md: "0" }}
      >
        <HStack alignItems="center" justifyContent="center">
          <Box cursor="pointer" p={1} _hover={{ bg: "neon.600" }}>
            <Backward onClick={backward} />
          </Box>

          <Box cursor="pointer" p={1} _hover={{ bg: "neon.600" }}>
            {mediaStore.isPlaying ? (
              <Pause onClick={pause} />
            ) : (
              <Play onClick={play} />
            )}
          </Box>
          <Box cursor="pointer" p={1} _hover={{ bg: "neon.600" }}>
            <Forward onClick={forward} />
          </Box>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default MediaPlayer;
