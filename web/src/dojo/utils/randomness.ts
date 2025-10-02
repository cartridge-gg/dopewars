import { AccountInterface, Call } from "starknet";
import { DojoChainConfig } from "../setup/config";

export enum RandomnessMode {
  VRF = "vrf",
  LOCAL = "local",
}

export interface RandomnessConfig {
  mode: RandomnessMode;
  vrfProviderAddress?: string;
  vrfProviderSecret?: string;
}

/**
 * Determines randomness mode based on chain configuration
 * - Local randomness for provable-dw and katana local
 * - VRF for sepolia and mainnet
 */
export const getRandomnessMode = (chainConfig: DojoChainConfig): RandomnessConfig => {
  const chainName = chainConfig.name;

  // Use local randomness for provable-dw deployment and local katana
  if (chainName === "WP_PROVABLE_DW" || chainName === "KATANA") {
    return {
      mode: RandomnessMode.LOCAL,
    };
  }

  // Use VRF for mainnet, sepolia, and dopewars slot
  return {
    mode: RandomnessMode.VRF,
    vrfProviderAddress: chainConfig.vrfProviderAddress,
    vrfProviderSecret: chainConfig.vrfProviderSecret,
  };
};

/**
 * Build calls for either VRF or local randomness based on configuration
 */
export const buildRandomnessCalls = async ({
  account,
  call,
  chainConfig,
}: {
  account: AccountInterface;
  call: Call;
  chainConfig: DojoChainConfig;
}): Promise<Call[]> => {
  const randomnessConfig = getRandomnessMode(chainConfig);

  if (randomnessConfig.mode === RandomnessMode.LOCAL) {
    // For local randomness, we just return the original call
    // The randomness is generated on the contract side using tx context
    return [call];
  }

  // For VRF mode, use the existing buildVrfCalls logic
  const { buildVrfCalls } = await import("../utils");
  return buildVrfCalls({
    account,
    call,
    vrfProviderAddress: randomnessConfig.vrfProviderAddress!,
    vrfProviderSecret: randomnessConfig.vrfProviderSecret,
  });
};

/**
 * Check if the current chain uses local randomness
 */
export const usesLocalRandomness = (chainConfig: DojoChainConfig): boolean => {
  const randomnessConfig = getRandomnessMode(chainConfig);
  return randomnessConfig.mode === RandomnessMode.LOCAL;
};

/**
 * Generate local entropy for client-side seed generation
 * Similar to death-mountain's approach but adapted for Dope Wars
 */
export const generateLocalEntropy = (gameId?: string, action?: string): string => {
  const timestamp = Date.now();
  const random = Math.random();
  const userAgent = typeof window !== "undefined" ? window.navigator.userAgent : "";

  // Combine multiple entropy sources
  const entropyInputs = [
    timestamp.toString(),
    random.toString(),
    gameId || "",
    action || "",
    userAgent,
  ];

  // Create a simple hash-like string (not cryptographically secure, but sufficient for game entropy)
  let hash = 0;
  const combined = entropyInputs.join(":");

  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(16);
};