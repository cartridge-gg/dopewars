import { VStack, Heading, Text, Flex, Image, StyleProps, Container, Box, Button, Spacer } from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState, ReactNode }from "react";
import { useRouter } from "next/router";
import Header from "./Header";
import { motion } from "framer-motion";

import CrtEffect from "./CrtEffect";
import { Footer } from "./Footer";
import { IsMobile } from "@/utils/ui";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { useSystems } from "@/dojo/hooks/useSystems";

export interface LayoutProps {
  CustomLeftPanel?: React.FC;
  leftPanelProps?: LeftPanelProps;
  showBack?: boolean;
  children: ReactNode;
  isSinglePanel?: boolean;
  footer?: ReactNode;
  rigthPanelMaxH?: string;
  rigthPanelScrollable?: boolean;
}

export interface LeftPanelProps {
  title: string;
  prefixTitle?: string;
  imageSrc?: string;
  map?: ReactNode;
}

const Layout = ({
  CustomLeftPanel,
  leftPanelProps,
  showBack,
  children,
  isSinglePanel = false,
  rigthPanelMaxH,
  rigthPanelScrollable = true,
  footer,
}: LayoutProps) => {
  const { playerEntityStore } = useDojoContext();
  const { decide, isPending } = useSystems();
  const { playerEntity } = playerEntityStore;
  const [isUserTrippin, setIsUserTrippin] = useState(false);
  const defaultBg = "gray.100"; // A standard, non-trippy background
  const trippyBg = "linear-gradient(45deg, #ff6fd8, #d783ff, #8a78ff, #78cdff)"; 

  const container = (

<Container position="relative" px={["10px", "16px"]} py="16px">
{!isSinglePanel &&
(!CustomLeftPanel ? <LeftPanel {...leftPanelProps} /> : <CustomLeftPanel /*{...leftPanelProps}*/ />)}
<RightPanel
flex={[!!leftPanelProps?.map ? "0" : "1", "1"]}
footer={footer}
isSinglePanel={isSinglePanel}
rigthPanelMaxH={rigthPanelMaxH}
rigthPanelScrollable={rigthPanelScrollable}
>
{children}
</RightPanel>
</Container>
  )

  useEffect(() => {
    if (playerEntity && !isPending) {
      setIsUserTrippin(playerEntity.isDrugged);
    }
  }, [playerEntity, isPending]);


  return (
    <>
      <Flex
        direction="column"
        position="fixed"
        boxSize="full"
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1}}
        bg={isUserTrippin ? trippyBg : defaultBg}
        bgSize="300% 300%" // Enlarge background size for better gradient effect
        style={{
          backgroundSize: '300% 300%',
          animation: isUserTrippin ? 'slide 15s linear infinite' : 'none',
        }}

      >
        {isUserTrippin ? (
                    <motion.div
                    animate={{
                      x: ["0%", "3%", "0%", "-3%", "0%"],
                      filter: [
                        "hue-rotate(0deg) brightness(120%)",
                        "hue-rotate(60deg) brightness(100%)",
                        "hue-rotate(180deg) brightness(180%)",
                        "hue-rotate(300deg) brightness(150%)",
                        "hue-rotate(240deg) brightness(140%)",
                        "hue-rotate(120deg) brightness(200%)",
                        "hue-rotate(360deg) brightness(100%)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      ease: "linear",
                      times: [0, 0.25, 0.5, 0.75, 1],
                      repeat: Infinity,
                      repeatDelay: 0
                    }}
                  >
        <Header back={showBack} />
        </motion.div>
        ) : (
        <Header back={showBack} />
        )}
        {isUserTrippin ? 
        (
          <motion.div
          animate={{
            scale: [1, 1.05, 1.1, 1.05, 1],
            x: ["0%", "3%", "0%", "-3%", "0%"],
            filter: [
              "hue-rotate(0deg) brightness(100%)",
              "hue-rotate(60deg) brightness(120%)",
              "hue-rotate(180deg) brightness(150%)",
              "hue-rotate(300deg) brightness(180%)",
              "hue-rotate(240deg) brightness(200%)",
              "hue-rotate(120deg) brightness(140%)",
              "hue-rotate(360deg) brightness(100%)"
            ]
          }}
          transition={{
            duration: 3,
            ease: "linear",
            times: [0, 0.25, 0.5, 0.75, 1],
            repeat: Infinity,
            repeatDelay: 0
          }}
        >
       {container}
       </motion.div>

 ) : (container)}
        {/* <Box maxH="30px" h="full" display={["none", "block"]} bg="neon.900" zIndex={1} /> */}
      </Flex>
      <CrtEffect />
    </>
  );
};

const LeftPanel = ({ title, prefixTitle, map, imageSrc, ...props }: Partial<LeftPanelProps> & StyleProps) => {
  return (
    <VStack flex={["0", "1"]} my={["none", "auto"]} {...props}>
      <VStack zIndex="1" position={map ? "absolute" : "unset"} pointerEvents="none" spacing="0">
        <Text textStyle="subheading" textAlign="center" fontSize={["9px", "11px"]}>
          {prefixTitle}
        </Text>
        <Heading fontSize={["36px", "48px"]} textAlign="center" fontWeight="normal">
          {title}
        </Heading>
      </VStack>
      {map ? (
        <Flex w="100%">{map}</Flex>
      ) : (
        <Image src={imageSrc} maxH="60vh" h="500px" objectFit="contain" pt="60px" display={["none", "block"]} alt="context" />
      )}
    </VStack>
  );
};

const RightPanel = ({
  children,
  footer,
  isSinglePanel,
  rigthPanelMaxH,
  rigthPanelScrollable,
  ...props
}: {
  children: ReactNode;
  footer: ReactNode;
  isSinglePanel: boolean;
  rigthPanelMaxH?: string;
  rigthPanelScrollable: boolean;
} & StyleProps) => {
  const isMobile = IsMobile();
  return (
    <VStack position="relative" w="full" {...props}>
      <VStack
        position="relative"
        flex="1"
        overflowY={rigthPanelScrollable ? "scroll" : "hidden"}
        __css={{
          "scrollbar-width": "none",
        }}
        w="full"
        maxH={rigthPanelMaxH ? rigthPanelMaxH : isSinglePanel ? "calc(100vh - 70px)" : "calc(100vh - 145px)"}
      >
        {children}
        {!isSinglePanel && rigthPanelScrollable && (
          <Box display="block" minH={isMobile ? "170px" : "90px"} h={isMobile ? "170px" : "90px"} w="full" />
        )}
      </VStack>
      {footer}
    </VStack>
  );
};

export default Layout;
