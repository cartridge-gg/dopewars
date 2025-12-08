/* tslint:disable */
/* eslint-disable */
export interface ProofJs {
  gamma: Point;
  c: string;
  s: string;
}

/**
 */
export class Point {
  free(): void;
}
/**
 */
export class StarkVRF {
  free(): void;
  /**
   * @param {string} secret_key
   * @returns {StarkVRF}
   */
  static new(secret_key: string): StarkVRF;
  /**
   * @param {string} secret_key
   * @param {string} seed
   * @returns {ProofJs}
   */
  prove(secret_key: string, seed: string): ProofJs;
  /**
   * @param {string} seed
   * @returns {string}
   */
  hashToSqrtRatioHint(seed: string): string;
  /**
   * @param {ProofJs} proof
   * @returns {string}
   */
  proofToHash(proof: ProofJs): string;
  /**
   * @param {ProofJs} proof
   * @param {string} seed
   * @returns {boolean}
   */
  verify(proof: ProofJs, seed: string): boolean;
}
