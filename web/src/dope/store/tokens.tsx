import { Entity, Subscription, Token, TokenBalance } from "@dojoengine/torii-client";
import { StateCreator } from "zustand";
import { parseStruct } from "../toriiUtils";
import { DopeState } from "./store";

export interface ParsedToken {
  token_id: bigint;
  contract_address: string;
  name: string;
  symbol: string;
  decimals: number;
  metadata: TokenMetadata;
}

export interface TokenMetadata {
  attributes?: any[];
  name?: string;
  description?: string;
  image?: string;
}

export interface ParsedTokenBalance {
  balance: bigint;
  account_address: string;
  contract_address: string;
  token_id: bigint;
}

export type DopeLootClaimState = Record<
  string,
  {
    isClaimed: boolean;
    isReleased: boolean;
    isOpened: boolean;
  }
>;

type State = {
  tokens: Record<string, ParsedToken[]>;
  tokensBalances: Record<string, ParsedTokenBalance[]>;
  dopeLootClaimState: DopeLootClaimState;
  subscriptions: Subscription[];
};

type Action = {
  initDopeLootClaimState: () => void;
  initTokens: (addresses: string[]) => void;
  subscribe: (tokensAddresses: string[]) => void;
  clearSubscriptions: () => void;
  onTokenUpdated: (token: Token) => void;
  onTokenBalanceUpdated: (tokenBalance: TokenBalance) => void;
  onEntityUpdated: (entity: any, update: any) => void;
};

export type TokenState = State & Action;
// export type TokenStore = StoreApi<TokenState>;

