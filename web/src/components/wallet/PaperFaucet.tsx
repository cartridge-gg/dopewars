import { DollarBag, PaperIcon } from "@/components/icons";
import { useConfigStore } from "@/dojo/hooks";

import { useFaucet } from "@/dojo/hooks/useFaucet";
import { Box } from "@chakra-ui/react";

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
