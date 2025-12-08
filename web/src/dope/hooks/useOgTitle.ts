import { keccak256, encodePacked } from "viem";
import { useDopeStore } from "../store";
import { isOg } from "../helpers";

export const useOgTitle = (tokenId: number) => {
  const getComponentValuesBySlug = useDopeStore((state) => state.getComponentValuesBySlug);

  const namePrefixesValues = getComponentValuesBySlug("DopeGear", "Name Prefixes");
  const nameSuffixesValues = getComponentValuesBySlug("DopeGear", "Name Suffixes");

  const rand = BigInt(keccak256(encodePacked(["string", "uint256"], ["OG", BigInt(tokenId)])));
  // console.log("encodePacked", encodePacked(["string", "uint256"], ["OG", BigInt(tokenId)]))

  const prefix = namePrefixesValues[Number((rand % BigInt(namePrefixesValues.length - 1 - 2)) + 1n)].value;

  const suffix = nameSuffixesValues[Number((rand % BigInt(nameSuffixesValues.length - 1)) + 1n)].value;

  // must be done after hook called or wait 3h
  if (!isOg(tokenId)) return { title: "" };
  return { title: `${prefix} ${suffix}` };
};