export const createTokenStore: StateCreator<DopeState, [], [], TokenState> = (set, get) => ({
  tokens: {},
  tokensBalances: {},
  dopeLootClaimState: {},
  subscriptions: [],
  // init: async () => {
  //   await get().initDopeLootClaimState();

  //   await get().subscribe();
  // },
  //
  initTokens: async (_tokensAddresses: string[]) => {
    // // TODO: use batch wen possible
    // const tokensPromise = toriiClient.getTokens(tokensAddresses, []);
    // const tokensBalancesPromise = toriiClient.getTokenBalances(
    //   tokensAddresses,
    //   [],
    //   []
    // );
    // const [tokens, tokensBalances] = await Promise.all([
    //   tokensPromise,
    //   tokensBalancesPromise,
    // ]);
    // const parsedTokens = tokens.map(parseToken);
    // const parsedTokensBalances = tokensBalances.map(parseTokenBalance);
    // const tokensByContract = tokensAddresses
    //   .map((address) => {
    //     return {
    //       [address]: parsedTokens.filter(
    //         (i) => BigInt(i.contract_address) === BigInt(address)
    //       ),
    //     };
    //   })
    //   .reduce((a, v) => ({ ...a, ...v }), {});
    // const tokensBalancesByContract = tokensAddresses
    //   .map((address) => {
    //     return {
    //       [address]: parsedTokensBalances.filter(
    //         (i) => BigInt(i.contract_address) === BigInt(address)
    //       ),
    //     };
    //   })
    //   .reduce((a, v) => ({ ...a, ...v }), {});
    // console.log(tokensByContract);
    // console.log(tokensBalancesByContract);
    // set({ tokens: tokensByContract, tokensBalances: tokensBalancesByContract });
  },

  //
  initDopeLootClaimState: async () => {
    const entities = await get().toriiClient!.getEntities({
      clause: {
        Keys: {
          keys: [undefined],
          models: ["dope-DopeLootClaimed", "dope-DopeLootReleased", "dope-DopeLootOpened"],
          pattern_matching: "FixedLen",
        },
      },
      models: ["dope-DopeLootClaimed", "dope-DopeLootReleased", "dope-DopeLootOpened"],
      historical: false,
      no_hashed_keys: false,
      pagination: {
        cursor: undefined,
        direction: "Forward",
        limit: 30_000,
        order_by: [],
      },
    });

    const state: DopeLootClaimState = {};

    for (let entity of entities.items) {
      const models = entity.models;
      const dopeLootClaimed = models["dope-DopeLootClaimed"] && parseStruct(models["dope-DopeLootClaimed"]);
      const dopeLootReleased = models["dope-DopeLootReleased"] && parseStruct(models["dope-DopeLootReleased"]);
      const dopeLootOpened = models["dope-DopeLootOpened"] && parseStruct(models["dope-DopeLootOpened"]);
      let lootId = "";
      if (dopeLootClaimed) {
        lootId = Number(dopeLootClaimed.token_id).toString();
      } else if (dopeLootReleased) {
        lootId = Number(dopeLootReleased.token_id).toString();
      } else if (dopeLootOpened) {
        lootId = Number(dopeLootOpened.token_id).toString();
      }
      if (!lootId) continue;
      state[lootId] = {
        isClaimed: dopeLootClaimed ? dopeLootClaimed.claimed : false,
        isReleased: dopeLootReleased ? dopeLootReleased.released : false,
        isOpened: dopeLootOpened ? dopeLootOpened.opened : false,
      };
    }
    set({ dopeLootClaimState: state });
  },
  clearSubscriptions: () => {
    for (let subscription of get().subscriptions) {
      // cancel subscription
      subscription.cancel();
    }
    set({ subscriptions: [] });
  },
  subscribe: async (_tokensAddresses: string[]) => {
    get().clearSubscriptions();

    // const subscriptionTokens = await get().toriiClient!.onTokenUpdated(
    //   tokensAddresses,
    //   [],
    //   get().onTokenUpdated
    // );

    // const subscriptionTokensBalances = await get().toriiClient!.onTokenBalanceUpdated(
    //   tokensAddresses,
    //   [],
    //   [],
    //   get().onTokenBalanceUpdated
    // );

    const subscriptionEntities = await get().toriiClient!.onEntityUpdated(
      {
        Keys: {
          keys: [undefined],
          models: ["dope-DopeLootClaimed", "dope-DopeLootReleased", "dope-DopeLootOpened"],
          pattern_matching: "FixedLen",
        },
      },

      get().onEntityUpdated,
    );

    const subscriptions = [
      // subscriptionTokens,
      // subscriptionTokensBalances,
      subscriptionEntities,
    ];
    set({
      subscriptions,
    });
  },
  onTokenUpdated: async (token: Token) => {
    if (BigInt(token.contract_address) === 0n) return;

    const tokens = get().tokens;
    if (!tokens[token.contract_address]) {
      tokens[token.contract_address] = [];
    }

    const parsedToken = parseToken(token);
    tokens[token.contract_address] = tokens[token.contract_address].filter(
      (i: ParsedToken) => i.token_id === parsedToken.token_id && i.contract_address === parsedToken.contract_address,
    );
    set({
      tokens: {
        ...tokens,
        [token.contract_address]: [...tokens[token.contract_address], parsedToken],
      },
    });
  },
  onTokenBalanceUpdated: async (tokenBalance: TokenBalance) => {
    if (BigInt(tokenBalance.contract_address) === 0n) return;

    const tokensBalances = get().tokensBalances;
    if (!tokensBalances[tokenBalance.contract_address]) {
      tokensBalances[tokenBalance.contract_address] = [];
    }

    const parsedTokenBalance = parseTokenBalance(tokenBalance);
    tokensBalances[tokenBalance.contract_address] = tokensBalances[tokenBalance.contract_address].filter(
      (i: ParsedTokenBalance) =>
        i.token_id === parsedTokenBalance.token_id && i.contract_address === parsedTokenBalance.contract_address,
    );
    set({
      tokensBalances: {
        ...tokensBalances,
        [tokenBalance.contract_address]: [...tokensBalances[tokenBalance.contract_address], parsedTokenBalance],
      },
    });
  },
  onEntityUpdated: async (entity: Entity) => {
    if (BigInt(entity.hashed_keys) === 0n) return;

    if (entity.models["dope-DopeLootClaimed"]) {
      const dopeLootClaimState = get().dopeLootClaimState;
      const parsed = parseStruct(entity.models["dope-DopeLootClaimed"]);
      const tokenId = Number(parsed.token_id);
      const claimed = parsed.opened;

      if (dopeLootClaimState[tokenId]) {
        dopeLootClaimState[tokenId].isClaimed = claimed;
      } else {
        dopeLootClaimState[tokenId] = {
          isClaimed: claimed,
          isReleased: false,
          isOpened: false,
        };
      }
      set({
        dopeLootClaimState: {
          ...dopeLootClaimState,
          [tokenId]: dopeLootClaimState[tokenId],
        },
      });
    }

    if (entity.models["dope-DopeLootReleased"]) {
      const dopeLootClaimState = get().dopeLootClaimState;
      const parsed = parseStruct(entity.models["dope-DopeLootReleased"]);
      const tokenId = Number(parsed.token_id);
      const released = parsed.released;

      if (dopeLootClaimState[tokenId]) {
        dopeLootClaimState[tokenId].isReleased = released;
      } else {
        dopeLootClaimState[tokenId] = {
          isClaimed: false,
          isReleased: released,
          isOpened: false,
        };
      }
      set({
        dopeLootClaimState: {
          ...dopeLootClaimState,
          [tokenId]: dopeLootClaimState[tokenId],
        },
      });
    }

    if (entity.models["dope-DopeLootOpened"]) {
      const dopeLootClaimState = get().dopeLootClaimState;
      const parsed = parseStruct(entity.models["dope-DopeLootOpened"]);
      const tokenId = Number(parsed.token_id);
      const opened = parsed.opened;

      if (dopeLootClaimState[tokenId]) {
        dopeLootClaimState[tokenId].isOpened = opened;
      } else {
        dopeLootClaimState[tokenId] = {
          isClaimed: false,
          isReleased: false,
          isOpened: opened,
        };
      }
      set({
        dopeLootClaimState: {
          ...dopeLootClaimState,
          [tokenId]: dopeLootClaimState[tokenId],
        },
      });
    }
  },
});

//
//
//

const parseToken = (t: Token) => {
  let metadata = {};
  try {
    metadata = JSON.parse(t.metadata);
  } catch (e) {}
  return {
    ...t,
    token_id: BigInt(t.token_id || 0),
    metadata: metadata,
  };
};

const parseTokenBalance = (tb: TokenBalance) => {
  return {
    ...tb,
    token_id: BigInt(tb.token_id || 0),
    balance: BigInt(tb.balance),
  };
};
