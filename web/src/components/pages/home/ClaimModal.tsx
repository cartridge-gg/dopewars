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
} from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";
import { Claimable } from "./ClaimReward";
import { PaperIcon } from "@/components/icons";
import { Dopewars_Game as Game } from "@/generated/graphql";
import { HustlerIcon, Hustlers } from "@/components/hustlers";
import { shortString } from "starknet";

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

  const onClaim = async () => {
    if (!account?.address) return;

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
                              <HustlerIcon hustler={game.hustler_id as Hustlers} />
                              <Text>{shortString.decodeShortString(game.player_name?.value)}</Text>
                            </HStack>
                          </Td>
                          <Td color="yellow.400" isNumeric>
                            {formatCash(game.claimable).replace("$", "")} <PaperIcon color="yellow.400" ml={1} />
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>

              <VStack>
                <Text textAlign="center">TOTAL CLAIMABLE</Text>
                <Text textAlign="center" color="yellow.400" fontSize="16px">
                  <PaperIcon color="yellow.400" /> {formatCash(claimable.totalClaimable).replace("$", "")} PAPER{" "}
                </Text>
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
