import { Button, Link } from "@chakra-ui/react";

export const BuyPaper = () => {
  return (
    <Link href="https://app.ekubo.org/?outputCurrency=PAPER&amount=-69420&inputCurrency=ETH" target="_blank">
      <Button variant="pixelated" h="48px" fontSize="14px">
        Buy on Ekubo
      </Button>
    </Link>
  );
};
