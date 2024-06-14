import { DollarBag, PaperIcon } from "@/components/icons";
import { useConfigStore } from "@/dojo/hooks";

import { useFaucet } from "@/dojo/hooks/useFaucet";
import { Box, Button } from "@chakra-ui/react";

const iconsBySymbol = {
  fPAPER: PaperIcon,
  PAPER: PaperIcon,
};

export const PaperFaucet = () => {
  const { config } = useConfigStore();
  const { isPending, faucet } = useFaucet(config?.ryoAddress.paper);

  const onClick = () => {
    if (isPending) return;
    faucet();
  };

  return (
    <Box onClick={onClick} cursor="pointer">
      <DollarBag />
    </Box>
  );
};

export const PaperFaucetButton = () => {
  const { config } = useConfigStore();
  const { isPending, faucet } = useFaucet(config?.ryoAddress.paper);

  const onClick = () => {
    if (isPending) return;
    faucet();
  };

  return (
    <Button w={["full", "auto"]} px={["auto", "20px"]} onClick={onClick} isLoading={isPending}>
      <DollarBag /> MINT PAPER
    </Button>
  );
};
