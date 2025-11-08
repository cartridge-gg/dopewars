import { useSystems } from "@/dojo/hooks";
import { formatCash } from "@/utils/ui";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  VStack,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { Claimable } from "./ClaimReward";
import { PaperIcon, Trophy } from "@/components/icons";
import { Dopewars_V0_Game as Game } from "@/generated/graphql";
import { HustlerIcon, Hustlers } from "@/components/hustlers";
import { num, shortString } from "starknet";
import { HustlerAvatarIcon } from "../profile/HustlerAvatarIcon";
import { RewardDetails } from "./Leaderboard";
import { useEffect, useState } from "react";
import { getSwapQuote, PAPER, USDC } from "@/hooks/useEkubo";

export const ClaimModal = ({
  claimable,
  claimableData,
  isOpen,
  onClose,
}: {
  claimable: Claimable;
  claimableData: Game[];
  isOpen: boolean;
  onClose: Function;
}) => {
  const { claim, isPending } = useSystems();
  const { account } = useAccount();
  const [usdValue, setUsdValue] = useState<number | null>(null);

  useEffect(() => {
    if (!claimable?.totalClaimable || !isOpen) {
      setUsdValue(null);
      return;
    }

    // Fetch PAPER to USDC conversion rate using 1000 PAPER for better slippage accuracy
    getSwapQuote(1000, PAPER, USDC, false)
      .then((quote) => {
        const usdPerPaper = quote.amountOut / 1000;
        const totalUsd = claimable.totalClaimable * usdPerPaper;
        setUsdValue(totalUsd);
      })
      .catch((e) => {
        console.error("Failed to fetch USD value:", e);
        setUsdValue(null);
      });
  }, [claimable?.totalClaimable, isOpen]);

  const onClaim = async () => {
    if (!account?.address) return;

    console.log(claimable.gameIds);
    const { hash } = await claim(account?.address, claimable.gameIds);

    if (hash != "") {
      onClose(true);
    } else {
      onClose(false);
    }
  };

  return (
    <>
      <Modal motionPreset="slideInBottom" isCentered isOpen={isOpen} onClose={() => onClose(false)}>
        <ModalOverlay />
        <ModalContent bg="bg.dark">
          <ModalHeader textAlign="center" pb={0}>
            CLAIM REWARDS
          </ModalHeader>
          <ModalBody py={6}>
            <VStack w="full" gap={6}>
              <Text textAlign="center" color="neon.500">
                Well done hustler, {claimable.gameIds.length} game(s) are eligible for rewards!
              </Text>

              <TableContainer
                position="relative"
                w="full"
                maxH="calc(100dvh - 300px)"
                overflow="hidden"
                overflowY="auto"
              >
                <Table size="sm">
                  <Thead position="sticky" top="0" bg="neon.900">
                    <Tr>
                      <Th isNumeric>RANK</Th>
                      <Th w="80%">Hustler</Th>

                      <Th isNumeric>Payout</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {claimableData.map((game, idx) => {
                      if (!game) return;

                      return (
                        <Tr key={idx} title={`season ${game.season_version}\ngame 0x${game.game_id.toString(16)}`}>
                          <Td isNumeric>{game.position}</Td>
                          <Td>
                            <HStack>
                              <HustlerAvatarIcon
                                gameId={game.game_id}
                                // @ts-ignore
                                tokenIdType={game.token_id_type}
                                // @ts-ignore
                                tokenId={game.token_id}
                                display="flex"
                                flexShrink={0}
                              />
                              <Text>{game.player_name as string}</Text>
                            </HStack>
                          </Td>
                          <Td>
                            <Tooltip
                              label={
                                <RewardDetails
                                  claimable={game.claimable}
                                  position={game.position}
                                  seasonVersion={game.season_version}
                                />
                              }
                              color="neon.400"
                              placement="right"
                              maxW="300px"
                            >
                              <span>
                                <Trophy />
                              </span>
                            </Tooltip>
                          </Td>
                          {/* <Td color="yellow.400" isNumeric>
                            {formatCash(game.claimable).replace("$", "")} <PaperIcon color="yellow.400" ml={1} />
                          </Td> */}
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>

              <VStack>
                <Text textAlign="center">TOTAL CLAIMABLE</Text>
                <HStack textAlign="center" color="yellow.400" fontSize="16px" gap={1} justifyContent="center">
                  <Text>
                    <PaperIcon color="yellow.400" /> {formatCash(claimable.totalClaimable).replace("$", "")} PAPER
                  </Text>
                  {usdValue !== null && (
                    <Text color="neon.500" fontSize="12px">
                      (${Math.abs(usdValue).toFixed(2)})
                    </Text>
                  )}
                </HStack>
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button w="full" isLoading={isPending} onClick={onClaim}>
              CLAIM
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
