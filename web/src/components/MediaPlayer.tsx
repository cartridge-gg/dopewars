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
  BoxProps,
} from "@chakra-ui/react";
import React, { ReactNode, useEffect, useState } from "react";
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
  }, [clicked]);

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

const MediaPlayer = ({ ...props }: StyleProps) => {
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
      mr={3}
      borderRadius={6}
      bg={{ md: "neon.700" }}
      overflow="hidden"
      _hover={{
        lg: {
          ".mediaplayer-status": {
            transform: "translateY(-36px)",
          },
          ".mediaplayer-commands": {
            transform: "translateY(-36px)",
          },
        },
      }}
      css={{
        ".mediaplayer-status,.mediaplayer-commands": {
          transition: "all .2s",
        },
      }}
    >
      <Box
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
          <ClickFeedback>
            <Backward onClick={backward} />
          </ClickFeedback>

          <ClickFeedback>
            {mediaStore.isPlaying ? (
              <Pause onClick={pause} />
            ) : (
              <Play onClick={play} />
            )}
          </ClickFeedback>

          <ClickFeedback>
            <Forward onClick={forward} />
          </ClickFeedback>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default MediaPlayer;
