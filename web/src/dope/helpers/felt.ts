import { shortString } from "starknet";

export const feltToString = (felt: string) => {
  return shortString.decodeShortString(`0x${BigInt(felt).toString(16)}`);
};
