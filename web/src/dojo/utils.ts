export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

import { StarkVRF } from "stark-vrf-wasm";
import { AccountInterface, Call, CallData } from "starknet";

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
  //   fn request_random() -> felt252;
  const requestRandomCall: Call = {
    contractAddress: vrfProviderAddress,
    entrypoint: "request_random",
    calldata: [],
  };

  let submitRandomCall = undefined;
  let assertConsumedCall = undefined;

  if (vrfProviderSecret) {
    const [seed] = await account.callContract({
      contractAddress: vrfProviderAddress,
      entrypoint: "get_next_seed",
      calldata: [account.address],
    });

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
