import { consumeBytes } from "./decode";
import { keccak256, encodePacked } from "viem";

export type GearItem = {
  item: number;
  slot: number;
  name_prefix: number;
  name_suffix: number;
  suffix: number;
  augmentation: number;
};

export const getGearItem = (token_id: bigint) => {
  const obj = { value: token_id };

  let item = Number(consumeBytes(obj, 1n));
  let slot = Number(consumeBytes(obj, 1n));
  let name_prefix = Number(consumeBytes(obj, 1n));
  let name_suffix = Number(consumeBytes(obj, 1n));
  let suffix = Number(consumeBytes(obj, 1n));
  let augmentation = Number(consumeBytes(obj, 1n));

  return {
    item,
    slot,
    name_prefix,
    name_suffix,
    suffix,
    augmentation,
  };
};

export const dopeRandomness = (slot: string, tokenId: number) => {
  const rand = BigInt(
    keccak256(encodePacked(["string", "string"], [slot, tokenId.toString()]))
  );
  return rand;
};
