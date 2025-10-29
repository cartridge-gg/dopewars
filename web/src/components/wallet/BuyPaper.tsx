import { Box, HStack, Link, Text, VStack } from "@chakra-ui/react";
import { Ekubo } from "../icons/branding/Ekubo";
import { PAPER, STRK, TokenInfos, USDC, useQuote } from "@/hooks/useEkubo";
import { MonkeyIcon } from "../hustlers/Monkey";
import { Button, Dropdown, DropdownOptionProps } from "../common";
import { useEffect, useState } from "react";

const options = [
  { label: "$5", text: "", value: "5" },
  { label: "$10", text: "", value: "10" },
  { label: "$20", text: "", value: "20" },
  { label: "$50", text: "", value: "50" },
];

export const BuyPaper = ({ paperAmount }: { paperAmount: number }) => {
  const [selectedOption, setSelectedOption] = useState<DropdownOptionProps>(options[0]);

  const { value: usdcValue, ape: apeGame } = useQuote({
    amount: paperAmount,
    tokenIn: USDC,
    tokenOut: PAPER,
    isExactOutput: true,
  });

  const {
    value: paperValue,
    refetch: refetchUsdcToPaper,
    ape: apeUSDC,
  } = useQuote({
    amount: Math.floor(Number(selectedOption.value)),
    tokenIn: USDC,
    tokenOut: PAPER,
    isExactOutput: false,
  });

  // const { value: dumpUsdcValue, ape: dumpPaper } = useQuote({
  //   amount: paperAmount,
  //   tokenIn: PAPER,
  //   tokenOut: USDC,
  //   isExactOutput: false,
  // });

  useEffect(() => {
    refetchUsdcToPaper();
  }, [selectedOption, refetchUsdcToPaper]);

  return (
    <VStack alignItems="flex-start" w="full">
      <HStack alignItems="center" justifyContent="flex-start">
        <Ekubo />
        <Link
          href={`https://app.ekubo.org/?outputCurrency=PAPER&amount=-${paperAmount}&inputCurrency=USDC`}
          target="_blank"
          display="flex"
          textDecoration="none"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Text ml={1} fontSize="12px" textTransform="uppercase">
            Buy {paperAmount} PAPER (${Math.abs(Number(usdcValue)).toFixed(2)}) on Ekubo
          </Text>
        </Link>
        <Link onClick={apeGame}>
          <MonkeyIcon cursor="pointer" />
        </Link>
      </HStack>

      <HStack alignItems="center" justifyContent="flex-start" w="full">
        <Ekubo />
        <Text ml={1} fontSize="12px" textTransform="uppercase">
          Buy
        </Text>
        <Dropdown options={options} selectedOption={selectedOption} setSelectedOption={setSelectedOption}></Dropdown>
        <Text ml={1} fontSize="12px" textTransform="uppercase">
          <span style={{ fontFamily: "monospace" }}>~</span>
          {Math.abs(Number(paperValue)).toFixed(0)} PAPER
        </Text>
        <Link onClick={apeUSDC}>
          <MonkeyIcon cursor="pointer" />
        </Link>
      </HStack>

      {/* <HStack alignItems="center" justifyContent="flex-start">
        <Ekubo />
        <Text ml={1} fontSize="12px" textTransform="uppercase">
          Dump {paperAmount} PAPER (${Math.abs(Number(dumpUsdcValue)).toFixed(2)}) on Ekubo
        </Text>
        <Link onClick={dumpPaper}>
          <MonkeyIcon cursor="pointer" />
        </Link>
      </HStack> */}
    </VStack>
  );
};
