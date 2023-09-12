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
} from "@chakra-ui/react";
import Input from "@/components/Input";

import React, { useCallback, useState } from "react";
import { Avatar } from "./avatar/Avatar";
import { genAvatarFromAddress } from "./avatar/avatars";
import colors from "@/theme/colors";
import { Score, useGlobalScores } from "@/dojo/components/useGlobalScores";
import { useDojo } from "@/dojo";
import { useRouter } from "next/router";
import { formatCash } from "@/utils/ui";
import { useSystems } from "@/dojo/systems/useSystems";

const Leaderboard = ({
  nameEntry,
  ...props
}: { nameEntry?: boolean } & StyleProps & ListProps) => {
  const router = useRouter();
  const gameId = router.query.gameId as string;
  const { account } = useDojo();
  const { scores, refetch } = useGlobalScores();
  const { setName: submitSetName, isPending } = useSystems();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [overlayDimiss, setOverlayDismiss] = useState(true);
  const [targetGameId, setTargetGameId] = useState<string>("");
  const [name, setName] = useState<string>("");

  const onSubmitName = useCallback(async () => {
    if (!name) return;

    setOverlayDismiss(false);
    await submitSetName(targetGameId, name);
    await refetch();
    setOverlayDismiss(true);

    onClose();
  }, [name, targetGameId, onClose, refetch, submitSetName]);

  if (!scores) {
    return <></>;
  }

  return (
    <>
      <UnorderedList boxSize="full" variant="dotted" {...props}>
        {scores ? (
          scores
            ?.sort((a, b) => b.cash - a.cash)
            .map((score, index) => {
              const isOwn = score.address === account?.address;
              const color = isOwn
                ? colors.yellow["400"].toString()
                : colors.neon["200"].toString();
              const avatarColor = isOwn ? "yellow" : "green";
              const displayName = score.name
                ? `${score.name}${isOwn ? " (you)" : ""}`
                : "Anonymous";

              return (
                <ListItem
                  color={color}
                  key={index}
                  cursor={isOwn && !score.name ? "pointer" : "auto"}
                  onClick={() => {
                    if (!isOwn || score.name) return;

                    setTargetGameId(score.gameId);
                    onOpen();
                  }}
                >
                  <HStack mr={3}>
                    <Text
                      w="30px"
                      flexShrink={0}
                      display={["none", "block"]}
                      whiteSpace="nowrap"
                    >
                      {index + 1}.
                    </Text>
                    <Box flexShrink={0} style={{ marginTop: "-8px" }}>
                      <Avatar
                        name={genAvatarFromAddress(score.address)}
                        color={avatarColor}
                        hasCrown={index === 0}
                      />
                    </Box>

                    <HStack>
                      <Text
                        flexShrink={0}
                        maxWidth={["150px", "350px"]}
                        whiteSpace="nowrap"
                        overflow="hidden"
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
                    <Text flexShrink={0}>{formatCash(score.cash)}</Text>
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
      <Modal
        closeOnOverlayClick={overlayDimiss}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            textTransform="uppercase"
            fontWeight="400"
          >
            Name Entry
          </ModalHeader>
          <ModalBody py="10px">
            <Input
              placeholder="Enter your name"
              px="10px"
              border="2px"
              borderColor="neon.500"
              maxLength={31}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Text
              w="full"
              align="center"
              color="red"
              visibility={name.length === 31 ? "visible" : "hidden"}
            >
              Max 31 characters
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onSubmitName} isLoading={isPending} w="full">
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Leaderboard;
