import {
    createStarknetEIP712DomainType, 
    createEIP712TypesNoBodyStarknet,
} from "./eip712.interface";

export const nonceType = { name: "nonce", type: "felt"};


export const TradeParametersTypes = [
    nonceType,
    { name: "player_id", type: "felt" },
    { name: "game_id", type: "felt" }
];

export const tradeParametersActionTypeLabel = "TradeParameters";
export const tradeParametersActionTypes = createEIP712TypesNoBodyStarknet(tradeParametersActionTypeLabel, TradeParametersTypes);
export const tradeParametersActionDomain = createStarknetEIP712DomainType("Trade Parameters Request");