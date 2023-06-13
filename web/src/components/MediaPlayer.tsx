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
  /* to {
    transform: translateX(-50%);
  } */
  0% {
    left: 0%;
  }
  100% {
    left: -100%
  }
`;

// https://codepen.io/girish/pen/dgWqBr
const MediaPlayer = ({ ...props }: StyleProps /*& ButtonProps*/) => {
  const mediaStore = useMediaStore();
  const songTitle = mediaStore.medias[mediaStore.currentIndex]?.name || "LOADING ...";

  useEffect(() => {
    const init = async () => {
      await initMediaStore();
    };
    init();
  }, []);

  return (
    <VStack
      w="140px"
      h="36px"
      alignItems="normal"
      spacing={0}
      mr={3}
      borderRadius={6}
      bg={"neon.700"}
      overflow="hidden"
      _hover={{
        ".mediaplayer-status": {
          transform: "translateY(-36px)",
        },
        ".mediaplayer-commands": {
          transform: "translateY(-36px)",
        },
      }}
      css={{
        ".mediaplayer-status,.mediaplayer-commands": {
          transition: "all .2s",
        },
      }}
    >
      <Box
        // hidden="true"
        className="mediaplayer-status"
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

        <Box style={{ overflow: "hidden" }}>
          <Box
            animation={`${slideAnim} infinite 8s linear`}
            position="relative"
            whiteSpace="nowrap"
            userSelect="none"
          >
            {songTitle}
            {"     "}
            {songTitle}
          </Box>
        </Box>
      </Box>

      <Flex
        className="mediaplayer-commands"
        h="36px"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
        m={0}
      >
        <HStack alignItems="center" justifyContent="center">
          <Box
            cursor="pointer"
            borderRadius={"50%"}
            p={1}
            _hover={{ bg: "neon.600" }}
          >
            <Backward onClick={backward} />
          </Box>

          <Box
            cursor="pointer"
            borderRadius={"50%"}
            _hover={{ bg: "neon.600" }}
            p={1}
          >
            {mediaStore.isPlaying ? (
              <Pause onClick={pause} />
            ) : (
              <Play onClick={play} />
            )}
          </Box>
          <Box
            cursor="pointer"
            borderRadius={"50%"}
            _hover={{ bg: "neon.600" }}
            p={1}
          >
            <Forward onClick={forward} />
          </Box>
        </HStack>
      </Flex>
    </VStack>
  );
};

export default MediaPlayer;
