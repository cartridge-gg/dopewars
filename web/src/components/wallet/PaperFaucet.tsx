import { DollarBag, PaperIcon } from "@/components/icons";

import { useFaucet } from "@/dojo/hooks/useFaucet";
import { Box } from "@chakra-ui/react";

const iconsBySymbol = {
  fPAPER: PaperIcon,
  PAPER: PaperIcon,
};

export const PaperFaucet = () => {
  const { isPending, faucet } = useFaucet();
 
  const onClick = () => {
    if(isPending) return
    faucet();
  }

  return (
    <Box onClick={onClick} cursor="pointer">
      <DollarBag />
    </Box>
  );
};
