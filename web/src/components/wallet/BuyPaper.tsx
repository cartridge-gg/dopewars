import { Button, Link, Text } from "@chakra-ui/react";
import { Ekubo } from "../icons/branding/Ekubo";

export const BuyPaper = () => {
  return (
    <Link
      href="https://app.ekubo.org/?outputCurrency=PAPER&amount=-5000&inputCurrency=ETH"
      target="_blank"
      marginTop={1}
      display="flex"
      textDecoration="none"
      alignItems="center"
    >
      {/* <Button variant="pixelated" h="36px" fontSize="14px"> */}
      <Ekubo />
      <Text ml={1} fontSize="12px" textTransform="uppercase"> Buy PAPER on Ekubo</Text>
      {/* </Button> */}
    </Link>
  );
};
