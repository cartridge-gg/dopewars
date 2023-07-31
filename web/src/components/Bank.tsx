import {
  Divider,
  HStack,
  StyleProps,
  Text,
  VStack,
  Card,
} from "@chakra-ui/react";

import React, { useCallback, useEffect, useState } from "react";
import { Alert, Gem } from "@/components/icons";
import { usePlayerEntity } from "@/hooks/dojo/entities/usePlayerEntity";
import { useRouter } from "next/router";
import { getDrugByName } from "@/hooks/ui";
import { SCALING_FACTOR, useDojo } from "@/hooks/dojo";
import { useSystems } from "@/hooks/dojo/systems/useSystems";
import { useToast } from "@/hooks/toast";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverBody,
  PopoverArrow,
  Portal,
  Slider,
  SliderTrack,
  SliderFilledTrack,
} from "@chakra-ui/react";

import { BankDepositData, BankWithdrawData } from "@/utils/event";

enum Mode {
  Idle,
  Deposit,
  Withdraw,
}

export const Bank = ({ ...props }: StyleProps) => {
  const router = useRouter();
  const { gameId } = router.query as { gameId: string };
  const { account } = useDojo();
  const { player: playerEntity, isFetched: isFetchedPlayer } = usePlayerEntity({
    gameId,
    address: account?.address,
  });
  const {
    bankDeposit: deposit,
    bankWithdraw: withdraw,
    isPending,
    error: txError,
  } = useSystems();
  const { toast } = useToast();

  const [mode, setMode] = useState(Mode.Idle);
  const [selectedQuantity, setSelectedQuantity] = useState(0);

  const onDeposit = useCallback(async () => {
    setMode(Mode.Idle);

    let depositQuantity = selectedQuantity;
    const { event, hash } = await deposit(
      gameId,
      depositQuantity * SCALING_FACTOR,
    );

    const { quantity: depositedQuantity } = event as BankDepositData;

    let toastMessage = `You deposited ${depositedQuantity} at bank`;
    toast(toastMessage, Gem, `http://amazing_explorer/${hash}`);
  }, [gameId, toast, deposit, selectedQuantity]);

  const onWithdraw = useCallback(async () => {
    setMode(Mode.Idle);

    let withdrawQuantity = selectedQuantity;
    const { event, hash } = await withdraw(
      gameId,
      withdrawQuantity * SCALING_FACTOR,
    );

    const { quantity: withdrawnQuantity } = event as BankWithdrawData;

    let toastMessage = `You withdrawn ${withdrawnQuantity} from bank`;
    toast(toastMessage, Gem, `http://amazing_explorer/${hash}`);
  }, [gameId, toast, withdraw, selectedQuantity]);

  return (
    <VStack {...props} w="full" align="flex-start" overflow="visible">
      <Text textStyle="subheading" fontSize="10px" color="neon.500">
        Bank
      </Text>
      <Card
        w="full"
        h="40px"
        px="20px"
        justify="center"
        variant="pixelated"
        overflow="visible"
      >
        <HStack w="100%" gap={2}>
          <span style={{ flexShrink: 0 }}>
            <Gem /> {playerEntity?.bank?.amount.toString()}
          </span>

          {mode == Mode.Idle && (
            <HStack w="100%" justifyContent="space-evenly">
              <button
                onClick={() => {
                  setSelectedQuantity(0);
                  setMode(Mode.Deposit);
                }}
                disabled={playerEntity?.cash === 0}
              >
                DEPOSIT
              </button>
              <button
                onClick={() => {
                  setSelectedQuantity(playerEntity?.bank?.amount || 0);
                  setMode(Mode.Withdraw);
                }}
              >
                WITHDRAW
              </button>
            </HStack>
          )}

          {mode == Mode.Deposit && (
            <HStack w="100%">
              <QuantitySelector
                maxValue={playerEntity?.cash || 0}
                onChange={(quantity) => {
                  setSelectedQuantity(quantity);
                }}
              />
              <Button
                variant="pixelated"
                onClick={onDeposit}
                disabled={selectedQuantity === 0}
              >
                OK
              </Button>
              <Button
                variant="pixelated"
                onClick={() => {
                  setMode(Mode.Idle);
                  setSelectedQuantity(0);
                }}
              >
                X
              </Button>
            </HStack>
          )}

          {mode == Mode.Withdraw && (
            <HStack w="100%">
              <QuantitySelector
                maxValue={playerEntity?.bank?.amount || 0}
                onChange={(quantity) => setSelectedQuantity(quantity)}
              />
              <Button
                variant="pixelated"
                onClick={onWithdraw}
                disabled={selectedQuantity === 0}
              >
                OK
              </Button>
              <Button variant="pixelated" onClick={() => setMode(Mode.Idle)}>
                X
              </Button>
            </HStack>
          )}
        </HStack>
      </Card>
    </VStack>
  );
};

const QuantitySelector = ({
  maxValue,
  onChange,
}: {
  maxValue: number;
  onChange: (quantity: number) => void;
}) => {
  const [quantity, setQuantity] = useState(1);

  const onSlider = useCallback(
    (value: number) => {
      setQuantity(value);
      onChange(value);
    },
    [onChange],
  );

  const on50 = useCallback(() => {
    setQuantity(Math.floor(maxValue / 2));
    onChange(Math.floor(maxValue / 2));
  }, [maxValue, onChange]);

  useEffect(() => {
    on50();
  }, []);

  return (
    <VStack
      opacity={maxValue === 0 ? "0.2" : "1"}
      pointerEvents={maxValue === 0 ? "none" : "all"}
      w="100%"
    >
      <HStack w="100%" py={2} gap={1}>
        <Slider
          aria-label="slider-quantity"
          w="100%"
          min={0}
          max={maxValue}
          step={1}
          defaultValue={0}
          value={quantity}
          onChange={onSlider}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
        </Slider>
        <Text textStyle="subheading" fontSize="10px">
          ({quantity})
        </Text>
      </HStack>
    </VStack>
  );
};
