import { DollarBag } from "@/components/icons";
import { PaperIcon } from "@/components/icons/Paper";
import { Box } from "@chakra-ui/react";
import { useFaucet } from "../hooks/useFaucet";

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
