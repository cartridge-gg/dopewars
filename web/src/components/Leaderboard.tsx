import {
  StyleProps,
  Text,
  HStack,
  UnorderedList,
  Box,
  Button,
  ListItem,
  ListProps,
  Modal,
  ModalOverlay,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  VStack,
} from "@chakra-ui/react";
import Input from "@/components/Input";

import React, { useCallback, useState, useEffect, useRef } from "react";
import { Avatar } from "./avatar/Avatar";
import { genAvatarFromId } from "./avatar/avatars";
import colors from "@/theme/colors";
import { Score, useGlobalScoresIninite } from "@/dojo/queries/useGlobalScores";
import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { useRouter } from "next/router";
import { formatCash } from "@/utils/ui";
import { Skull } from "./icons";

const Leaderboard = ({ nameEntry, ...props }: { nameEntry?: boolean } & StyleProps & ListProps) => {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { account } = useDojoContext();
  const { scores, refetch, hasNextPage, fetchNextPage } = useGlobalScoresIninite(undefined, 10);

  const [targetGameId, setTargetGameId] = useState<string>("");
  const [name, setName] = useState<string>("");

  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;
    const lastEl = listRef.current["lastElementChild"];
    // @ts-ignore
    lastEl && lastEl.scrollIntoView({ behavior: "smooth" });
  }, [scores]);

  if (!scores) {
    return <></>;
  }

  return (
    <>
      <VStack w="full" h="100%">
        <UnorderedList
          boxSize="full"
          variant="dotted"
          h="auto"
          maxH="calc(100% - 50px)"
          overflowY= "scroll"
          ref={listRef}
        >
          {scores ? (
            scores.map((score, index) => {
              const isOwn = score.address === account?.address;
              const color = isOwn ? colors.yellow["400"].toString() : colors.neon["200"].toString();
              const avatarColor = isOwn ? "yellow" : "green";
              const displayName = score.name ? `${score.name}${isOwn ? " (you)" : ""}` : "Anonymous";

              return (
                <ListItem color={color} key={index} cursor={isOwn && !score.name ? "pointer" : "auto"}>
                  <HStack mr={3}>
                    <Text
                      w={["10px", "30px"]}
                      fontSize={["10px", "16px"]}
                      flexShrink={0}
                      // display={["none", "block"]}
                      whiteSpace="nowrap"
                    >
                      {index + 1}.
                    </Text>
                    <Box flexShrink={0} style={{ marginTop: "-8px" }}>
                      {/* {score.dead ? (
                        <Skull color={avatarColor} hasCrown={index === 0} />
                      ) : ( */}
                      <Avatar name={genAvatarFromId(score.avatarId)} color={avatarColor} hasCrown={index === 0} />
                      {/* )} */}
                    </Box>

                    <HStack>
                      <Text
                        flexShrink={0}
                        maxWidth={["150px", "350px"]}
                        whiteSpace="nowrap"
                        overflow="hidden"
                        fontSize={["12px", "16px"]}
                      >
                        {displayName}
                      </Text>
                    </HStack>
                  
                    <Text
                      backgroundImage={`radial-gradient(${color} 20%, transparent 20%)`}
                      backgroundSize="10px 10px"
                      backgroundPosition="left center"
                      backgroundRepeat="repeat-x"
                      flexGrow={1}
                      color="transparent"
                    >
                      {"."}
                    </Text>
                    <Text flexShrink={0} fontSize={["12px", "16px"]}>
                      {formatCash(score.cash)}
                    </Text>
                  </HStack>
                </ListItem>
              );
            })
          ) : (
            <Text textAlign="center" color="neon.500">
              No scores submitted yet
            </Text>
          )}
        </UnorderedList>
        {hasNextPage && (
          <Button variant="pixelated" onClick={() => fetchNextPage()}>
            Load More
          </Button>
        )}
      </VStack>
    </>
  );
};

export default Leaderboard;
