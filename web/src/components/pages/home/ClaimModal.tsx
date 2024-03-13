import { useSystems } from "@/dojo/hooks";
import { Leaderboard } from "@/generated/graphql";
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
    VStack,
} from "@chakra-ui/react";
import { useAccount } from "@starknet-react/core";

export const ClaimModal = ({
  claimable,
  isOpen,
  onClose,
}: {
  claimable: Leaderboard;
  isOpen: boolean;
  onClose: VoidFunction;
}) => {
  const { claim, isPending } = useSystems();
  const { account } = useAccount();

  const onClaim = async () => {
    await claim(claimable.version);
    onClose();
  };

  return (
    <>
      <Modal motionPreset="slideInBottom" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="bg.dark">
          <ModalHeader textAlign="center" pb={0}>
            CLAIM REWARDS
          </ModalHeader>
          <ModalBody py={6}>
            <VStack w="full" gap={6}>
              <Text textAlign="center" color="neon.500">
                Well done hustler, you won season {claimable.version} of RYO and earned ...
              </Text>
              <Text textAlign="center" color="yellow.400">
                {formatCash(claimable.paper_balance).replace("$", "")} PAPER{" "}
              </Text>
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
