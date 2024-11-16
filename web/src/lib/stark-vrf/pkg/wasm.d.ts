/* tslint:disable */
/* eslint-disable */
/**
* @param {string} secret_key
* @returns {StarkVRFJs}
*/
export function _new(secret_key: string): StarkVRFJs;
/**
*/
export class ProofJs {
  free(): void;
}
/**
*/
export class StarkVRFJs {
  free(): void;
/**
* @param {string} secret_key
* @param {string} seed
* @returns {ProofJs}
*/
  prove(secret_key: string, seed: string): ProofJs;
/**
* @param {ProofJs} proof
* @param {string} seed
* @returns {boolean}
*/
  verify(proof: ProofJs, seed: string): boolean;
}
