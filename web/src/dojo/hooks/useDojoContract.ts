import { Contract, Provider } from "starknet";
import { DojoChainConfig } from "../setup/config";

export type DojoContractResult = ReturnType<typeof useDojoContract>;

export const useDojoContract = (selectedChain: DojoChainConfig) => {
  const getDojoContractManifest = (tag: string) => {
    return selectedChain.manifest.contracts.find((i: any) => i.tag === tag)!;
  };

  const getDojoContract = (tag: string) => {
    const contractManifest = getDojoContractManifest(tag);
    return new Contract({
      abi: contractManifest.abi,
      address: contractManifest.address,
      providerOrAccount: new Provider({ nodeUrl: selectedChain.rpcUrl }),
    });
  };

  const getContractTagByAddress = (address: bigint) => {
    return selectedChain.manifest.contracts.find((i: any) => BigInt(i.address) === BigInt(address))!.tag;
  };

  return {
    getDojoContract,
    getDojoContractManifest,
    getContractTagByAddress,
  };
};
