export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

import { StarkVRF } from "stark-vrf-wasm";
import { AccountInterface, BlockTag, Call, CallData, hash, selector } from "starknet";

enum Source {
  Nonce = 0x0,
  Salt = 0x1,
}

const SOURCE_NONCE = 0x0;
const SOURCE_SALT = 0x1;

export const buildVrfCalls = async ({
  account,
  call,
  vrfProviderAddress,
  vrfProviderSecret,
}: {
  account: AccountInterface;
  call: Call;
  vrfProviderAddress: string;
  vrfProviderSecret?: string;
}): Promise<Call[]> => {
  //   fn request_random(caller: ContractAddress, source: Source) -> felt252;
  const requestRandomCall: Call = {
    contractAddress: vrfProviderAddress,
    entrypoint: "request_random",
    calldata: [call.contractAddress, Source.Nonce, account.address],
  };

  let submitRandomCall = undefined;
  let assertConsumedCall = undefined;

  if (vrfProviderSecret) {
    const chainId = await account.getChainId();
 
    const nonceStorageSlot = hash.computePedersenHash(
      selector.getSelectorFromName("VrfProvider_nonces"),
      account.address,
    );

    const nonce = await account.getStorageAt(vrfProviderAddress, nonceStorageSlot, BlockTag.pending);
    const seed = hash.computePoseidonHashOnElements([nonce, call.contractAddress, chainId]);
    console.log(chainId);
    console.log(nonceStorageSlot);
    console.log(nonce);
    console.log(seed);
  
    const vrf = StarkVRF.new(vrfProviderSecret);
    const proof = vrf.prove(vrfProviderSecret, seed);
    const sqrt_ratio_hint = vrf.hashToSqrtRatioHint(seed);

    // fn submit_random( seed: felt252, proof: Proof);
    submitRandomCall = {
      contractAddress: vrfProviderAddress,
      entrypoint: "submit_random",
      calldata: CallData.compile([seed, proof, sqrt_ratio_hint]),
    };

    // fn assert_consumed( seed: felt252,);
    assertConsumedCall = {
      contractAddress: vrfProviderAddress,
      entrypoint: "assert_consumed",
      calldata: [seed],
    };
  }

  let calls = [];
  if (vrfProviderSecret) {
    calls.push(submitRandomCall as Call);
  }

  calls.push(requestRandomCall);
  calls.push(call);

  if (vrfProviderSecret) {
    calls.push(assertConsumedCall as Call);
  }

  console.log("calls", calls);
  return calls;
};
