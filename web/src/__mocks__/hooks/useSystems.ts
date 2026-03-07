export const useSystems = () => ({
  createGame: async () => ({ hash: "0x0" }),
  endGame: async () => ({ hash: "0x0" }),
  travel: async () => ({ hash: "0x0" }),
  decide: async () => ({ hash: "0x0" }),
  registerScore: async () => ({ hash: "0x0" }),
  claim: async () => ({ hash: "0x0" }),
  claimTreasury: async () => ({ hash: "0x0" }),
  superchargeJackpot: async () => ({ hash: "0x0" }),
  launder: async () => ({ hash: "0x0" }),
  setPaused: async () => ({ hash: "0x0" }),
  updateRyoConfig: async () => ({ hash: "0x0" }),
  updateDrugConfig: async () => ({ hash: "0x0" }),
  failingTx: async () => ({ hash: "0x0" }),
  createFakeGame: async () => ({ hash: "0x0" }),
  createNewSeason: async () => ({ hash: "0x0" }),
  executeAndReceipt: async () => ({ hash: "0x0" }),
  isPending: false,
  error: undefined,
});

export const ETHER = 10n ** 18n;
export const tryBetterErrorMsg = (msg: string) => msg;
export const waitForTransaction = async () => undefined;
