import * as weierstrass from '@noble/curves/abstract/weierstrass';
import { Abi as Abi$1, TypedContract as TypedContract$1 } from 'abi-wan-kanabi';
import * as poseidon from '@noble/curves/abstract/poseidon';
import * as json$1 from 'lossless-json';
import * as starknet from '@scure/starknet';

declare const IS_BROWSER: boolean;
/**
 * Some functions recreated from https://github.com/pedrouid/enc-utils/blob/master/src/index.ts
 * enc-utils is not a dependency to avoid using `Buffer` which only works in node and not browsers
 */
/**
 * Convert array buffer to string
 *
 * *[internal usage]*
 */
declare function arrayBufferToString(array: ArrayBuffer): string;
/**
 * Convert string to array buffer
 *
 * *[internal usage]*
 */
declare function stringToArrayBuffer(s: string): Uint8Array;
/**
 * Convert string to array buffer (browser and node compatible)
 */
declare function atobUniversal(a: string): Uint8Array;
/**
 * Convert array buffer to string (browser and node compatible)
 */
declare function btoaUniversal(b: ArrayBuffer): string;
/**
 * Convert array buffer to hex-string
 * @returns format: hex-string
 */
declare function buf2hex(buffer: Uint8Array): string;
/**
 * Remove hex prefix '0x' from hex-string
 * @param hex hex-string
 * @returns format: base16-string
 */
declare function removeHexPrefix(hex: string): string;
/**
 * Add hex prefix '0x' to base16-string
 * @param hex base16-string
 * @returns format: hex-string
 */
declare function addHexPrefix(hex: string): string;
/**
 * Prepend string (default with '0')
 */
declare function padLeft(str: string, length: number, padding?: string): string;
/**
 * Calculate byte length of string
 *
 * *[no internal usage]*
 */
declare function calcByteLength(str: string, byteSize?: number): number;
/**
 * Prepend '0' to string bytes
 *
 * *[no internal usage]*
 */
declare function sanitizeBytes(str: string, byteSize?: number, padding?: string): string;
/**
 * Prepend '0' to hex-string bytes
 *
 * *[no internal usage]*
 * @param hex hex-string
 * @returns format: hex-string
 */
declare function sanitizeHex(hex: string): string;
/**
 * Convert utf8-string to Uint8Array
 *
 * Implemented using TextEncoder to make it isomorphic
 * @param str utf8-string
 */
declare function utf8ToArray(str: string): Uint8Array;
/**
 * String transformation util
 *
 * Pascal case to screaming snake case
 */
declare const pascalToSnake: (text: string) => string;

declare const encode_IS_BROWSER: typeof IS_BROWSER;
declare const encode_addHexPrefix: typeof addHexPrefix;
declare const encode_arrayBufferToString: typeof arrayBufferToString;
declare const encode_atobUniversal: typeof atobUniversal;
declare const encode_btoaUniversal: typeof btoaUniversal;
declare const encode_buf2hex: typeof buf2hex;
declare const encode_calcByteLength: typeof calcByteLength;
declare const encode_padLeft: typeof padLeft;
declare const encode_pascalToSnake: typeof pascalToSnake;
declare const encode_removeHexPrefix: typeof removeHexPrefix;
declare const encode_sanitizeBytes: typeof sanitizeBytes;
declare const encode_sanitizeHex: typeof sanitizeHex;
declare const encode_stringToArrayBuffer: typeof stringToArrayBuffer;
declare const encode_utf8ToArray: typeof utf8ToArray;
declare namespace encode {
  export {
    encode_IS_BROWSER as IS_BROWSER,
    encode_addHexPrefix as addHexPrefix,
    encode_arrayBufferToString as arrayBufferToString,
    encode_atobUniversal as atobUniversal,
    encode_btoaUniversal as btoaUniversal,
    encode_buf2hex as buf2hex,
    encode_calcByteLength as calcByteLength,
    encode_padLeft as padLeft,
    encode_pascalToSnake as pascalToSnake,
    encode_removeHexPrefix as removeHexPrefix,
    encode_sanitizeBytes as sanitizeBytes,
    encode_sanitizeHex as sanitizeHex,
    encode_stringToArrayBuffer as stringToArrayBuffer,
    encode_utf8ToArray as utf8ToArray,
  };
}

/**
 * Cairo Felt support storing max 31 character
 */
declare const TEXT_TO_FELT_MAX_LEN = 31;
declare const HEX_STR_TRANSACTION_VERSION_1 = "0x1";
declare const HEX_STR_TRANSACTION_VERSION_2 = "0x2";
declare const BN_TRANSACTION_VERSION_1 = 1n;
declare const BN_TRANSACTION_VERSION_2 = 2n;
declare const BN_FEE_TRANSACTION_VERSION_1: bigint;
declare const BN_FEE_TRANSACTION_VERSION_2: bigint;
declare const ZERO = 0n;
declare const MASK_250: bigint;
declare const MASK_251: bigint;
declare const API_VERSION = 0n;
declare enum BaseUrl {
    SN_MAIN = "https://alpha-mainnet.starknet.io",
    SN_GOERLI = "https://alpha4.starknet.io",
    SN_GOERLI2 = "https://alpha4-2.starknet.io"
}
declare enum NetworkName {
    SN_MAIN = "SN_MAIN",
    SN_GOERLI = "SN_GOERLI",
    SN_GOERLI2 = "SN_GOERLI2"
}
declare enum StarknetChainId {
    SN_MAIN = "0x534e5f4d41494e",
    SN_GOERLI = "0x534e5f474f45524c49",
    SN_GOERLI2 = "0x534e5f474f45524c4932"
}
declare enum TransactionHashPrefix {
    DECLARE = "0x6465636c617265",
    DEPLOY = "0x6465706c6f79",
    DEPLOY_ACCOUNT = "0x6465706c6f795f6163636f756e74",
    INVOKE = "0x696e766f6b65",
    L1_HANDLER = "0x6c315f68616e646c6572"
}
declare const UDC: {
    ADDRESS: string;
    ENTRYPOINT: string;
};

declare const constants_API_VERSION: typeof API_VERSION;
declare const constants_BN_FEE_TRANSACTION_VERSION_1: typeof BN_FEE_TRANSACTION_VERSION_1;
declare const constants_BN_FEE_TRANSACTION_VERSION_2: typeof BN_FEE_TRANSACTION_VERSION_2;
declare const constants_BN_TRANSACTION_VERSION_1: typeof BN_TRANSACTION_VERSION_1;
declare const constants_BN_TRANSACTION_VERSION_2: typeof BN_TRANSACTION_VERSION_2;
type constants_BaseUrl = BaseUrl;
declare const constants_BaseUrl: typeof BaseUrl;
declare const constants_HEX_STR_TRANSACTION_VERSION_1: typeof HEX_STR_TRANSACTION_VERSION_1;
declare const constants_HEX_STR_TRANSACTION_VERSION_2: typeof HEX_STR_TRANSACTION_VERSION_2;
declare const constants_IS_BROWSER: typeof IS_BROWSER;
declare const constants_MASK_250: typeof MASK_250;
declare const constants_MASK_251: typeof MASK_251;
type constants_NetworkName = NetworkName;
declare const constants_NetworkName: typeof NetworkName;
type constants_StarknetChainId = StarknetChainId;
declare const constants_StarknetChainId: typeof StarknetChainId;
declare const constants_TEXT_TO_FELT_MAX_LEN: typeof TEXT_TO_FELT_MAX_LEN;
type constants_TransactionHashPrefix = TransactionHashPrefix;
declare const constants_TransactionHashPrefix: typeof TransactionHashPrefix;
declare const constants_UDC: typeof UDC;
declare const constants_ZERO: typeof ZERO;
declare namespace constants {
  export {
    constants_API_VERSION as API_VERSION,
    constants_BN_FEE_TRANSACTION_VERSION_1 as BN_FEE_TRANSACTION_VERSION_1,
    constants_BN_FEE_TRANSACTION_VERSION_2 as BN_FEE_TRANSACTION_VERSION_2,
    constants_BN_TRANSACTION_VERSION_1 as BN_TRANSACTION_VERSION_1,
    constants_BN_TRANSACTION_VERSION_2 as BN_TRANSACTION_VERSION_2,
    constants_BaseUrl as BaseUrl,
    constants_HEX_STR_TRANSACTION_VERSION_1 as HEX_STR_TRANSACTION_VERSION_1,
    constants_HEX_STR_TRANSACTION_VERSION_2 as HEX_STR_TRANSACTION_VERSION_2,
    constants_IS_BROWSER as IS_BROWSER,
    constants_MASK_250 as MASK_250,
    constants_MASK_251 as MASK_251,
    constants_NetworkName as NetworkName,
    constants_StarknetChainId as StarknetChainId,
    constants_TEXT_TO_FELT_MAX_LEN as TEXT_TO_FELT_MAX_LEN,
    constants_TransactionHashPrefix as TransactionHashPrefix,
    constants_UDC as UDC,
    constants_ZERO as ZERO,
  };
}

declare const ec_weierstrass: typeof weierstrass;
declare namespace ec {
  export {
    starknet as starkCurve,
    ec_weierstrass as weierstrass,
  };
}

type CairoEnumRaw = {
    [key: string]: any;
};
/**
 * Class to handle Cairo custom Enum
 * @param enumContent object containing the variants and its content. Example :
 *  {Success: 234, Warning: undefined, Error: undefined}.
 *  Only one variant with a value, object, array.
 * @returns an instance representing a Cairo custom Enum.
 * @example ```typescript
 * const myCairoEnum = new CairoCustomEnum( {Success: undefined, Warning: "0x7f32ea", Error: undefined})
 * ```
 */
declare class CairoCustomEnum {
    /**
     * direct readonly access to variants of the Cairo Custom Enum.
     * @returns a value of type any
     * @example ```typescript
     * const successValue = myCairoEnum.variant.Success;
     */
    readonly variant: CairoEnumRaw;
    /**
     * @param enumContent an object with the variants as keys and the content as value. Only one content shall be defined.
     */
    constructor(enumContent: CairoEnumRaw);
    /**
     *
     * @returns the content of the valid variant of a Cairo custom Enum.
     */
    unwrap(): any;
    /**
     *
     * @returns the name of the valid variant of a Cairo custom Enum.
     */
    activeVariant(): string;
}

declare enum CairoOptionVariant {
    Some = 0,
    None = 1
}
/**
 * Class to handle Cairo Option
 * @param variant CairoOptionVariant.Some or CairoOptionVariant.None
 * @param someContent value of type T.
 * @returns an instance representing a Cairo Option.
 * @example ```typescript
 * const myOption = new CairoOption<BigNumberish>(CairoOptionVariant.Some, "0x54dda8");
 * ```
 */
declare class CairoOption<T> {
    readonly Some?: T;
    readonly None?: boolean;
    constructor(variant: CairoOptionVariant, someContent?: T);
    /**
     *
     * @returns the content of the valid variant of a Cairo custom Enum.
     *  If None, returns 'undefined'.
     */
    unwrap(): T | undefined;
    /**
     *
     * @returns true if the valid variant is 'isSome'.
     */
    isSome(): boolean;
    /**
     *
     * @returns true if the valid variant is 'isNone'.
     */
    isNone(): boolean;
}

declare enum CairoResultVariant {
    Ok = 0,
    Err = 1
}
/**
 * Class to handle Cairo Result
 * @param variant CairoResultVariant.Ok or CairoResultVariant.Err
 * @param resultContent value of type T or U.
 * @returns an instance representing a Cairo Result.
 * @example ```typescript
 * const myOption = new CairoResult<BigNumberish,CustomError>(CairoResultVariant.Ok, "0x54dda8");
 * ```
 */
declare class CairoResult<T, U> {
    readonly Ok?: T;
    readonly Err?: U;
    constructor(variant: CairoResultVariant, resultContent: T | U);
    /**
     *
     * @returns the content of the valid variant of a Cairo Result.
     */
    unwrap(): T | U;
    /**
     *
     * @returns true if the valid variant is 'Ok'.
     */
    isOk(): boolean;
    /**
     *
     * @returns true if the valid variant is 'isErr'.
     */
    isErr(): boolean;
}

type CairoEnum = CairoCustomEnum | CairoOption<any> | CairoResult<any, any>;

/** ABI */
type Abi = Array<FunctionAbi | EventAbi | StructAbi | any>;
type AbiEntry = {
    name: string;
    type: 'felt' | 'felt*' | string;
};
type EventEntry = {
    name: string;
    type: 'felt' | 'felt*' | string;
    kind: 'key' | 'data';
};
declare enum FunctionAbiType {
    'function' = 0,
    'l1_handler' = 1,
    'constructor' = 2
}
type FunctionAbi = {
    inputs: AbiEntry[];
    name: string;
    outputs: AbiEntry[];
    stateMutability?: 'view';
    state_mutability?: string;
    type: FunctionAbiType;
};
type AbiStructs = {
    [name: string]: StructAbi;
};
type StructAbi = {
    members: (AbiEntry & {
        offset: number;
    })[];
    name: string;
    size: number;
    type: 'struct';
};
type AbiEnums = {
    [name: string]: EnumAbi;
};
type EnumAbi = {
    variants: (AbiEntry & {
        offset: number;
    })[];
    name: string;
    size: number;
    type: 'enum';
};
type AbiEvents = {
    [hash: string]: EventAbi;
};
type EventAbi = Cairo1Event | LegacyEvent;
type Cairo1Event = {
    name: string;
    members: EventEntry[];
    kind: 'struct';
    type: 'event';
};
type LegacyEvent = {
    name: string;
    type: 'event';
    data: EventEntry[];
    keys: EventEntry[];
};

/** LEGACY CONTRACT */
/**
 * format produced after compressing 'program' property
 */
type LegacyContractClass = {
    program: CompressedProgram;
    entry_points_by_type: EntryPointsByType;
    abi: Abi;
};
/**
 * format produced after compile .cairo to .json
 */
type LegacyCompiledContract = Omit<LegacyContractClass, 'program'> & {
    program: Program;
};
/** SUBTYPES */
type Builtins = string[];
type CompressedProgram = string;
type EntryPointsByType = {
    CONSTRUCTOR: ContractEntryPointFields[];
    EXTERNAL: ContractEntryPointFields[];
    L1_HANDLER: ContractEntryPointFields[];
};
type ContractEntryPointFields = {
    selector: string;
    offset: string;
    builtins?: Builtins;
};
interface Program extends Record<string, any> {
    builtins: string[];
    data: string[];
}

/** SYSTEM TYPES */
type CairoAssembly = {
    prime: string;
    compiler_version: string;
    bytecode: ByteCode;
    hints: any[];
    pythonic_hints: PythonicHints;
    entry_points_by_type: EntryPointsByType;
};
/** COMPILED CONTRACT */
/**
 * format produced after starknet-compile .cairo to .json
 * sierra_program is hex array
 */
type CompiledSierra = {
    sierra_program: ByteCode;
    sierra_program_debug_info?: SierraProgramDebugInfo;
    contract_class_version: string;
    entry_points_by_type: SierraEntryPointsByType;
    abi: Abi;
};
/**
 * format produced after compressing 'sierra_program', stringifies 'abi' property and omit sierra_program_debug_info
 * CompressedCompiledSierra
 */
type SierraContractClass = Omit<CompiledSierra, 'abi' | 'sierra_program_debug_info'> & {
    sierra_program: string;
    abi: string;
};
type CompiledSierraCasm = CairoAssembly;
/** SUBTYPES */
type ByteCode = string[];
type PythonicHints = [number, string[]][];
type SierraProgramDebugInfo = {
    type_names: [number, string][];
    libfunc_names: [number, string][];
    user_func_names: [number, string][];
};
type SierraEntryPointsByType = {
    CONSTRUCTOR: SierraContractEntryPointFields[];
    EXTERNAL: SierraContractEntryPointFields[];
    L1_HANDLER: SierraContractEntryPointFields[];
};
type SierraContractEntryPointFields = {
    selector: string;
    function_idx: number;
};

/**
 * format produced after compressing compiled contract
 * CompressedCompiledContract
 */
type ContractClass$1 = LegacyContractClass | SierraContractClass;
/**
 * format produced after compile .cairo to .json
 */
type CompiledContract = LegacyCompiledContract | CompiledSierra;
/**
 * Compressed or decompressed Cairo0 or Cairo1 Contract
 */
type CairoContract = ContractClass$1 | CompiledContract;
declare enum EntryPointType {
    EXTERNAL = "EXTERNAL",
    L1_HANDLER = "L1_HANDLER",
    CONSTRUCTOR = "CONSTRUCTOR"
}

type WeierstrassSignatureType = weierstrass.SignatureType;
type ArraySignatureType = string[];
type Signature = ArraySignatureType | WeierstrassSignatureType;
type BigNumberish = string | number | bigint;
/**
 * Compiled calldata ready to be sent
 * decimal-string array
 */
type Calldata = string[] & {
    readonly __compiled__?: boolean;
};
/**
 * Represents an integer in the range [0, 2^256)
 */
interface Uint256 {
    low: BigNumberish;
    high: BigNumberish;
}
/**
 * BigNumberish array
 * use CallData.compile() to convert to Calldata
 */
type RawCalldata = BigNumberish[];
/**
 * Hexadecimal-string array
 */
type HexCalldata = string[];
type AllowArray<T> = T | T[];
type OptionalPayload<T> = {
    payload: T;
} | T;
type RawArgs = RawArgsObject | RawArgsArray;
type RawArgsObject = {
    [inputName: string]: MultiType | MultiType[] | RawArgs;
};
type RawArgsArray = Array<MultiType | MultiType[] | RawArgs>;
type MultiType = BigNumberish | Uint256 | object | boolean | CairoEnum;
type UniversalDeployerContractPayload = {
    classHash: BigNumberish;
    salt?: string;
    unique?: boolean;
    constructorCalldata?: RawArgs;
};
type DeployAccountContractPayload = {
    classHash: string;
    constructorCalldata?: RawArgs;
    addressSalt?: BigNumberish;
    contractAddress?: string;
};
type DeployAccountContractTransaction = Omit<DeployAccountContractPayload, 'contractAddress'> & {
    signature?: Signature;
};
type DeclareContractPayload = {
    contract: CompiledContract | string;
    classHash?: string;
    casm?: CompiledSierraCasm;
    compiledClassHash?: string;
};
type CompleteDeclareContractPayload = {
    contract: CompiledContract | string;
    classHash: string;
    casm?: CompiledSierraCasm;
    compiledClassHash?: string;
};
type DeclareAndDeployContractPayload = Omit<UniversalDeployerContractPayload, 'classHash'> & DeclareContractPayload;
type DeclareContractTransaction = {
    contract: ContractClass$1;
    senderAddress: string;
    signature?: Signature;
    compiledClassHash?: string;
};
type CallDetails = {
    contractAddress: string;
    calldata?: RawArgs | Calldata;
    entrypoint?: string;
};
type Invocation = CallDetails & {
    signature?: Signature;
};
type Call = CallDetails & {
    entrypoint: string;
};
type CairoVersion = '0' | '1';
type InvocationsDetails = {
    nonce?: BigNumberish;
    maxFee?: BigNumberish;
    version?: BigNumberish;
};
/**
 * Contain all additional details params
 */
type Details = {
    nonce: BigNumberish;
    maxFee: BigNumberish;
    version: BigNumberish;
    chainId: StarknetChainId;
};
type InvocationsDetailsWithNonce = InvocationsDetails & {
    nonce: BigNumberish;
};
declare enum TransactionType$1 {
    DECLARE = "DECLARE",
    DEPLOY = "DEPLOY",
    DEPLOY_ACCOUNT = "DEPLOY_ACCOUNT",
    INVOKE = "INVOKE_FUNCTION"
}
/**
 * new statuses are defined by props: finality_status and execution_status
 * to be #deprecated
 */
declare enum TransactionStatus {
    NOT_RECEIVED = "NOT_RECEIVED",
    RECEIVED = "RECEIVED",
    ACCEPTED_ON_L2 = "ACCEPTED_ON_L2",
    ACCEPTED_ON_L1 = "ACCEPTED_ON_L1",
    REJECTED = "REJECTED",
    REVERTED = "REVERTED"
}
declare enum TransactionFinalityStatus$1 {
    NOT_RECEIVED = "NOT_RECEIVED",
    RECEIVED = "RECEIVED",
    ACCEPTED_ON_L2 = "ACCEPTED_ON_L2",
    ACCEPTED_ON_L1 = "ACCEPTED_ON_L1"
}
declare enum TransactionExecutionStatus$1 {
    REJECTED = "REJECTED",
    REVERTED = "REVERTED",
    SUCCEEDED = "SUCCEEDED"
}
declare enum BlockStatus {
    PENDING = "PENDING",
    ACCEPTED_ON_L1 = "ACCEPTED_ON_L1",
    ACCEPTED_ON_L2 = "ACCEPTED_ON_L2",
    REJECTED = "REJECTED"
}
declare enum BlockTag {
    pending = "pending",
    latest = "latest"
}
type BlockNumber = BlockTag | null | number;
/**
 * hex string and BN are detected as block hashes
 * decimal string and number are detected as block numbers
 * null appends nothing to the request url
 */
type BlockIdentifier = BlockNumber | BigNumberish;
/**
 * items used by AccountInvocations
 */
type AccountInvocationItem = (({
    type: TransactionType$1.DECLARE;
} & DeclareContractTransaction) | ({
    type: TransactionType$1.DEPLOY_ACCOUNT;
} & DeployAccountContractTransaction) | ({
    type: TransactionType$1.INVOKE;
} & Invocation)) & InvocationsDetailsWithNonce;
/**
 * Complete invocations array with account details (internal type from account -> provider)
 */
type AccountInvocations = AccountInvocationItem[];
/**
 * Invocations array user provide to bulk method (simulate)
 */
type Invocations = Array<({
    type: TransactionType$1.DECLARE;
} & OptionalPayload<DeclareContractPayload>) | ({
    type: TransactionType$1.DEPLOY;
} & OptionalPayload<AllowArray<UniversalDeployerContractPayload>>) | ({
    type: TransactionType$1.DEPLOY_ACCOUNT;
} & OptionalPayload<DeployAccountContractPayload>) | ({
    type: TransactionType$1.INVOKE;
} & OptionalPayload<AllowArray<Call>>)>;
type Tupled = {
    element: any;
    type: string;
};
type Args = {
    [inputName: string]: BigNumberish | BigNumberish[] | ParsedStruct | ParsedStruct[];
};
type ParsedStruct = {
    [key: string]: BigNumberish | BigNumberish[] | ParsedStruct | Uint256;
};
type waitForTransactionOptions = {
    retryInterval?: number;
    successStates?: Array<TransactionFinalityStatus$1 | TransactionExecutionStatus$1>;
    errorStates?: Array<TransactionFinalityStatus$1 | TransactionExecutionStatus$1>;
};
type getSimulateTransactionOptions = {
    blockIdentifier?: BlockIdentifier;
    skipValidate?: boolean;
    skipExecute?: boolean;
    skipFeeCharge?: boolean;
};
type getEstimateFeeBulkOptions = {
    blockIdentifier?: BlockIdentifier;
    skipValidate?: boolean;
};
interface CallStruct {
    to: string;
    selector: string;
    calldata: string[];
}

interface ProviderOptions {
    sequencer?: SequencerProviderOptions;
    rpc?: RpcProviderOptions;
}
type RpcProviderOptions = {
    nodeUrl: string;
    retries?: number;
    headers?: object;
    blockIdentifier?: BlockIdentifier;
    chainId?: StarknetChainId;
};
type SequencerHttpMethod = 'POST' | 'GET';
type SequencerProviderOptions = {
    headers?: Record<string, string>;
    blockIdentifier?: BlockIdentifier;
    chainId?: StarknetChainId;
} & ({
    network: NetworkName | StarknetChainId;
} | {
    baseUrl: string;
    feederGatewayUrl?: string;
    gatewayUrl?: string;
});

/**
 * TypeScript Representation of 'starknet-specs' (OpenRpc protocol types)
 * https://github.com/starkware-libs/starknet-specs/tree/v0.4.0-rc3
 *
 * Starknet Node Read API  0.4.0 - rpc tag v0.4.0-rc3
 * Starknet Node Write API 0.4.0 - rpc tag v0.4.0-rc3
 * Starknet Node Trace API 0.4.0 - rpc tag v0.4.0-rc3
 */
/**
 * A field element. represented by at most 63 hex digits
 * @pattern ^0x(0|[a-fA-F1-9]{1}[a-fA-F0-9]{0,62})$
 */
type FELT = string;
type ADDRESS = FELT;
type NUM_AS_HEX = string;
type SIGNATURE = Array<FELT>;
/**
 * an ethereum address represented as 40 hex digits
 * @pattern ^0x[a-fA-F0-9]{40}$
 */
type ETH_ADDRESS = string;
type BLOCK_NUMBER = number;
type BLOCK_HASH = FELT;
type TXN_HASH = FELT;
declare enum TXN_TYPE {
    DECLARE = "DECLARE",
    DEPLOY = "DEPLOY",
    DEPLOY_ACCOUNT = "DEPLOY_ACCOUNT",
    INVOKE = "INVOKE",
    L1_HANDLER = "L1_HANDLER"
}
type BLOCK_STATUS = 'PENDING' | 'ACCEPTED_ON_L2' | 'ACCEPTED_ON_L1' | 'REJECTED';
declare enum BLOCK_TAG {
    latest = "latest",
    pending = "pending"
}
type BLOCK_ID = {
    block_hash: BLOCK_HASH;
} | {
    block_number: BLOCK_NUMBER;
} | BLOCK_TAG;
type MSG_TO_L1 = {
    to_address: FELT;
    payload: Array<FELT>;
};
type MSG_FROM_L1 = {
    from_address: ETH_ADDRESS;
    to_address: ADDRESS;
    entry_point_selector: FELT;
    payload: FELT[];
};
declare enum TXN_FINALITY_STATUS {
    ACCEPTED_ON_L2 = "ACCEPTED_ON_L2",
    ACCEPTED_ON_L1 = "ACCEPTED_ON_L1"
}
declare enum TXN_EXECUTION_STATUS {
    SUCCEEDED = "SUCCEEDED",
    REVERTED = "REVERTED"
}
type EVENT = {
    from_address: FELT;
    keys: Array<FELT>;
    data: Array<FELT>;
};
type COMMON_RECEIPT_PROPERTIES = {
    transaction_hash: TXN_HASH;
    actual_fee: FELT;
    execution_status: TXN_EXECUTION_STATUS;
    finality_status: TXN_FINALITY_STATUS;
    block_hash?: BLOCK_HASH;
    block_number?: BLOCK_NUMBER;
    messages_sent: Array<MSG_TO_L1>;
    events: Array<EVENT>;
    revert_reason?: string;
};
type PENDING_COMMON_RECEIPT_PROPERTIES = {
    transaction_hash: TXN_HASH;
    actual_fee: FELT;
    type?: TXN_TYPE;
    messages_sent: Array<MSG_TO_L1>;
    events: Array<EVENT>;
    execution_status: TXN_EXECUTION_STATUS;
    finality_status: TXN_FINALITY_STATUS;
    revert_reason?: string;
};
type INVOKE_TXN_RECEIPT = {
    type: 'INVOKE';
} & COMMON_RECEIPT_PROPERTIES;
type DECLARE_TXN_RECEIPT = {
    type: 'DECLARE';
} & COMMON_RECEIPT_PROPERTIES;
type DEPLOY_TXN_RECEIPT = {
    type: 'DEPLOY';
    contract_address: FELT;
} & COMMON_RECEIPT_PROPERTIES;
type L1_HANDLER_TXN_RECEIPT = {
    type: 'L1_HANDLER';
} & COMMON_RECEIPT_PROPERTIES;
type PENDING_DEPLOY_TXN_RECEIPT = {
    contract_address: FELT;
} & PENDING_COMMON_RECEIPT_PROPERTIES;
type PENDING_TXN_RECEIPT = PENDING_DEPLOY_TXN_RECEIPT | PENDING_COMMON_RECEIPT_PROPERTIES;
type TXN_RECEIPT = INVOKE_TXN_RECEIPT | L1_HANDLER_TXN_RECEIPT | DECLARE_TXN_RECEIPT | DEPLOY_TXN_RECEIPT | DEPLOY_ACCOUNT_TXN_RECEIPT | PENDING_TXN_RECEIPT;
type BLOCK_HEADER = {
    block_hash: BLOCK_HASH;
    parent_hash: BLOCK_HASH;
    block_number: BLOCK_NUMBER;
    new_root: FELT;
    timestamp: number;
    sequencer_address: FELT;
};
type BLOCK_BODY_WITH_TX_HASHES = {
    transactions: Array<TXN_HASH>;
};
type BLOCK_WITH_TX_HASHES = {
    status: BLOCK_STATUS;
} & BLOCK_HEADER & BLOCK_BODY_WITH_TX_HASHES;
type PENDING_BLOCK_WITH_TX_HASHES = BLOCK_BODY_WITH_TX_HASHES & {
    timestamp: number;
    sequencer_address: FELT;
    parent_hash: BLOCK_HASH;
};
type FUNCTION_CALL = {
    contract_address: ADDRESS;
    entry_point_selector: FELT;
    calldata: Array<FELT>;
};
type INVOKE_TXN = INVOKE_TXN_V0 | INVOKE_TXN_V1;
type DECLARE_TXN = DECLARE_TXN_V1 | DECLARE_TXN_V2;
type DECLARE_TXN_V1 = {
    type: 'DECLARE';
    sender_address: ADDRESS;
    max_fee: FELT;
    version: '0x1';
    signature: SIGNATURE;
    nonce: FELT;
} & ({
    contract_class: DEPRECATED_CONTRACT_CLASS;
} | {
    class_hash: FELT;
});
type DECLARE_TXN_V2 = {
    type: 'DECLARE';
    sender_address: ADDRESS;
    compiled_class_hash: FELT;
    max_fee: FELT;
    version: '0x2';
    signature: SIGNATURE;
    nonce: FELT;
} & ({
    contract_class: CONTRACT_CLASS;
} | {
    class_hash: FELT;
});
type DEPLOY_ACCOUNT_TXN = {
    type: 'DEPLOY_ACCOUNT';
    max_fee: FELT;
    version: NUM_AS_HEX;
    signature: SIGNATURE;
    nonce: FELT;
    contract_address_salt: FELT;
    constructor_calldata: FELT[];
    class_hash: FELT;
};
type DEPLOY_TXN = {
    type: 'DEPLOY';
    contract_address_salt: FELT;
    constructor_calldata: FELT[];
    class_hash: FELT;
    version: NUM_AS_HEX;
};
type DEPLOY_ACCOUNT_TXN_RECEIPT = COMMON_RECEIPT_PROPERTIES & {
    type: 'DEPLOY_ACCOUNT';
    contract_address: FELT;
};
type TXN = INVOKE_TXN | L1_HANDLER_TXN | DECLARE_TXN | DEPLOY_TXN | DEPLOY_ACCOUNT_TXN;
type TXN_WITH_HASH = TXN & {
    transaction_hash: TXN_HASH;
};
declare enum L1_HANDLER {
    'L1_HANDLER' = 0
}
type L1_HANDLER_TXN = {
    version: NUM_AS_HEX;
    type: L1_HANDLER;
    nonce: NUM_AS_HEX;
} & FUNCTION_CALL;
type INVOKE_TXN_V0 = {
    type: 'INVOKE';
    max_fee: FELT;
    version: '0x0';
    signature: SIGNATURE;
    contract_address: ADDRESS;
    entry_point_selector: FELT;
    calldata: FELT[];
};
type INVOKE_TXN_V1 = {
    type: 'INVOKE';
    sender_address: ADDRESS;
    calldata: FELT[];
    max_fee: FELT;
    version: '0x1';
    signature: SIGNATURE;
    nonce: FELT;
};
type BLOCK_BODY_WITH_TXS = {
    transactions: Array<TXN_WITH_HASH>;
};
type BLOCK_WITH_TXS = {
    status: BLOCK_STATUS;
} & BLOCK_HEADER & BLOCK_BODY_WITH_TXS;
type PENDING_BLOCK_WITH_TXS = BLOCK_BODY_WITH_TXS & {
    timestamp: number;
    sequencer_address: FELT;
    parent_hash: BLOCK_HASH;
};
type CONTRACT_CLASS = {
    sierra_program: Array<FELT>;
    contract_class_version: string;
    entry_points_by_type: {
        CONSTRUCTOR: Array<SIERRA_ENTRY_POINT>;
        EXTERNAL: Array<SIERRA_ENTRY_POINT>;
        L1_HANDLER: Array<SIERRA_ENTRY_POINT>;
    };
    abi?: string;
};
type DEPRECATED_CONTRACT_CLASS = {
    program: string;
    entry_points_by_type: {
        CONSTRUCTOR: Array<DEPRECATED_CAIRO_ENTRY_POINT>;
        EXTERNAL: Array<DEPRECATED_CAIRO_ENTRY_POINT>;
        L1_HANDLER: Array<DEPRECATED_CAIRO_ENTRY_POINT>;
    };
    abi?: CONTRACT_ABI;
};
type CONTRACT_ABI = Array<CONTRACT_ABI_ENTRY>;
type CONTRACT_ABI_ENTRY = FUNCTION_ABI_ENTRY | EVENT_ABI_ENTRY | STRUCT_ABI_ENTRY;
declare enum STRUCT_ABI_TYPE {
    'struct' = 0
}
declare enum EVENT_ABI_TYPE {
    'event' = 0
}
declare enum FUNCTION_ABI_TYPE {
    'function' = 0,
    'l1_handler' = 1,
    'constructor' = 2
}
type STRUCT_ABI_ENTRY = STRUCT_ABI_TYPE & {
    name: string;
    size: number;
    members: Array<STRUCT_MEMBER>;
};
type STRUCT_MEMBER = {
    offset: number;
} & TYPED_PARAMETER;
type EVENT_ABI_ENTRY = {
    name: string;
    keys: Array<TYPED_PARAMETER>;
    data: Array<TYPED_PARAMETER>;
} & EVENT_ABI_TYPE;
type FUNCTION_ABI_ENTRY = {
    type: FUNCTION_ABI_TYPE;
    name: string;
    inputs: Array<TYPED_PARAMETER>;
    outputs: Array<TYPED_PARAMETER>;
};
type TYPED_PARAMETER = {
    name: string;
    type: string;
};
type DEPRECATED_CAIRO_ENTRY_POINT = {
    offset: NUM_AS_HEX;
    selector: FELT;
};
type SIERRA_ENTRY_POINT = {
    selector: FELT;
    function_idx: number;
};
type CONTRACT_STORAGE_DIFF_ITEM = {
    address: FELT;
    storage_entries: {
        key: FELT;
        value: FELT;
    }[];
};
type DEPLOYED_CONTRACT_ITEM = {
    address: FELT;
    class_hash: FELT;
};
type STATE_UPDATE = {
    block_hash: BLOCK_HASH;
    new_root: FELT;
} & PENDING_STATE_UPDATE;
type PENDING_STATE_UPDATE = {
    old_root: FELT;
    state_diff: {
        storage_diffs: Array<CONTRACT_STORAGE_DIFF_ITEM>;
        deprecated_declared_classes: Array<FELT>;
        declared_classes: Array<{
            class_hash: FELT;
            compiled_class_hash: FELT;
        }>;
        deployed_contracts: Array<DEPLOYED_CONTRACT_ITEM>;
        replaced_classes: Array<{
            contract_address: ADDRESS;
            class_hash: FELT;
        }>;
        nonces: Array<{
            contract_address: ADDRESS;
            nonce: FELT;
        }>;
    };
};
/**
 * A storage key. Represented as up to 62 hex digits, 3 bits, and 5 leading zeroes.
 * @pattern ^0x0[0-7]{1}[a-fA-F0-9]{0,62}$
 */
type STORAGE_KEY = string;
type EVENT_FILTER = {
    from_block?: BLOCK_ID;
    to_block?: BLOCK_ID;
    address?: ADDRESS;
    keys?: Array<Array<FELT>>;
};
type EVENTS_CHUNK = {
    events: Array<EMITTED_EVENT>;
    continuation_token?: string;
};
type RESULT_PAGE_REQUEST = {
    continuation_token?: string;
    chunk_size: number;
};
type EMITTED_EVENT = EVENT & {
    block_hash: BLOCK_HASH;
    block_number: BLOCK_NUMBER;
    transaction_hash: TXN_HASH;
};
type SYNC_STATUS = {
    starting_block_hash: BLOCK_HASH;
    starting_block_num: BLOCK_NUMBER;
    current_block_hash: BLOCK_HASH;
    current_block_num: BLOCK_NUMBER;
    highest_block_hash: BLOCK_HASH;
    highest_block_num: BLOCK_NUMBER;
};
type FEE_ESTIMATE = {
    gas_consumed: NUM_AS_HEX;
    gas_price: NUM_AS_HEX;
    overall_fee: NUM_AS_HEX;
};
declare enum CALL_TYPE {
    'LIBRARY_CALL' = 0,
    'CALL' = 1
}
declare enum ENTRY_POINT_TYPE {
    'EXTERNAL' = 0,
    'L1_HANDLER' = 1,
    'CONSTRUCTOR' = 2
}
type FUNCTION_INVOCATION = FUNCTION_CALL & {
    caller_address: FELT;
    class_hash: FELT;
    entry_point_type: ENTRY_POINT_TYPE;
    call_type: CALL_TYPE;
    result: FELT;
    calls: NESTED_CALL;
    events: Array<EVENT>;
    messages: MSG_TO_L1;
};
type NESTED_CALL = FUNCTION_INVOCATION;
type INVOKE_TXN_TRACE = {
    validate_invocation: FUNCTION_INVOCATION;
    execute_invocation: FUNCTION_INVOCATION | {
        revert_reason: string;
    };
    fee_transfer_invocation: FUNCTION_INVOCATION;
};
type DECLARE_TXN_TRACE = {
    validate_invocation: FUNCTION_INVOCATION;
    fee_transfer_invocation: FUNCTION_INVOCATION;
};
type DEPLOY_ACCOUNT_TXN_TRACE = {
    validate_invocation: FUNCTION_INVOCATION;
    constructor_invocation: FUNCTION_INVOCATION;
    fee_transfer_invocation: FUNCTION_INVOCATION;
};
type L1_HANDLER_TXN_TRACE = {
    function_invocation: FUNCTION_INVOCATION;
};
type TRANSACTION_TRACE = INVOKE_TXN_TRACE | DECLARE_TXN_TRACE | DEPLOY_ACCOUNT_TXN_TRACE | L1_HANDLER_TXN_TRACE;
declare enum SIMULATION_FLAG$1 {
    SKIP_VALIDATE = "SKIP_VALIDATE",
    SKIP_FEE_CHARGE = "SKIP_FEE_CHARGE"
}
declare namespace OPENRPC {
    type Nonce = FELT;
    type BlockWithTxHashes = BLOCK_WITH_TX_HASHES | PENDING_BLOCK_WITH_TX_HASHES;
    type BlockWithTxs = BLOCK_WITH_TXS | PENDING_BLOCK_WITH_TXS;
    type StateUpdate = STATE_UPDATE | PENDING_STATE_UPDATE;
    type Storage = FELT;
    type Transaction = TXN;
    type TransactionWithHash = TXN_WITH_HASH;
    type TransactionReceipt = TXN_RECEIPT;
    type ContractClass = CONTRACT_CLASS;
    type DeprecatedContractClass = DEPRECATED_CONTRACT_CLASS;
    type CallResponse = Array<FELT>;
    type EstimatedFee = FEE_ESTIMATE;
    type BlockNumber = BLOCK_NUMBER;
    type BlockHashAndNumber = {
        block_hash: BLOCK_HASH;
        block_number: BLOCK_NUMBER;
    };
    type CHAIN_ID = string;
    type PendingTransactions = Array<TransactionWithHash>;
    type SyncingStatus = false | SYNC_STATUS;
    type Events = EVENTS_CHUNK;
    type Trace = TRANSACTION_TRACE;
    type Traces = Array<{
        transaction_hash: FELT;
        trace_root: TRANSACTION_TRACE;
    }>;
    type TransactionHash = TXN_HASH;
    type BlockHash = BLOCK_HASH;
    type EventFilter = EVENT_FILTER & RESULT_PAGE_REQUEST;
    type InvokedTransaction = {
        transaction_hash: TXN_HASH;
    };
    type DeclaredTransaction = {
        transaction_hash: TXN_HASH;
        class_hash: FELT;
    };
    type DeployedTransaction = {
        transaction_hash: TXN_HASH;
        contract_address: FELT;
    };
    type SimulationFlags = Array<SIMULATION_FLAG$1>;
    type SimulatedTransaction = {
        transaction_trace: Trace;
        fee_estimation: EstimatedFee;
    };
    type SimulatedTransactions = SimulatedTransaction[];
    type BaseTransaction = DECLARE_TXN | INVOKE_TXN | DEPLOY_ACCOUNT_TXN;
    type Methods = {
        starknet_getBlockWithTxHashes: {
            params: {
                block_id: BLOCK_ID;
            };
            result: BlockWithTxHashes;
            errors: Errors.BLOCK_NOT_FOUND;
        };
        starknet_getBlockWithTxs: {
            params: {
                block_id: BLOCK_ID;
            };
            result: BlockWithTxs;
            errors: Errors.BLOCK_NOT_FOUND;
        };
        starknet_getStateUpdate: {
            params: {
                block_id: BLOCK_ID;
            };
            result: StateUpdate;
            errors: Errors.BLOCK_NOT_FOUND;
        };
        starknet_getStorageAt: {
            params: {
                contract_address: ADDRESS;
                key: STORAGE_KEY;
                block_id: BLOCK_ID;
            };
            result: Storage;
            errors: Errors.CONTRACT_NOT_FOUND | Errors.BLOCK_NOT_FOUND;
        };
        starknet_getTransactionByHash: {
            params: {
                transaction_hash: TXN_HASH;
            };
            result: TransactionWithHash;
            errors: Errors.TXN_HASH_NOT_FOUND;
        };
        starknet_getTransactionByBlockIdAndIndex: {
            params: {
                block_id: BLOCK_ID;
                index: number;
            };
            result: TransactionWithHash;
            errors: Errors.BLOCK_NOT_FOUND | Errors.INVALID_TXN_INDEX;
        };
        starknet_getTransactionReceipt: {
            params: {
                transaction_hash: TXN_HASH;
            };
            result: TransactionReceipt;
            errors: Errors.TXN_HASH_NOT_FOUND;
        };
        starknet_getClass: {
            params: {
                block_id: BLOCK_ID;
                class_hash: FELT;
            };
            result: ContractClass | DeprecatedContractClass;
            errors: Errors.BLOCK_NOT_FOUND | Errors.CLASS_HASH_NOT_FOUND;
        };
        starknet_getClassHashAt: {
            params: {
                block_id: BLOCK_ID;
                contract_address: ADDRESS;
            };
            result: FELT;
            errors: Errors.BLOCK_NOT_FOUND | Errors.CONTRACT_NOT_FOUND;
        };
        starknet_getClassAt: {
            params: {
                block_id: BLOCK_ID;
                contract_address: ADDRESS;
            };
            result: ContractClass | DeprecatedContractClass;
            errors: Errors.BLOCK_NOT_FOUND | Errors.CONTRACT_NOT_FOUND;
        };
        starknet_getBlockTransactionCount: {
            params: {
                block_id: BLOCK_ID;
            };
            result: number;
            errors: Errors.BLOCK_NOT_FOUND;
        };
        starknet_call: {
            params: {
                request: FUNCTION_CALL;
                block_id: BLOCK_ID;
            };
            result: Array<FELT>;
            errors: Errors.CONTRACT_NOT_FOUND | Errors.INVALID_MESSAGE_SELECTOR | Errors.INVALID_CALL_DATA | Errors.CONTRACT_ERROR | Errors.BLOCK_NOT_FOUND;
        };
        starknet_estimateFee: {
            params: {
                request: Array<BaseTransaction>;
                block_id: BLOCK_ID;
            };
            result: Array<FEE_ESTIMATE>;
            errors: Errors.CONTRACT_NOT_FOUND | Errors.CONTRACT_ERROR | Errors.BLOCK_NOT_FOUND;
        };
        /**
         * estimate the L2 fee of a message sent on L1
         * estimates the resources required by the l1_handler transaction induced by the message
         */
        starknet_estimateMessageFee: {
            params: {
                message: MSG_FROM_L1;
                block_id: BLOCK_ID;
            };
            result: FEE_ESTIMATE;
            errors: Errors.CONTRACT_NOT_FOUND | Errors.CONTRACT_ERROR | Errors.BLOCK_NOT_FOUND;
        };
        starknet_blockNumber: {
            params: {};
            result: BLOCK_NUMBER;
            errors: Errors.NO_BLOCKS;
        };
        starknet_blockHashAndNumber: {
            params: {};
            result: BLOCK_HASH & BLOCK_NUMBER;
            errors: Errors.NO_BLOCKS;
        };
        starknet_chainId: {
            params: {};
            result: CHAIN_ID;
        };
        starknet_pendingTransactions: {
            params: {};
            result: PendingTransactions;
        };
        starknet_syncing: {
            params: {};
            result: SyncingStatus;
        };
        starknet_getEvents: {
            params: {
                filter: EVENT_FILTER & RESULT_PAGE_REQUEST;
            };
            result: Events;
            errors: Errors.PAGE_SIZE_TOO_BIG | Errors.INVALID_CONTINUATION_TOKEN | Errors.BLOCK_NOT_FOUND | Errors.TOO_MANY_KEYS_IN_FILTER;
        };
        starknet_getNonce: {
            params: {
                block_id: BLOCK_ID;
                contract_address: ADDRESS;
            };
            result: FELT;
            errors: Errors.BLOCK_NOT_FOUND | Errors.CONTRACT_NOT_FOUND;
        };
        starknet_addInvokeTransaction: {
            params: {
                invoke_transaction: INVOKE_TXN_V1;
            };
            result: InvokedTransaction;
            errors: Errors.INSUFFICIENT_ACCOUNT_BALANCE | Errors.INSUFFICIENT_MAX_FEE | Errors.INVALID_TRANSACTION_NONCE | Errors.VALIDATION_FAILURE | Errors.NON_ACCOUNT | Errors.DUPLICATE_TX | Errors.UNSUPPORTED_TX_VERSION | Errors.UNEXPECTED_ERROR;
        };
        starknet_addDeclareTransaction: {
            params: {
                declare_transaction: DECLARE_TXN;
            };
            result: DeclaredTransaction;
            errors: Errors.CLASS_ALREADY_DECLARED | Errors.COMPILATION_FAILED | Errors.COMPILED_CLASS_HASH_MISMATCH | Errors.INSUFFICIENT_ACCOUNT_BALANCE | Errors.INSUFFICIENT_MAX_FEE | Errors.INVALID_TRANSACTION_NONCE | Errors.VALIDATION_FAILURE | Errors.NON_ACCOUNT | Errors.DUPLICATE_TX | Errors.CONTRACT_CLASS_SIZE_IS_TOO_LARGE | Errors.UNSUPPORTED_TX_VERSION | Errors.UNSUPPORTED_CONTRACT_CLASS_VERSION | Errors.UNEXPECTED_ERROR;
        };
        starknet_addDeployAccountTransaction: {
            params: {
                deploy_account_transaction: DEPLOY_ACCOUNT_TXN;
            };
            result: {
                transaction_hash: TXN_HASH;
                contract_address: FELT;
            };
            errors: Errors.INSUFFICIENT_ACCOUNT_BALANCE | Errors.INSUFFICIENT_MAX_FEE | Errors.INVALID_TRANSACTION_NONCE | Errors.VALIDATION_FAILURE | Errors.NON_ACCOUNT | Errors.CLASS_HASH_NOT_FOUND | Errors.DUPLICATE_TX | Errors.UNSUPPORTED_TX_VERSION | Errors.UNEXPECTED_ERROR;
        };
        starknet_traceTransaction: {
            params: {
                transaction_hash: TXN_HASH;
            };
            result: Trace;
            errors: Errors.INVALID_TXN_HASH | Errors.NO_TRACE_AVAILABLE;
        };
        starknet_traceBlockTransactions: {
            params: {
                block_hash: BLOCK_HASH;
            };
            result: Traces;
            errors: Errors.INVALID_BLOCK_HASH;
        };
        /**
         * simulate a given sequence of transactions on the requested state, and generate the execution traces.
         * If one of the transactions is reverted, raises CONTRACT_ERROR
         */
        starknet_simulateTransactions: {
            params: {
                block_id: BLOCK_ID;
                transactions: Array<BaseTransaction>;
                simulation_flags: Array<SIMULATION_FLAG$1>;
            };
            result: SimulatedTransactions;
            errors: Errors.CONTRACT_NOT_FOUND | Errors.CONTRACT_ERROR | Errors.BLOCK_NOT_FOUND;
        };
    };
}
declare namespace Errors {
    interface FAILED_TO_RECEIVE_TXN {
        code: 1;
        message: 'Failed to write transaction';
    }
    interface NO_TRACE_AVAILABLE {
        code: 10;
        message: 'No trace available for transaction';
        data: {
            status: 'RECEIVED' | 'REJECTED';
        };
    }
    interface CONTRACT_NOT_FOUND {
        code: 20;
        message: 'Contract not found';
    }
    interface INVALID_MESSAGE_SELECTOR {
        code: 21;
        message: 'Invalid message selector';
    }
    interface INVALID_CALL_DATA {
        code: 22;
        message: 'Invalid call data';
    }
    interface BLOCK_NOT_FOUND {
        code: 24;
        message: 'Block not found';
    }
    interface INVALID_TXN_HASH {
        code: 25;
        message: 'Invalid transaction hash';
    }
    interface INVALID_BLOCK_HASH {
        code: 26;
        message: 'Invalid block hash';
    }
    interface INVALID_TXN_INDEX {
        code: 27;
        message: 'Invalid transaction index in a block';
    }
    interface CLASS_HASH_NOT_FOUND {
        code: 28;
        message: 'Class hash not found';
    }
    interface TXN_HASH_NOT_FOUND {
        code: 29;
        message: 'Transaction hash not found';
    }
    interface PAGE_SIZE_TOO_BIG {
        code: 31;
        message: 'Requested page size is too big';
    }
    interface NO_BLOCKS {
        code: 32;
        message: 'There are no blocks';
    }
    interface INVALID_CONTINUATION_TOKEN {
        code: 33;
        message: 'The supplied continuation token is invalid or unknown';
    }
    interface TOO_MANY_KEYS_IN_FILTER {
        code: 34;
        message: 'Too many keys provided in a filter';
    }
    interface CONTRACT_ERROR {
        code: 40;
        message: 'Contract error';
    }
    interface CLASS_ALREADY_DECLARED {
        code: 51;
        message: 'Class already declared';
    }
    interface INVALID_TRANSACTION_NONCE {
        code: 52;
        message: 'Invalid transaction nonce';
    }
    interface INSUFFICIENT_MAX_FEE {
        code: 53;
        message: 'Max fee is smaller than the minimal transaction cost (validation plus fee transfer)';
    }
    interface INSUFFICIENT_ACCOUNT_BALANCE {
        code: 54;
        message: "Account balance is smaller than the transaction's max_fee";
    }
    interface VALIDATION_FAILURE {
        code: 55;
        message: 'Account validation failed';
    }
    interface COMPILATION_FAILED {
        code: 56;
        message: 'Compilation failed';
    }
    interface CONTRACT_CLASS_SIZE_IS_TOO_LARGE {
        code: 57;
        message: 'Contract class size it too large';
    }
    interface NON_ACCOUNT {
        code: 58;
        message: 'Sender address in not an account contract';
    }
    interface DUPLICATE_TX {
        code: 59;
        message: 'A transaction with the same hash already exists in the mempool';
    }
    interface COMPILED_CLASS_HASH_MISMATCH {
        code: 60;
        message: 'the compiled class hash did not match the one supplied in the transaction';
    }
    interface UNSUPPORTED_TX_VERSION {
        code: 61;
        message: 'the transaction version is not supported';
    }
    interface UNSUPPORTED_CONTRACT_CLASS_VERSION {
        code: 62;
        message: 'the contract class version is not supported';
    }
    interface UNEXPECTED_ERROR {
        code: 63;
        message: 'An unexpected error occured';
        data: string;
    }
}

type Response = {
    id: number;
    jsonrpc: string;
    result?: any;
    error?: {
        code: string;
        message: string;
    };
};
type ChainId = OPENRPC.CHAIN_ID;
type CallResponse = OPENRPC.CallResponse;
type ContractAddress = ADDRESS;
type Felt = FELT;
type Nonce$2 = OPENRPC.Nonce;
type ContractClass = OPENRPC.ContractClass | OPENRPC.DeprecatedContractClass;
type StateUpdate = OPENRPC.StateUpdate;
type Transaction$1 = OPENRPC.Transaction;
type PendingTransactions = OPENRPC.PendingTransactions;
type TransactionHash = OPENRPC.TransactionHash;
type Trace = OPENRPC.Trace;
type Traces = OPENRPC.Traces;
type BlockHash = OPENRPC.BlockHash;
type BlockHashAndNumber = OPENRPC.BlockHashAndNumber;
type EstimateFeeResponse$2 = OPENRPC.EstimatedFee;
type GetBlockWithTxHashesResponse = OPENRPC.BlockWithTxHashes;
type GetBlockWithTxs = OPENRPC.BlockWithTxs;
type GetStorageAtResponse = OPENRPC.Storage;
type TransactionReceipt = OPENRPC.TransactionReceipt;
type GetTransactionByHashResponse = OPENRPC.Transaction;
type GetTransactionByBlockIdAndIndex = OPENRPC.Transaction;
type GetTransactionCountResponse = number;
type GetBlockNumberResponse = OPENRPC.BlockNumber;
type GetSyncingStatsResponse = OPENRPC.SyncingStatus;
type EventFilter = OPENRPC.EventFilter;
type GetEventsResponse = OPENRPC.Events;
type InvokedTransaction = OPENRPC.InvokedTransaction;
type DeclaredTransaction = OPENRPC.DeclaredTransaction;
type DeployedTransaction = OPENRPC.DeployedTransaction;
type SimulationFlags$1 = OPENRPC.SimulationFlags;
type EstimatedFee = OPENRPC.EstimatedFee;
type Methods = OPENRPC.Methods;
type Storage$2 = OPENRPC.Storage;
type SimulateTransactionResponse$2 = OPENRPC.SimulatedTransactions;
declare const TransactionType: typeof TXN_TYPE;
declare const SimulationFlag: typeof SIMULATION_FLAG$1;
declare const TransactionFinalityStatus: typeof TXN_FINALITY_STATUS;
declare const TransactionExecutionStatus: typeof TXN_EXECUTION_STATUS;
type BaseTransaction = OPENRPC.BaseTransaction & {
    version: string;
};
type StorageDiffs$1 = Array<CONTRACT_STORAGE_DIFF_ITEM>;
type DeprecatedDeclaredClasses = Array<FELT>;
type Nonces$1 = Array<{
    contract_address: ADDRESS;
    nonce: FELT;
}>;
type ReplacedClasses$1 = Array<{
    contract_address: ADDRESS;
    class_hash: FELT;
}>;

type rpc_BaseTransaction = BaseTransaction;
type rpc_BlockHash = BlockHash;
type rpc_BlockHashAndNumber = BlockHashAndNumber;
type rpc_CallResponse = CallResponse;
type rpc_ChainId = ChainId;
type rpc_ContractAddress = ContractAddress;
type rpc_ContractClass = ContractClass;
type rpc_DeclaredTransaction = DeclaredTransaction;
type rpc_DeployedTransaction = DeployedTransaction;
type rpc_DeprecatedDeclaredClasses = DeprecatedDeclaredClasses;
type rpc_EstimatedFee = EstimatedFee;
type rpc_EventFilter = EventFilter;
type rpc_Felt = Felt;
type rpc_GetBlockNumberResponse = GetBlockNumberResponse;
type rpc_GetBlockWithTxHashesResponse = GetBlockWithTxHashesResponse;
type rpc_GetBlockWithTxs = GetBlockWithTxs;
type rpc_GetEventsResponse = GetEventsResponse;
type rpc_GetStorageAtResponse = GetStorageAtResponse;
type rpc_GetSyncingStatsResponse = GetSyncingStatsResponse;
type rpc_GetTransactionByBlockIdAndIndex = GetTransactionByBlockIdAndIndex;
type rpc_GetTransactionByHashResponse = GetTransactionByHashResponse;
type rpc_GetTransactionCountResponse = GetTransactionCountResponse;
type rpc_InvokedTransaction = InvokedTransaction;
type rpc_Methods = Methods;
type rpc_PendingTransactions = PendingTransactions;
type rpc_Response = Response;
declare const rpc_SimulationFlag: typeof SimulationFlag;
type rpc_StateUpdate = StateUpdate;
type rpc_Trace = Trace;
type rpc_Traces = Traces;
declare const rpc_TransactionExecutionStatus: typeof TransactionExecutionStatus;
declare const rpc_TransactionFinalityStatus: typeof TransactionFinalityStatus;
type rpc_TransactionHash = TransactionHash;
type rpc_TransactionReceipt = TransactionReceipt;
declare const rpc_TransactionType: typeof TransactionType;
declare namespace rpc {
  export {
    rpc_BaseTransaction as BaseTransaction,
    rpc_BlockHash as BlockHash,
    rpc_BlockHashAndNumber as BlockHashAndNumber,
    rpc_CallResponse as CallResponse,
    rpc_ChainId as ChainId,
    rpc_ContractAddress as ContractAddress,
    rpc_ContractClass as ContractClass,
    rpc_DeclaredTransaction as DeclaredTransaction,
    rpc_DeployedTransaction as DeployedTransaction,
    rpc_DeprecatedDeclaredClasses as DeprecatedDeclaredClasses,
    EstimateFeeResponse$2 as EstimateFeeResponse,
    rpc_EstimatedFee as EstimatedFee,
    rpc_EventFilter as EventFilter,
    rpc_Felt as Felt,
    rpc_GetBlockNumberResponse as GetBlockNumberResponse,
    rpc_GetBlockWithTxHashesResponse as GetBlockWithTxHashesResponse,
    rpc_GetBlockWithTxs as GetBlockWithTxs,
    rpc_GetEventsResponse as GetEventsResponse,
    rpc_GetStorageAtResponse as GetStorageAtResponse,
    rpc_GetSyncingStatsResponse as GetSyncingStatsResponse,
    rpc_GetTransactionByBlockIdAndIndex as GetTransactionByBlockIdAndIndex,
    rpc_GetTransactionByHashResponse as GetTransactionByHashResponse,
    rpc_GetTransactionCountResponse as GetTransactionCountResponse,
    rpc_InvokedTransaction as InvokedTransaction,
    rpc_Methods as Methods,
    Nonce$2 as Nonce,
    Nonces$1 as Nonces,
    rpc_PendingTransactions as PendingTransactions,
    ReplacedClasses$1 as ReplacedClasses,
    rpc_Response as Response,
    SimulateTransactionResponse$2 as SimulateTransactionResponse,
    rpc_SimulationFlag as SimulationFlag,
    SimulationFlags$1 as SimulationFlags,
    rpc_StateUpdate as StateUpdate,
    Storage$2 as Storage,
    StorageDiffs$1 as StorageDiffs,
    rpc_Trace as Trace,
    rpc_Traces as Traces,
    Transaction$1 as Transaction,
    rpc_TransactionExecutionStatus as TransactionExecutionStatus,
    rpc_TransactionFinalityStatus as TransactionFinalityStatus,
    rpc_TransactionHash as TransactionHash,
    rpc_TransactionReceipt as TransactionReceipt,
    rpc_TransactionType as TransactionType,
  };
}

type GetTransactionStatusResponse = {
    tx_status: TransactionStatus;
    execution_status: TransactionExecutionStatus$1;
    finality_status: TransactionFinalityStatus$1;
    block_hash?: string;
    tx_failure_reason?: {
        code: string;
        error_message: string;
    };
    tx_revert_reason?: string;
};
type GetContractAddressesResponse = {
    Starknet: string;
    GpsStatementVerifier: string;
};
type FunctionInvocation = {
    caller_address: string;
    contract_address: string;
    calldata: RawCalldata;
    call_type?: string;
    class_hash?: string;
    selector?: string;
    entry_point_type?: EntryPointType.EXTERNAL;
    result: Array<any>;
    execution_resources: ExecutionResources;
    internal_calls: Array<FunctionInvocation>;
    events: Array<any>;
    messages: Array<any>;
};
type ExecutionResources = {
    n_steps: number;
    builtin_instance_counter: {
        pedersen_builtin: number;
        range_check_builtin: number;
        bitwise_builtin: number;
        output_builtin: number;
        ecdsa_builtin: number;
        ec_op_builtin?: number;
    };
    n_memory_holes: number;
};
type CallL1Handler = {
    from_address: string;
    to_address: string;
    entry_point_selector: string;
    payload: Array<string>;
};
type DeployedContractItem = {
    address: string;
    class_hash: string;
};
type SequencerIdentifier = {
    blockHash: string;
} | {
    blockNumber: BlockNumber;
};
type TransactionTraceResponse = {
    validate_invocation?: FunctionInvocation;
    function_invocation?: FunctionInvocation;
    fee_transfer_invocation?: FunctionInvocation;
    constructor_invocation?: FunctionInvocation;
    signature: string[];
};
type DeclareTransaction = {
    type: TransactionType$1.DECLARE;
    sender_address: string;
    contract_class: ContractClass$1;
    signature?: string[];
    nonce: BigNumberish;
    max_fee?: BigNumberish;
    version?: BigNumberish;
    compiled_class_hash?: string;
};
type DeployTransaction = {
    type: TransactionType$1.DEPLOY;
    contract_definition: ContractClass$1;
    contract_address_salt: BigNumberish;
    constructor_calldata: string[];
    nonce?: BigNumberish;
};
type DeployAccountTransaction = {
    type: TransactionType$1.DEPLOY_ACCOUNT;
    class_hash: string;
    contract_address_salt: BigNumberish;
    constructor_calldata: string[];
    signature?: string[];
    max_fee?: BigNumberish;
    version?: BigNumberish;
    nonce?: BigNumberish;
};
type InvokeFunctionTransaction = {
    type: TransactionType$1.INVOKE;
    sender_address: string;
    signature?: string[];
    entry_point_type?: EntryPointType.EXTERNAL;
    calldata?: RawCalldata;
    nonce: BigNumberish;
    max_fee?: BigNumberish;
    version?: BigNumberish;
};
type Transaction = DeclareTransaction | DeployTransaction | InvokeFunctionTransaction | DeployAccountTransaction;
type AddTransactionResponse = {
    transaction_hash: string;
    code?: 'TRANSACTION_RECEIVED';
    address?: string;
    class_hash?: string;
};
type GetCodeResponse$1 = {
    bytecode: ByteCode;
    abi: Abi;
};
interface InvokeFunctionTransactionResponse extends InvokeFunctionTransaction {
    transaction_hash: string;
    entry_point_selector: string;
}
type TransactionResponse = DeclareTransaction | DeployTransaction | InvokeFunctionTransactionResponse;
type SuccessfulTransactionResponse = {
    execution_status: TransactionExecutionStatus$1.SUCCEEDED;
    finality_status: TransactionFinalityStatus$1;
    status: TransactionStatus;
    block_hash: string;
    block_number: BlockNumber;
    transaction_index: number;
    transaction: TransactionResponse;
};
type RevertedTransactionResponse = {
    execution_status: TransactionExecutionStatus$1.REVERTED;
    finality_status: TransactionFinalityStatus$1;
    status: TransactionStatus;
    block_hash: string;
    block_number: BlockNumber;
    transaction_index: number;
    transaction: TransactionResponse;
    revert_error: string;
};
type FailedTransactionResponse = {
    status: TransactionStatus.REJECTED;
    transaction_failure_reason: {
        code: string;
        error_message: string;
    };
    transaction: TransactionResponse;
};
type GetTransactionResponse$1 = SuccessfulTransactionResponse | RevertedTransactionResponse | FailedTransactionResponse;
type TransactionReceiptResponse = SuccessfulTransactionReceiptResponse$1 | RevertedTransactionReceiptResponse$1 | RejectedTransactionReceiptResponse$1;
type SuccessfulTransactionReceiptResponse$1 = {
    execution_status: TransactionExecutionStatus$1.SUCCEEDED;
    finality_status: TransactionFinalityStatus$1;
    status: TransactionStatus;
    actual_fee: string;
    block_hash: string;
    block_number: BlockNumber;
    transaction_hash: string;
    transaction_index: number;
    l2_to_l1_messages: string[];
    events: string[];
    execution_resources?: ExecutionResources;
};
type RevertedTransactionReceiptResponse$1 = {
    execution_status: TransactionExecutionStatus$1.REVERTED;
    finality_status: TransactionFinalityStatus$1;
    status: TransactionStatus.REVERTED;
    actual_fee: string;
    block_hash: string;
    block_number: BlockNumber;
    transaction_hash: string;
    transaction_index: number;
    l2_to_l1_messages: string[];
    events: string[];
    revert_error: string;
};
type RejectedTransactionReceiptResponse$1 = {
    execution_status: TransactionExecutionStatus$1.REJECTED;
    finality_status: TransactionFinalityStatus$1;
    status: TransactionStatus.REJECTED;
    transaction_hash: string;
    l2_to_l1_messages: string[];
    events: string[];
    transaction_failure_reason: {
        code: string;
        error_message: string;
    };
};
type GetBlockResponse$1 = {
    block_number: number;
    state_root: string;
    block_hash: string;
    transactions: {
        [txHash: string]: TransactionResponse;
    };
    timestamp: number;
    transaction_receipts: {
        [txHash: string]: {
            block_hash: string;
            transaction_hash: string;
            l2_to_l1_messages: {
                to_address: string;
                payload: string[];
                from_address: string;
            }[];
            block_number: BlockNumber;
            status: TransactionStatus;
            transaction_index: number;
        };
    };
    parent_block_hash: string;
    status: BlockStatus;
    gas_price: string;
    sequencer_address: string;
    starknet_version: string;
};
type CallContractTransaction = {
    calldata?: RawCalldata;
    max_fee?: BigNumberish;
    version?: BigNumberish;
    entry_point_selector: string;
} & ({
    sender_address: string;
    signature: string[];
} | {
    contract_address: string;
    signature?: never;
});
type CallContractResponse$1 = {
    result: string[];
};
type InvokeEstimateFee = Omit<InvokeFunctionTransaction, 'max_fee' | 'entry_point_type'>;
type DeclareEstimateFee = Omit<DeclareTransaction, 'max_fee'>;
type DeployAccountEstimateFee = Omit<DeployAccountTransaction, 'max_fee'>;
type DeployEstimateFee = DeployTransaction;
type SimulateTransactionResponse$1 = {
    trace: TransactionTraceResponse;
    fee_estimation: EstimateFeeResponse$1;
};
type AccountTransactionItem = InvokeEstimateFee | DeclareEstimateFee | DeployEstimateFee | DeployAccountEstimateFee;
/**
 * Transaction filled with account data
 */
type AccountTransaction = AllowArray<AccountTransactionItem>;
type EstimateFeeResponse$1 = {
    overall_fee: number;
    gas_price: number;
    gas_usage: number;
    uint: string;
} | {
    amount: bigint;
    unit: string;
};
type EstimateFeeResponseBulk$1 = AllowArray<EstimateFeeResponse$1>;
type BlockTransactionTracesResponse = {
    traces: Array<TransactionTraceResponse & {
        transaction_hash: string;
    }>;
};
type Storage$1 = string;
type StateUpdateResponse$1 = {
    block_hash: string;
    new_root: string;
    old_root: string;
    state_diff: {
        storage_diffs: StorageDiffs;
        nonces: Nonces;
        deployed_contracts: Array<DeployedContractItem>;
        old_declared_contracts: OldDeclaredContracts;
        declared_classes: DeclaredClasses;
        replaced_classes: ReplacedClasses;
    };
};
type StorageDiffs = {
    [address: string]: Array<StateDiffItem>;
};
type StateDiffItem = {
    key: string;
    value: string;
};
type Nonces = {
    [address: string]: Nonce$1;
};
type Nonce$1 = string;
type DeployedContracts = DeployedContractItem[];
type OldDeclaredContracts = string[];
type DeclaredClasses = DeclaredClass[];
type DeclaredClass = {
    class_hash: string;
    compiled_class_hash: string;
};
type ReplacedClasses = string[];
type Endpoints = {
    get_contract_addresses: {
        QUERY: never;
        REQUEST: never;
        RESPONSE: GetContractAddressesResponse;
    };
    add_transaction: {
        QUERY: never;
        REQUEST: Transaction;
        RESPONSE: AddTransactionResponse;
    };
    get_transaction: {
        QUERY: {
            transactionHash: string;
        };
        REQUEST: never;
        RESPONSE: GetTransactionResponse$1;
    };
    get_transaction_status: {
        QUERY: {
            transactionHash: string;
        };
        REQUEST: never;
        RESPONSE: GetTransactionStatusResponse;
    };
    get_transaction_trace: {
        QUERY: {
            transactionHash: string;
        };
        REQUEST: never;
        RESPONSE: TransactionTraceResponse;
    };
    get_transaction_receipt: {
        QUERY: {
            transactionHash: string;
        };
        REQUEST: never;
        RESPONSE: TransactionReceiptResponse;
    };
    get_nonce: {
        QUERY: {
            contractAddress: string;
            blockIdentifier: BlockIdentifier;
        };
        REQUEST: never;
        RESPONSE: Nonce$1;
    };
    get_storage_at: {
        QUERY: {
            contractAddress: string;
            key: BigNumberish;
            blockIdentifier: BlockIdentifier;
        };
        REQUEST: never;
        RESPONSE: Storage$1;
    };
    get_code: {
        QUERY: {
            contractAddress: string;
            blockIdentifier: BlockIdentifier;
        };
        REQUEST: never;
        RESPONSE: GetCodeResponse$1;
    };
    get_block: {
        QUERY: {
            blockIdentifier: BlockIdentifier;
        };
        REQUEST: never;
        RESPONSE: GetBlockResponse$1;
    };
    call_contract: {
        QUERY: {
            blockIdentifier: BlockIdentifier;
        };
        REQUEST: CallContractTransaction;
        RESPONSE: CallContractResponse$1;
    };
    estimate_fee: {
        QUERY: {
            blockIdentifier: BlockIdentifier;
            skipValidate: boolean;
        };
        REQUEST: AccountTransactionItem;
        RESPONSE: EstimateFeeResponse$1;
    };
    get_class_by_hash: {
        QUERY: {
            classHash: string;
            blockIdentifier?: BlockIdentifier;
        };
        REQUEST: never;
        RESPONSE: CompiledContract;
    };
    get_class_hash_at: {
        QUERY: {
            contractAddress: string;
            blockIdentifier?: BlockIdentifier;
        };
        REQUEST: never;
        RESPONSE: string;
    };
    get_state_update: {
        QUERY: {
            blockHash?: string;
            blockNumber?: BlockNumber;
        };
        REQUEST: never;
        RESPONSE: StateUpdateResponse$1;
    };
    get_full_contract: {
        QUERY: {
            contractAddress: string;
            blockIdentifier?: BlockIdentifier;
        };
        REQUEST: never;
        RESPONSE: CompiledContract;
    };
    estimate_message_fee: {
        QUERY: any;
        REQUEST: any;
        RESPONSE: EstimateFeeResponse$1;
    };
    simulate_transaction: {
        QUERY: {
            blockIdentifier: BlockIdentifier;
            skipValidate: boolean;
        };
        REQUEST: AccountTransaction;
        RESPONSE: SimulateTransactionResponse$1;
    };
    estimate_fee_bulk: {
        QUERY: {
            blockIdentifier: BlockIdentifier;
            skipValidate: boolean;
        };
        REQUEST: AccountTransaction;
        RESPONSE: EstimateFeeResponseBulk$1;
    };
    get_block_traces: {
        QUERY: {
            blockHash?: string;
            blockNumber?: BlockNumber;
        };
        REQUEST: never;
        RESPONSE: BlockTransactionTracesResponse;
    };
    get_compiled_class_by_class_hash: {
        QUERY: {
            classHash: string;
            blockIdentifier?: BlockIdentifier;
        };
        REQUEST: any;
        RESPONSE: CairoAssembly;
    };
};

type sequencer_AccountTransaction = AccountTransaction;
type sequencer_AccountTransactionItem = AccountTransactionItem;
type sequencer_AddTransactionResponse = AddTransactionResponse;
type sequencer_BlockTransactionTracesResponse = BlockTransactionTracesResponse;
type sequencer_CallContractTransaction = CallContractTransaction;
type sequencer_CallL1Handler = CallL1Handler;
type sequencer_DeclareEstimateFee = DeclareEstimateFee;
type sequencer_DeclareTransaction = DeclareTransaction;
type sequencer_DeclaredClass = DeclaredClass;
type sequencer_DeclaredClasses = DeclaredClasses;
type sequencer_DeployAccountEstimateFee = DeployAccountEstimateFee;
type sequencer_DeployAccountTransaction = DeployAccountTransaction;
type sequencer_DeployEstimateFee = DeployEstimateFee;
type sequencer_DeployTransaction = DeployTransaction;
type sequencer_DeployedContractItem = DeployedContractItem;
type sequencer_DeployedContracts = DeployedContracts;
type sequencer_Endpoints = Endpoints;
type sequencer_ExecutionResources = ExecutionResources;
type sequencer_FailedTransactionResponse = FailedTransactionResponse;
type sequencer_FunctionInvocation = FunctionInvocation;
type sequencer_GetContractAddressesResponse = GetContractAddressesResponse;
type sequencer_GetTransactionStatusResponse = GetTransactionStatusResponse;
type sequencer_InvokeEstimateFee = InvokeEstimateFee;
type sequencer_InvokeFunctionTransaction = InvokeFunctionTransaction;
type sequencer_InvokeFunctionTransactionResponse = InvokeFunctionTransactionResponse;
type sequencer_Nonces = Nonces;
type sequencer_OldDeclaredContracts = OldDeclaredContracts;
type sequencer_ReplacedClasses = ReplacedClasses;
type sequencer_RevertedTransactionResponse = RevertedTransactionResponse;
type sequencer_SequencerIdentifier = SequencerIdentifier;
type sequencer_StateDiffItem = StateDiffItem;
type sequencer_StorageDiffs = StorageDiffs;
type sequencer_SuccessfulTransactionResponse = SuccessfulTransactionResponse;
type sequencer_Transaction = Transaction;
type sequencer_TransactionReceiptResponse = TransactionReceiptResponse;
type sequencer_TransactionResponse = TransactionResponse;
type sequencer_TransactionTraceResponse = TransactionTraceResponse;
declare namespace sequencer {
  export {
    sequencer_AccountTransaction as AccountTransaction,
    sequencer_AccountTransactionItem as AccountTransactionItem,
    sequencer_AddTransactionResponse as AddTransactionResponse,
    sequencer_BlockTransactionTracesResponse as BlockTransactionTracesResponse,
    CallContractResponse$1 as CallContractResponse,
    sequencer_CallContractTransaction as CallContractTransaction,
    sequencer_CallL1Handler as CallL1Handler,
    sequencer_DeclareEstimateFee as DeclareEstimateFee,
    sequencer_DeclareTransaction as DeclareTransaction,
    sequencer_DeclaredClass as DeclaredClass,
    sequencer_DeclaredClasses as DeclaredClasses,
    sequencer_DeployAccountEstimateFee as DeployAccountEstimateFee,
    sequencer_DeployAccountTransaction as DeployAccountTransaction,
    sequencer_DeployEstimateFee as DeployEstimateFee,
    sequencer_DeployTransaction as DeployTransaction,
    sequencer_DeployedContractItem as DeployedContractItem,
    sequencer_DeployedContracts as DeployedContracts,
    sequencer_Endpoints as Endpoints,
    EstimateFeeResponse$1 as EstimateFeeResponse,
    EstimateFeeResponseBulk$1 as EstimateFeeResponseBulk,
    sequencer_ExecutionResources as ExecutionResources,
    sequencer_FailedTransactionResponse as FailedTransactionResponse,
    sequencer_FunctionInvocation as FunctionInvocation,
    GetBlockResponse$1 as GetBlockResponse,
    GetCodeResponse$1 as GetCodeResponse,
    sequencer_GetContractAddressesResponse as GetContractAddressesResponse,
    GetTransactionResponse$1 as GetTransactionResponse,
    sequencer_GetTransactionStatusResponse as GetTransactionStatusResponse,
    sequencer_InvokeEstimateFee as InvokeEstimateFee,
    sequencer_InvokeFunctionTransaction as InvokeFunctionTransaction,
    sequencer_InvokeFunctionTransactionResponse as InvokeFunctionTransactionResponse,
    Nonce$1 as Nonce,
    sequencer_Nonces as Nonces,
    sequencer_OldDeclaredContracts as OldDeclaredContracts,
    RejectedTransactionReceiptResponse$1 as RejectedTransactionReceiptResponse,
    sequencer_ReplacedClasses as ReplacedClasses,
    RevertedTransactionReceiptResponse$1 as RevertedTransactionReceiptResponse,
    sequencer_RevertedTransactionResponse as RevertedTransactionResponse,
    sequencer_SequencerIdentifier as SequencerIdentifier,
    SimulateTransactionResponse$1 as SimulateTransactionResponse,
    sequencer_StateDiffItem as StateDiffItem,
    StateUpdateResponse$1 as StateUpdateResponse,
    Storage$1 as Storage,
    sequencer_StorageDiffs as StorageDiffs,
    SuccessfulTransactionReceiptResponse$1 as SuccessfulTransactionReceiptResponse,
    sequencer_SuccessfulTransactionResponse as SuccessfulTransactionResponse,
    sequencer_Transaction as Transaction,
    sequencer_TransactionReceiptResponse as TransactionReceiptResponse,
    sequencer_TransactionResponse as TransactionResponse,
    sequencer_TransactionTraceResponse as TransactionTraceResponse,
  };
}

/**
 * Common interface response
 * Intersection (sequencer response ∩ (∪ rpc responses))
 */

interface GetBlockResponse {
    timestamp: number;
    block_hash: string;
    block_number: number;
    new_root: string;
    parent_hash: string;
    status: BlockStatus;
    transactions: Array<string>;
    gas_price?: string;
    sequencer_address?: string;
    starknet_version?: string;
    transaction_receipts?: any;
}
interface GetCodeResponse {
    bytecode: ByteCode;
}
interface ContractEntryPoint {
    offset: string;
    selector: string;
}
type GetTransactionResponse = InvokeTransactionResponse | DeclareTransactionResponse | RejectedTransactionResponse;
interface CommonTransactionResponse {
    transaction_hash?: string;
    version?: string;
    signature?: Signature;
    max_fee?: string;
    nonce?: string;
}
interface InvokeTransactionResponse extends CommonTransactionResponse {
    contract_address?: string;
    sender_address?: string;
    entry_point_selector?: string;
    calldata: RawCalldata;
}
interface DeclareTransactionResponse extends CommonTransactionResponse {
    contract_class?: any;
    sender_address?: string;
}
interface MessageToL1 {
    to_address: string;
    payload: Array<string>;
}
interface Event {
    from_address: string;
    keys: Array<string>;
    data: Array<string>;
}
interface MessageToL2 {
    from_address: string;
    payload: Array<string>;
}
type RejectedTransactionResponse = {
    status: `${TransactionStatus.REJECTED}`;
    transaction_failure_reason: {
        code: string;
        error_message: string;
    };
};
type GetTransactionReceiptResponse = SuccessfulTransactionReceiptResponse | RevertedTransactionReceiptResponse | RejectedTransactionReceiptResponse;
type SuccessfulTransactionReceiptResponse = InvokeTransactionReceiptResponse | DeployTransactionReceiptResponse | DeclareTransactionReceiptResponse;
interface InvokeTransactionReceiptResponse {
    type?: TransactionType$1;
    execution_status: TransactionExecutionStatus$1;
    finality_status: TransactionFinalityStatus$1;
    status?: `${TransactionStatus}`;
    actual_fee: string;
    block_hash: BlockHash;
    block_number: BlockNumber;
    transaction_hash: string;
    transaction_index?: number;
    messages_sent: Array<MessageToL1>;
    events: any[];
    execution_resources?: any;
}
type DeclareTransactionReceiptResponse = {
    type?: TransactionType$1;
    execution_status: TransactionExecutionStatus$1;
    finality_status: TransactionFinalityStatus$1;
    status?: `${TransactionStatus}`;
    actual_fee: string;
    block_hash: BlockHash;
    block_number: BlockNumber;
    transaction_hash: string;
    transaction_index?: number;
    messages_sent: Array<MessageToL1>;
    events: any[];
};
type DeployTransactionReceiptResponse = InvokeTransactionReceiptResponse;
type RejectedTransactionReceiptResponse = {
    status: `${TransactionStatus.REJECTED}`;
    transaction_failure_reason: {
        code: string;
        error_message: string;
    };
};
type RevertedTransactionReceiptResponse = {
    type?: TransactionType$1 | any;
    execution_status: TransactionExecutionStatus$1.REVERTED | any;
    finality_status: TransactionFinalityStatus$1 | any;
    status?: TransactionStatus;
    actual_fee: string;
    block_hash?: string;
    block_number?: BlockNumber;
    transaction_hash: string;
    transaction_index?: number;
    messages_sent: Array<MessageToL1>;
    events: any[];
    revert_reason?: string;
};
interface EstimateFeeResponse {
    overall_fee: bigint;
    gas_consumed?: bigint;
    gas_price?: bigint;
    suggestedMaxFee?: bigint;
}
interface InvokeFunctionResponse {
    transaction_hash: string;
}
interface DeclareContractResponse {
    transaction_hash: string;
    class_hash: string;
}
type CallContractResponse = {
    result: Array<string>;
};
type EstimateFeeAction = {
    type: TransactionType$1.INVOKE;
    payload: AllowArray<Call>;
} | {
    type: TransactionType$1.DECLARE;
    payload: DeclareContractPayload;
} | {
    type: TransactionType$1.DEPLOY_ACCOUNT;
    payload: DeployAccountContractPayload;
} | {
    type: TransactionType$1.DEPLOY;
    payload: UniversalDeployerContractPayload;
};
type EstimateFeeResponseBulk = Array<EstimateFeeResponse>;
type Storage = Storage$1;
type Nonce = Nonce$1;
type SimulationFlags = SimulationFlags$1;
type SimulatedTransaction = {
    transaction_trace: Trace | TransactionTraceResponse;
    fee_estimation: EstimateFeeResponse$2 | EstimateFeeResponse$1;
    suggestedMaxFee?: string | bigint;
};
type SimulateTransactionResponse = SimulatedTransaction[];
interface StateUpdateResponse {
    block_hash?: string;
    new_root?: string;
    old_root: string;
    state_diff: {
        storage_diffs: StorageDiffs$1;
        deployed_contracts: DeployedContracts;
        nonces: Nonces$1;
        old_declared_contracts?: OldDeclaredContracts;
        declared_classes?: DeclaredClasses;
        replaced_classes?: ReplacedClasses | ReplacedClasses$1;
        deprecated_declared_classes?: DeprecatedDeclaredClasses;
    };
}
/**
 * Standardized type
 * Cairo0 program compressed and Cairo1 sierra_program decompressed
 * abi Abi
 * CompiledSierra without '.sierra_program_debug_info'
 */
type ContractClassResponse = LegacyContractClass | Omit<CompiledSierra, 'sierra_program_debug_info'>;

interface EstimateFee extends EstimateFeeResponse {
    suggestedMaxFee: bigint;
}
type EstimateFeeBulk = Array<EstimateFee>;
type AccountInvocationsFactoryDetails = {
    versions: bigint[];
    nonce?: BigNumberish;
    blockIdentifier?: BlockIdentifier;
};
interface EstimateFeeDetails {
    nonce?: BigNumberish;
    blockIdentifier?: BlockIdentifier;
    skipValidate?: boolean;
}
interface DeployContractResponse {
    contract_address: string;
    transaction_hash: string;
}
type MultiDeployContractResponse = {
    contract_address: Array<string>;
    transaction_hash: string;
};
type DeployContractUDCResponse = {
    contract_address: string;
    transaction_hash: string;
    address: string;
    deployer: string;
    unique: string;
    classHash: string;
    calldata_len: string;
    calldata: Array<string>;
    salt: string;
};
type DeclareDeployUDCResponse = {
    declare: {
        class_hash: BigNumberish;
    } & Partial<DeclareTransactionReceiptResponse>;
    deploy: DeployContractUDCResponse;
};
type SimulateTransactionDetails = {
    nonce?: BigNumberish;
    blockIdentifier?: BlockIdentifier;
    skipValidate?: boolean;
    skipExecute?: boolean;
};
declare enum SIMULATION_FLAG {
    SKIP_VALIDATE = "SKIP_VALIDATE",
    SKIP_EXECUTE = "SKIP_EXECUTE"
}

declare enum ValidateType {
    DEPLOY = "DEPLOY",
    CALL = "CALL",
    INVOKE = "INVOKE"
}
declare enum Uint {
    u8 = "core::integer::u8",
    u16 = "core::integer::u16",
    u32 = "core::integer::u32",
    u64 = "core::integer::u64",
    u128 = "core::integer::u128",
    u256 = "core::integer::u256"
}
declare enum Litteral {
    ClassHash = "core::starknet::class_hash::ClassHash",
    ContractAddress = "core::starknet::contract_address::ContractAddress"
}

type AsyncContractFunction<T = any> = (...args: ArgsOrCalldataWithOptions) => Promise<T>;
type ContractFunction = (...args: ArgsOrCalldataWithOptions) => any;
type Result = {
    [key: string]: any;
} | Result[] | bigint | string | boolean | CairoEnum;
type ArgsOrCalldata = RawArgsArray | [Calldata] | Calldata;
type ArgsOrCalldataWithOptions = ArgsOrCalldata & ContractOptions;
type ContractOptions = {
    blockIdentifier?: BlockIdentifier;
    parseRequest?: boolean;
    parseResponse?: boolean;
    formatResponse?: {
        [key: string]: any;
    };
    maxFee?: BigNumberish;
    nonce?: BigNumberish;
    signature?: Signature;
    addressSalt?: string;
};
type CallOptions = Pick<ContractOptions, 'blockIdentifier' | 'parseRequest' | 'parseResponse' | 'formatResponse'>;
type InvokeOptions = Pick<ContractOptions, 'maxFee' | 'nonce' | 'signature' | 'parseRequest'>;
type ParsedEvent = {
    [name: string]: ParsedStruct;
};
type ParsedEvents = Array<ParsedEvent>;

interface InvocationsSignerDetails extends Required<InvocationsDetails> {
    walletAddress: string;
    chainId: StarknetChainId;
    cairoVersion: CairoVersion;
}
interface DeclareSignerDetails {
    classHash: string;
    senderAddress: string;
    chainId: StarknetChainId;
    maxFee: BigNumberish;
    version: BigNumberish;
    nonce: BigNumberish;
    compiledClassHash?: string;
}
type DeployAccountSignerDetails = Required<DeployAccountContractPayload> & Required<InvocationsDetails> & {
    contractAddress: BigNumberish;
    chainId: StarknetChainId;
};

type StarkNetMerkleType = {
    name: string;
    type: 'merkletree';
    contains: string;
};
/**
 * A single type, as part of a struct. The `type` field can be any of the EIP-712 supported types.
 *
 * Note that the `uint` and `int` aliases like in Solidity, and fixed point numbers are not supported by the EIP-712
 * standard.
 */
type StarkNetType = {
    name: string;
    type: string;
} | StarkNetMerkleType;
/**
 * The EIP712 domain struct. Any of these fields are optional, but it must contain at least one field.
 */
interface StarkNetDomain extends Record<string, unknown> {
    name?: string;
    version?: string;
    chainId?: string | number;
}
/**
 * The complete typed data, with all the structs, domain data, primary type of the message, and the message itself.
 */
interface TypedData {
    types: Record<string, StarkNetType[]>;
    primaryType: string;
    domain: StarkNetDomain;
    message: Record<string, unknown>;
}

type index$1_Abi = Abi;
type index$1_AbiEntry = AbiEntry;
type index$1_AbiEnums = AbiEnums;
type index$1_AbiEvents = AbiEvents;
type index$1_AbiStructs = AbiStructs;
type index$1_AccountInvocationItem = AccountInvocationItem;
type index$1_AccountInvocations = AccountInvocations;
type index$1_AccountInvocationsFactoryDetails = AccountInvocationsFactoryDetails;
type index$1_AllowArray<T> = AllowArray<T>;
type index$1_Args = Args;
type index$1_ArgsOrCalldata = ArgsOrCalldata;
type index$1_ArgsOrCalldataWithOptions = ArgsOrCalldataWithOptions;
type index$1_ArraySignatureType = ArraySignatureType;
type index$1_AsyncContractFunction<T = any> = AsyncContractFunction<T>;
type index$1_BigNumberish = BigNumberish;
type index$1_BlockIdentifier = BlockIdentifier;
type index$1_BlockNumber = BlockNumber;
type index$1_BlockStatus = BlockStatus;
declare const index$1_BlockStatus: typeof BlockStatus;
type index$1_BlockTag = BlockTag;
declare const index$1_BlockTag: typeof BlockTag;
type index$1_Builtins = Builtins;
type index$1_ByteCode = ByteCode;
type index$1_Cairo1Event = Cairo1Event;
type index$1_CairoAssembly = CairoAssembly;
type index$1_CairoContract = CairoContract;
type index$1_CairoEnum = CairoEnum;
type index$1_CairoVersion = CairoVersion;
type index$1_Call = Call;
type index$1_CallContractResponse = CallContractResponse;
type index$1_CallDetails = CallDetails;
type index$1_CallL1Handler = CallL1Handler;
type index$1_CallOptions = CallOptions;
type index$1_CallStruct = CallStruct;
type index$1_Calldata = Calldata;
type index$1_CommonTransactionResponse = CommonTransactionResponse;
type index$1_CompiledContract = CompiledContract;
type index$1_CompiledSierra = CompiledSierra;
type index$1_CompiledSierraCasm = CompiledSierraCasm;
type index$1_CompleteDeclareContractPayload = CompleteDeclareContractPayload;
type index$1_CompressedProgram = CompressedProgram;
type index$1_ContractClassResponse = ContractClassResponse;
type index$1_ContractEntryPoint = ContractEntryPoint;
type index$1_ContractEntryPointFields = ContractEntryPointFields;
type index$1_ContractFunction = ContractFunction;
type index$1_ContractOptions = ContractOptions;
type index$1_DeclareAndDeployContractPayload = DeclareAndDeployContractPayload;
type index$1_DeclareContractPayload = DeclareContractPayload;
type index$1_DeclareContractResponse = DeclareContractResponse;
type index$1_DeclareContractTransaction = DeclareContractTransaction;
type index$1_DeclareDeployUDCResponse = DeclareDeployUDCResponse;
type index$1_DeclareSignerDetails = DeclareSignerDetails;
type index$1_DeclareTransactionReceiptResponse = DeclareTransactionReceiptResponse;
type index$1_DeclareTransactionResponse = DeclareTransactionResponse;
type index$1_DeployAccountContractPayload = DeployAccountContractPayload;
type index$1_DeployAccountContractTransaction = DeployAccountContractTransaction;
type index$1_DeployAccountSignerDetails = DeployAccountSignerDetails;
type index$1_DeployContractResponse = DeployContractResponse;
type index$1_DeployContractUDCResponse = DeployContractUDCResponse;
type index$1_DeployTransactionReceiptResponse = DeployTransactionReceiptResponse;
type index$1_DeployedContractItem = DeployedContractItem;
type index$1_Details = Details;
type index$1_EntryPointType = EntryPointType;
declare const index$1_EntryPointType: typeof EntryPointType;
type index$1_EntryPointsByType = EntryPointsByType;
type index$1_EnumAbi = EnumAbi;
type index$1_EstimateFee = EstimateFee;
type index$1_EstimateFeeAction = EstimateFeeAction;
type index$1_EstimateFeeBulk = EstimateFeeBulk;
type index$1_EstimateFeeDetails = EstimateFeeDetails;
type index$1_EstimateFeeResponse = EstimateFeeResponse;
type index$1_EstimateFeeResponseBulk = EstimateFeeResponseBulk;
type index$1_Event = Event;
type index$1_EventAbi = EventAbi;
type index$1_EventEntry = EventEntry;
type index$1_ExecutionResources = ExecutionResources;
type index$1_FunctionAbi = FunctionAbi;
type index$1_FunctionInvocation = FunctionInvocation;
type index$1_GetBlockResponse = GetBlockResponse;
type index$1_GetCodeResponse = GetCodeResponse;
type index$1_GetContractAddressesResponse = GetContractAddressesResponse;
type index$1_GetTransactionReceiptResponse = GetTransactionReceiptResponse;
type index$1_GetTransactionResponse = GetTransactionResponse;
type index$1_GetTransactionStatusResponse = GetTransactionStatusResponse;
type index$1_HexCalldata = HexCalldata;
type index$1_Invocation = Invocation;
type index$1_Invocations = Invocations;
type index$1_InvocationsDetails = InvocationsDetails;
type index$1_InvocationsDetailsWithNonce = InvocationsDetailsWithNonce;
type index$1_InvocationsSignerDetails = InvocationsSignerDetails;
type index$1_InvokeFunctionResponse = InvokeFunctionResponse;
type index$1_InvokeOptions = InvokeOptions;
type index$1_InvokeTransactionReceiptResponse = InvokeTransactionReceiptResponse;
type index$1_InvokeTransactionResponse = InvokeTransactionResponse;
type index$1_LegacyCompiledContract = LegacyCompiledContract;
type index$1_LegacyContractClass = LegacyContractClass;
type index$1_LegacyEvent = LegacyEvent;
type index$1_Litteral = Litteral;
declare const index$1_Litteral: typeof Litteral;
type index$1_MessageToL1 = MessageToL1;
type index$1_MessageToL2 = MessageToL2;
type index$1_MultiDeployContractResponse = MultiDeployContractResponse;
type index$1_MultiType = MultiType;
type index$1_Nonce = Nonce;
type index$1_OptionalPayload<T> = OptionalPayload<T>;
type index$1_ParsedEvent = ParsedEvent;
type index$1_ParsedEvents = ParsedEvents;
type index$1_ParsedStruct = ParsedStruct;
type index$1_Program = Program;
type index$1_ProviderOptions = ProviderOptions;
type index$1_PythonicHints = PythonicHints;
type index$1_RawArgs = RawArgs;
type index$1_RawArgsArray = RawArgsArray;
type index$1_RawArgsObject = RawArgsObject;
type index$1_RawCalldata = RawCalldata;
type index$1_RejectedTransactionReceiptResponse = RejectedTransactionReceiptResponse;
type index$1_RejectedTransactionResponse = RejectedTransactionResponse;
type index$1_Result = Result;
type index$1_RevertedTransactionReceiptResponse = RevertedTransactionReceiptResponse;
type index$1_RpcProviderOptions = RpcProviderOptions;
type index$1_SIMULATION_FLAG = SIMULATION_FLAG;
declare const index$1_SIMULATION_FLAG: typeof SIMULATION_FLAG;
type index$1_SequencerHttpMethod = SequencerHttpMethod;
type index$1_SequencerIdentifier = SequencerIdentifier;
type index$1_SequencerProviderOptions = SequencerProviderOptions;
type index$1_SierraContractClass = SierraContractClass;
type index$1_SierraContractEntryPointFields = SierraContractEntryPointFields;
type index$1_SierraEntryPointsByType = SierraEntryPointsByType;
type index$1_SierraProgramDebugInfo = SierraProgramDebugInfo;
type index$1_Signature = Signature;
type index$1_SimulateTransactionDetails = SimulateTransactionDetails;
type index$1_SimulateTransactionResponse = SimulateTransactionResponse;
type index$1_SimulatedTransaction = SimulatedTransaction;
type index$1_SimulationFlags = SimulationFlags;
type index$1_StarkNetDomain = StarkNetDomain;
type index$1_StarkNetMerkleType = StarkNetMerkleType;
type index$1_StarkNetType = StarkNetType;
type index$1_StateUpdateResponse = StateUpdateResponse;
type index$1_Storage = Storage;
type index$1_StructAbi = StructAbi;
type index$1_SuccessfulTransactionReceiptResponse = SuccessfulTransactionReceiptResponse;
type index$1_TransactionStatus = TransactionStatus;
declare const index$1_TransactionStatus: typeof TransactionStatus;
type index$1_Tupled = Tupled;
type index$1_TypedData = TypedData;
type index$1_Uint = Uint;
declare const index$1_Uint: typeof Uint;
type index$1_Uint256 = Uint256;
type index$1_UniversalDeployerContractPayload = UniversalDeployerContractPayload;
type index$1_ValidateType = ValidateType;
declare const index$1_ValidateType: typeof ValidateType;
type index$1_WeierstrassSignatureType = WeierstrassSignatureType;
type index$1_getEstimateFeeBulkOptions = getEstimateFeeBulkOptions;
type index$1_getSimulateTransactionOptions = getSimulateTransactionOptions;
type index$1_waitForTransactionOptions = waitForTransactionOptions;
declare namespace index$1 {
  export {
    index$1_Abi as Abi,
    index$1_AbiEntry as AbiEntry,
    index$1_AbiEnums as AbiEnums,
    index$1_AbiEvents as AbiEvents,
    index$1_AbiStructs as AbiStructs,
    index$1_AccountInvocationItem as AccountInvocationItem,
    index$1_AccountInvocations as AccountInvocations,
    index$1_AccountInvocationsFactoryDetails as AccountInvocationsFactoryDetails,
    index$1_AllowArray as AllowArray,
    index$1_Args as Args,
    index$1_ArgsOrCalldata as ArgsOrCalldata,
    index$1_ArgsOrCalldataWithOptions as ArgsOrCalldataWithOptions,
    index$1_ArraySignatureType as ArraySignatureType,
    index$1_AsyncContractFunction as AsyncContractFunction,
    index$1_BigNumberish as BigNumberish,
    index$1_BlockIdentifier as BlockIdentifier,
    index$1_BlockNumber as BlockNumber,
    index$1_BlockStatus as BlockStatus,
    index$1_BlockTag as BlockTag,
    index$1_Builtins as Builtins,
    index$1_ByteCode as ByteCode,
    index$1_Cairo1Event as Cairo1Event,
    index$1_CairoAssembly as CairoAssembly,
    index$1_CairoContract as CairoContract,
    index$1_CairoEnum as CairoEnum,
    index$1_CairoVersion as CairoVersion,
    index$1_Call as Call,
    index$1_CallContractResponse as CallContractResponse,
    index$1_CallDetails as CallDetails,
    index$1_CallL1Handler as CallL1Handler,
    index$1_CallOptions as CallOptions,
    index$1_CallStruct as CallStruct,
    index$1_Calldata as Calldata,
    index$1_CommonTransactionResponse as CommonTransactionResponse,
    index$1_CompiledContract as CompiledContract,
    index$1_CompiledSierra as CompiledSierra,
    index$1_CompiledSierraCasm as CompiledSierraCasm,
    index$1_CompleteDeclareContractPayload as CompleteDeclareContractPayload,
    index$1_CompressedProgram as CompressedProgram,
    ContractClass$1 as ContractClass,
    index$1_ContractClassResponse as ContractClassResponse,
    index$1_ContractEntryPoint as ContractEntryPoint,
    index$1_ContractEntryPointFields as ContractEntryPointFields,
    index$1_ContractFunction as ContractFunction,
    index$1_ContractOptions as ContractOptions,
    index$1_DeclareAndDeployContractPayload as DeclareAndDeployContractPayload,
    index$1_DeclareContractPayload as DeclareContractPayload,
    index$1_DeclareContractResponse as DeclareContractResponse,
    index$1_DeclareContractTransaction as DeclareContractTransaction,
    index$1_DeclareDeployUDCResponse as DeclareDeployUDCResponse,
    index$1_DeclareSignerDetails as DeclareSignerDetails,
    index$1_DeclareTransactionReceiptResponse as DeclareTransactionReceiptResponse,
    index$1_DeclareTransactionResponse as DeclareTransactionResponse,
    index$1_DeployAccountContractPayload as DeployAccountContractPayload,
    index$1_DeployAccountContractTransaction as DeployAccountContractTransaction,
    index$1_DeployAccountSignerDetails as DeployAccountSignerDetails,
    index$1_DeployContractResponse as DeployContractResponse,
    index$1_DeployContractUDCResponse as DeployContractUDCResponse,
    index$1_DeployTransactionReceiptResponse as DeployTransactionReceiptResponse,
    index$1_DeployedContractItem as DeployedContractItem,
    index$1_Details as Details,
    index$1_EntryPointType as EntryPointType,
    index$1_EntryPointsByType as EntryPointsByType,
    index$1_EnumAbi as EnumAbi,
    index$1_EstimateFee as EstimateFee,
    index$1_EstimateFeeAction as EstimateFeeAction,
    index$1_EstimateFeeBulk as EstimateFeeBulk,
    index$1_EstimateFeeDetails as EstimateFeeDetails,
    index$1_EstimateFeeResponse as EstimateFeeResponse,
    index$1_EstimateFeeResponseBulk as EstimateFeeResponseBulk,
    index$1_Event as Event,
    index$1_EventAbi as EventAbi,
    index$1_EventEntry as EventEntry,
    index$1_ExecutionResources as ExecutionResources,
    index$1_FunctionAbi as FunctionAbi,
    index$1_FunctionInvocation as FunctionInvocation,
    index$1_GetBlockResponse as GetBlockResponse,
    index$1_GetCodeResponse as GetCodeResponse,
    index$1_GetContractAddressesResponse as GetContractAddressesResponse,
    index$1_GetTransactionReceiptResponse as GetTransactionReceiptResponse,
    index$1_GetTransactionResponse as GetTransactionResponse,
    index$1_GetTransactionStatusResponse as GetTransactionStatusResponse,
    index$1_HexCalldata as HexCalldata,
    index$1_Invocation as Invocation,
    index$1_Invocations as Invocations,
    index$1_InvocationsDetails as InvocationsDetails,
    index$1_InvocationsDetailsWithNonce as InvocationsDetailsWithNonce,
    index$1_InvocationsSignerDetails as InvocationsSignerDetails,
    index$1_InvokeFunctionResponse as InvokeFunctionResponse,
    index$1_InvokeOptions as InvokeOptions,
    index$1_InvokeTransactionReceiptResponse as InvokeTransactionReceiptResponse,
    index$1_InvokeTransactionResponse as InvokeTransactionResponse,
    index$1_LegacyCompiledContract as LegacyCompiledContract,
    index$1_LegacyContractClass as LegacyContractClass,
    index$1_LegacyEvent as LegacyEvent,
    index$1_Litteral as Litteral,
    index$1_MessageToL1 as MessageToL1,
    index$1_MessageToL2 as MessageToL2,
    index$1_MultiDeployContractResponse as MultiDeployContractResponse,
    index$1_MultiType as MultiType,
    index$1_Nonce as Nonce,
    index$1_OptionalPayload as OptionalPayload,
    index$1_ParsedEvent as ParsedEvent,
    index$1_ParsedEvents as ParsedEvents,
    index$1_ParsedStruct as ParsedStruct,
    index$1_Program as Program,
    index$1_ProviderOptions as ProviderOptions,
    index$1_PythonicHints as PythonicHints,
    rpc as RPC,
    index$1_RawArgs as RawArgs,
    index$1_RawArgsArray as RawArgsArray,
    index$1_RawArgsObject as RawArgsObject,
    index$1_RawCalldata as RawCalldata,
    index$1_RejectedTransactionReceiptResponse as RejectedTransactionReceiptResponse,
    index$1_RejectedTransactionResponse as RejectedTransactionResponse,
    index$1_Result as Result,
    index$1_RevertedTransactionReceiptResponse as RevertedTransactionReceiptResponse,
    index$1_RpcProviderOptions as RpcProviderOptions,
    index$1_SIMULATION_FLAG as SIMULATION_FLAG,
    sequencer as Sequencer,
    index$1_SequencerHttpMethod as SequencerHttpMethod,
    index$1_SequencerIdentifier as SequencerIdentifier,
    index$1_SequencerProviderOptions as SequencerProviderOptions,
    index$1_SierraContractClass as SierraContractClass,
    index$1_SierraContractEntryPointFields as SierraContractEntryPointFields,
    index$1_SierraEntryPointsByType as SierraEntryPointsByType,
    index$1_SierraProgramDebugInfo as SierraProgramDebugInfo,
    index$1_Signature as Signature,
    index$1_SimulateTransactionDetails as SimulateTransactionDetails,
    index$1_SimulateTransactionResponse as SimulateTransactionResponse,
    index$1_SimulatedTransaction as SimulatedTransaction,
    index$1_SimulationFlags as SimulationFlags,
    index$1_StarkNetDomain as StarkNetDomain,
    index$1_StarkNetMerkleType as StarkNetMerkleType,
    index$1_StarkNetType as StarkNetType,
    index$1_StateUpdateResponse as StateUpdateResponse,
    index$1_Storage as Storage,
    index$1_StructAbi as StructAbi,
    index$1_SuccessfulTransactionReceiptResponse as SuccessfulTransactionReceiptResponse,
    TransactionExecutionStatus$1 as TransactionExecutionStatus,
    TransactionFinalityStatus$1 as TransactionFinalityStatus,
    index$1_TransactionStatus as TransactionStatus,
    TransactionType$1 as TransactionType,
    index$1_Tupled as Tupled,
    index$1_TypedData as TypedData,
    index$1_Uint as Uint,
    index$1_Uint256 as Uint256,
    index$1_UniversalDeployerContractPayload as UniversalDeployerContractPayload,
    index$1_ValidateType as ValidateType,
    index$1_WeierstrassSignatureType as WeierstrassSignatureType,
    index$1_getEstimateFeeBulkOptions as getEstimateFeeBulkOptions,
    index$1_getSimulateTransactionOptions as getSimulateTransactionOptions,
    index$1_waitForTransactionOptions as waitForTransactionOptions,
  };
}

declare abstract class ProviderInterface {
    /**
     * Gets the Starknet chain Id
     *
     * @returns the chain Id
     */
    abstract getChainId(): Promise<StarknetChainId>;
    /**
     * Calls a function on the Starknet contract.
     *
     * @param call transaction to be called
     * @param blockIdentifier block identifier
     * @returns the result of the function on the smart contract.
     */
    abstract callContract(call: Call, blockIdentifier?: BlockIdentifier): Promise<CallContractResponse>;
    /**
     * Gets the block information
     *
     * @param blockIdentifier block identifier
     * @returns the block object
     */
    abstract getBlock(blockIdentifier: BlockIdentifier): Promise<GetBlockResponse>;
    /**
     * @deprecated The method should not be used
     */
    abstract getCode(contractAddress: string, blockIdentifier?: BlockIdentifier): Promise<GetCodeResponse>;
    /**
     * Gets the contract class of the deployed contract.
     *
     * @param contractAddress - contract address
     * @param blockIdentifier - block identifier
     * @returns Contract class of compiled contract
     */
    abstract getClassAt(contractAddress: string, blockIdentifier?: BlockIdentifier): Promise<ContractClassResponse>;
    /**
     * Returns the class hash deployed under the given address.
     *
     * @param contractAddress - contract address
     * @param blockIdentifier - block identifier
     * @returns Class hash
     */
    abstract getClassHashAt(contractAddress: string, blockIdentifier?: BlockIdentifier): Promise<string>;
    /**
     * Returns the contract class deployed under the given class hash.
     *
     * @param classHash - class hash
     * @returns Contract class of compiled contract
     */
    abstract getClassByHash(classHash: string): Promise<ContractClassResponse>;
    /**
     * Gets the nonce of a contract with respect to a specific block
     *
     * @param contractAddress - contract address
     * @returns the hex nonce
     */
    abstract getNonceForAddress(contractAddress: string, blockIdentifier?: BlockIdentifier): Promise<Nonce>;
    /**
     * Gets the contract's storage variable at a specific key.
     *
     * @param contractAddress
     * @param key - from getStorageVarAddress('<STORAGE_VARIABLE_NAME>') (WIP)
     * @param blockIdentifier - block identifier
     * @returns the value of the storage variable
     */
    abstract getStorageAt(contractAddress: string, key: BigNumberish, blockIdentifier?: BlockIdentifier): Promise<Storage>;
    /**
     * Gets the transaction information from a tx id.
     *
     * @param txHash
     * @returns the transaction object \{ transaction_id, status, transaction, block_number?, block_number?, transaction_index?, transaction_failure_reason? \}
     */
    abstract getTransaction(transactionHash: BigNumberish): Promise<GetTransactionResponse>;
    /**
     * Gets the transaction receipt from a tx hash.
     *
     * @param txHash
     * @returns the transaction receipt object
     */
    abstract getTransactionReceipt(transactionHash: BigNumberish): Promise<GetTransactionReceiptResponse>;
    /**
     * Deploys a given compiled Account contract (json) to starknet
     *
     * @param payload payload to be deployed containing:
     * - compiled contract code
     * - constructor calldata
     * - address salt
     * @returns a confirmation of sending a transaction on the starknet contract
     */
    abstract deployAccountContract(payload: DeployAccountContractPayload, details: InvocationsDetailsWithNonce): Promise<DeployContractResponse>;
    /**
     * Invokes a function on starknet
     * @deprecated This method wont be supported as soon as fees are mandatory. Should not be used outside of Account class
     *
     * @param invocation the invocation object containing:
     * - contractAddress - the address of the contract
     * - entrypoint - the entrypoint of the contract
     * - calldata - (defaults to []) the calldata
     * - signature - (defaults to []) the signature
     * @param details - optional details containing:
     * - nonce - optional nonce
     * - version - optional version
     * - maxFee - optional maxFee
     * @returns response from addTransaction
     */
    abstract invokeFunction(invocation: Invocation, details: InvocationsDetailsWithNonce): Promise<InvokeFunctionResponse>;
    /**
     * Declares a given compiled contract (json) to starknet
     * @param transaction transaction payload to be deployed containing:
     * - compiled contract code
     * - sender address
     * - signature
     * @param details Invocation Details containing:
     * - nonce
     * - optional version
     * - optional maxFee
     * @returns a confirmation of sending a transaction on the starknet contract
     */
    abstract declareContract(transaction: DeclareContractTransaction, details: InvocationsDetailsWithNonce): Promise<DeclareContractResponse>;
    /**
     * Estimates the fee for a given INVOKE transaction
     * @deprecated Please use getInvokeEstimateFee or getDeclareEstimateFee instead. Should not be used outside of Account class
     *
     * @param invocation the invocation object containing:
     * - contractAddress - the address of the contract
     * - entrypoint - the entrypoint of the contract
     * - calldata - (defaults to []) the calldata
     * - signature - (defaults to []) the signature
     * @param details - optional details containing:
     * - nonce - optional nonce
     * - version - optional version
     * @param blockIdentifier - (optional) block identifier
     * @param skipValidate - (optional) skip cairo __validate__ method
     * @returns the estimated fee
     */
    abstract getEstimateFee(invocation: Invocation, details: InvocationsDetailsWithNonce, blockIdentifier: BlockIdentifier, skipValidate?: boolean): Promise<EstimateFeeResponse>;
    /**
     * Estimates the fee for a given INVOKE transaction
     *
     * @param invocation the invocation object containing:
     * - contractAddress - the address of the contract
     * - entrypoint - the entrypoint of the contract
     * - calldata - (defaults to []) the calldata
     * - signature - (defaults to []) the signature
     * @param details - optional details containing:
     * - nonce - optional nonce
     * - version - optional version
     * @param blockIdentifier - (optional) block identifier
     * @param skipValidate - (optional) skip cairo __validate__ method
     * @returns the estimated fee
     */
    abstract getInvokeEstimateFee(invocation: Invocation, details: InvocationsDetailsWithNonce, blockIdentifier?: BlockIdentifier, skipValidate?: boolean): Promise<EstimateFeeResponse>;
    /**
     * Estimates the fee for a given DECLARE transaction
     *
     * @param transaction transaction payload to be declared containing:
     * - compiled contract code
     * - sender address
     * - signature - (defaults to []) the signature
     * @param details - optional details containing:
     * - nonce
     * - version - optional version
     * - optional maxFee
     * @param blockIdentifier - (optional) block identifier
     * @param skipValidate - (optional) skip cairo __validate__ method
     * @returns the estimated fee
     */
    abstract getDeclareEstimateFee(transaction: DeclareContractTransaction, details: InvocationsDetailsWithNonce, blockIdentifier?: BlockIdentifier, skipValidate?: boolean): Promise<EstimateFeeResponse>;
    /**
     * Estimates the fee for a given DEPLOY_ACCOUNT transaction
     *
     * @param transaction transaction payload to be deployed containing:
     * - classHash
     * - constructorCalldata
     * - addressSalt
     * - signature - (defaults to []) the signature
     * @param details - optional details containing:
     * - nonce
     * - version - optional version
     * - optional maxFee
     * @param blockIdentifier - (optional) block identifier
     * @param skipValidate - (optional) skip cairo __validate__ method
     * @returns the estimated fee
     */
    abstract getDeployAccountEstimateFee(transaction: DeployAccountContractTransaction, details: InvocationsDetailsWithNonce, blockIdentifier?: BlockIdentifier, skipValidate?: boolean): Promise<EstimateFeeResponse>;
    /**
     * Estimates the fee for a list of INVOKE transaction
     *
     * @param invocations AccountInvocations - Complete invocations array with account details
     * @param options getEstimateFeeBulkOptions
     * - (optional) blockIdentifier - BlockIdentifier
     * - (optional) skipValidate - boolean (default false)
     * @returns the estimated fee
     */
    abstract getEstimateFeeBulk(invocations: AccountInvocations, options?: getEstimateFeeBulkOptions): Promise<EstimateFeeResponseBulk>;
    /**
     * Wait for the transaction to be accepted
     * @param txHash - transaction hash
     * @param options waitForTransactionOptions
     * - (optional) retryInterval: number | undefined;
     * - (optional) successStates: TransactionStatus[] | undefined;
     * @return GetTransactionReceiptResponse
     */
    abstract waitForTransaction(txHash: BigNumberish, options?: waitForTransactionOptions): Promise<GetTransactionReceiptResponse>;
    /**
     * Simulates the transaction and returns the transaction trace and estimated fee.
     *
     * @param invocations AccountInvocations - Complete invocations array with account details
     * @param options - getSimulateTransactionOptions
     *  - (optional) blockIdentifier - block identifier
     *  - (optional) skipValidate - skip cairo __validate__ method
     *  - (optional) skipExecute - skip cairo __execute__ method
     * @returns an array of transaction trace and estimated fee
     */
    abstract getSimulateTransaction(invocations: AccountInvocations, options?: getSimulateTransactionOptions): Promise<SimulateTransactionResponse>;
    /**
     * Gets the state changes in a specific block
     *
     * @param blockIdentifier - block identifier
     * @returns StateUpdateResponse
     */
    abstract getStateUpdate(blockIdentifier?: BlockIdentifier): Promise<StateUpdateResponse>;
}

declare class Provider implements ProviderInterface {
    private provider;
    constructor(providerOrOptions?: ProviderOptions | ProviderInterface);
    getChainId(): Promise<StarknetChainId>;
    getBlock(blockIdentifier: BlockIdentifier): Promise<GetBlockResponse>;
    getClassAt(contractAddress: string, blockIdentifier?: BlockIdentifier): Promise<ContractClassResponse>;
    getClassHashAt(contractAddress: string, blockIdentifier?: BlockIdentifier): Promise<string>;
    getClassByHash(classHash: string): Promise<ContractClassResponse>;
    getEstimateFee(invocationWithTxType: Invocation, invocationDetails: InvocationsDetailsWithNonce, blockIdentifier: BlockIdentifier): Promise<EstimateFeeResponse>;
    getInvokeEstimateFee(invocationWithTxType: Invocation, invocationDetails: InvocationsDetailsWithNonce, blockIdentifier?: BlockIdentifier, skipValidate?: boolean): Promise<EstimateFeeResponse>;
    getEstimateFeeBulk(invocations: AccountInvocations, options: getEstimateFeeBulkOptions): Promise<EstimateFeeResponseBulk>;
    getNonceForAddress(contractAddress: string, blockIdentifier?: BlockIdentifier): Promise<Nonce>;
    getStorageAt(contractAddress: string, key: BigNumberish, blockIdentifier?: BlockIdentifier): Promise<Storage>;
    getTransaction(txHash: BigNumberish): Promise<GetTransactionResponse>;
    getTransactionReceipt(txHash: BigNumberish): Promise<GetTransactionReceiptResponse>;
    callContract(request: Call, blockIdentifier?: BlockIdentifier): Promise<CallContractResponse>;
    invokeFunction(functionInvocation: Invocation, details: InvocationsDetailsWithNonce): Promise<InvokeFunctionResponse>;
    deployAccountContract(payload: DeployAccountContractTransaction, details: InvocationsDetailsWithNonce): Promise<DeployContractResponse>;
    declareContract(transaction: DeclareContractTransaction, details: InvocationsDetailsWithNonce): Promise<DeclareContractResponse>;
    getDeclareEstimateFee(transaction: DeclareContractTransaction, details: InvocationsDetailsWithNonce, blockIdentifier?: BlockIdentifier, skipValidate?: boolean): Promise<EstimateFeeResponse>;
    getDeployAccountEstimateFee(transaction: DeployAccountContractTransaction, details: InvocationsDetailsWithNonce, blockIdentifier?: BlockIdentifier, skipValidate?: boolean): Promise<EstimateFeeResponse>;
    getCode(contractAddress: string, blockIdentifier?: BlockIdentifier): Promise<GetCodeResponse>;
    waitForTransaction(txHash: BigNumberish, options?: waitForTransactionOptions): Promise<GetTransactionReceiptResponse>;
    getSimulateTransaction(invocations: AccountInvocations, options?: getSimulateTransactionOptions): Promise<SimulateTransactionResponse>;
    getStateUpdate(blockIdentifier?: BlockIdentifier): Promise<StateUpdateResponse>;
    getStarkName(address: BigNumberish, StarknetIdContract?: string): Promise<string>;
    getAddressFromStarkName(name: string, StarknetIdContract?: string): Promise<string>;
}

declare function fixStack(target: Error, fn?: Function): void;
declare function fixProto(target: Error, prototype: {}): void;
declare class CustomError extends Error {
    name: string;
    constructor(message?: string);
}
declare class LibraryError extends CustomError {
}
declare class GatewayError extends LibraryError {
    errorCode: string;
    constructor(message: string, errorCode: string);
}
declare class HttpError extends LibraryError {
    errorCode: number;
    constructor(message: string, errorCode: number);
}

declare class SequencerProvider implements ProviderInterface {
    baseUrl: string;
    feederGatewayUrl: string;
    gatewayUrl: string;
    headers?: Record<string, string>;
    private blockIdentifier;
    private chainId;
    private responseParser;
    constructor(optionsOrProvider?: SequencerProviderOptions);
    protected static getNetworkFromName(name: NetworkName | StarknetChainId): BaseUrl;
    protected static getChainIdFromBaseUrl(baseUrl: string): StarknetChainId;
    private getFetchUrl;
    private getFetchMethod;
    private getQueryString;
    private getHeaders;
    protected fetchEndpoint<T extends keyof Endpoints>(endpoint: T, ...[query, request]: Endpoints[T]['QUERY'] extends never ? Endpoints[T]['REQUEST'] extends never ? [] : [undefined, Endpoints[T]['REQUEST']] : Endpoints[T]['REQUEST'] extends never ? [Endpoints[T]['QUERY']] : [Endpoints[T]['QUERY'], Endpoints[T]['REQUEST']]): Promise<Endpoints[T]['RESPONSE']>;
    fetch(endpoint: string, options?: {
        method?: SequencerHttpMethod;
        body?: any;
        parseAlwaysAsBigInt?: boolean;
    }): Promise<any>;
    getChainId(): Promise<StarknetChainId>;
    callContract({ contractAddress, entrypoint: entryPointSelector, calldata }: Call, blockIdentifier?: BlockIdentifier): Promise<CallContractResponse>;
    getBlock(blockIdentifier?: BlockIdentifier): Promise<GetBlockResponse>;
    getNonceForAddress(contractAddress: string, blockIdentifier?: BlockIdentifier): Promise<Nonce$1>;
    getStorageAt(contractAddress: string, key: BigNumberish, blockIdentifier?: BlockIdentifier): Promise<Storage$1>;
    getTransaction(txHash: BigNumberish): Promise<GetTransactionResponse>;
    getTransactionReceipt(txHash: BigNumberish): Promise<GetTransactionReceiptResponse>;
    getClassAt(contractAddress: string, blockIdentifier?: BlockIdentifier): Promise<ContractClassResponse>;
    getClassHashAt(contractAddress: string, blockIdentifier?: BlockIdentifier): Promise<string>;
    getClassByHash(classHash: string, blockIdentifier?: BlockIdentifier): Promise<ContractClassResponse>;
    getCompiledClassByClassHash(classHash: string, blockIdentifier?: BlockIdentifier): Promise<CairoAssembly>;
    invokeFunction(functionInvocation: Invocation, details: InvocationsDetailsWithNonce): Promise<InvokeFunctionResponse>;
    deployAccountContract({ classHash, constructorCalldata, addressSalt, signature }: DeployAccountContractTransaction, details: InvocationsDetailsWithNonce): Promise<DeployContractResponse>;
    declareContract({ senderAddress, contract, signature, compiledClassHash }: DeclareContractTransaction, details: InvocationsDetailsWithNonce): Promise<DeclareContractResponse>;
    getEstimateFee(invocation: Invocation, invocationDetails: InvocationsDetailsWithNonce, blockIdentifier?: BlockIdentifier, skipValidate?: boolean): Promise<EstimateFeeResponse>;
    getInvokeEstimateFee(invocation: Invocation, invocationDetails: InvocationsDetailsWithNonce, blockIdentifier?: BlockIdentifier, skipValidate?: boolean): Promise<EstimateFeeResponse>;
    getDeclareEstimateFee(invocation: DeclareContractTransaction, details: InvocationsDetailsWithNonce, blockIdentifier?: BlockIdentifier, skipValidate?: boolean): Promise<EstimateFeeResponse>;
    getDeployAccountEstimateFee(invocation: DeployAccountContractTransaction, details: InvocationsDetailsWithNonce, blockIdentifier?: BlockIdentifier, skipValidate?: boolean): Promise<EstimateFeeResponse>;
    getEstimateFeeBulk(invocations: AccountInvocations, { blockIdentifier, skipValidate }: getEstimateFeeBulkOptions): Promise<EstimateFeeResponseBulk>;
    getCode(contractAddress: string, blockIdentifier?: BlockIdentifier): Promise<GetCodeResponse$1>;
    waitForTransaction(txHash: BigNumberish, options?: waitForTransactionOptions): Promise<GetTransactionReceiptResponse>;
    /**
     * Gets the status of a transaction.
     * @param txHash BigNumberish
     * @returns GetTransactionStatusResponse - the transaction status object
     */
    getTransactionStatus(txHash: BigNumberish): Promise<GetTransactionStatusResponse>;
    /**
     * Gets the smart contract address on the goerli testnet.
     * @returns GetContractAddressesResponse - starknet smart contract addresses
     */
    getContractAddresses(): Promise<GetContractAddressesResponse>;
    /**
     * Gets the transaction trace from a tx id.
     * @param txHash BigNumberish
     * @returns TransactionTraceResponse - the transaction trace
     */
    getTransactionTrace(txHash: BigNumberish): Promise<TransactionTraceResponse>;
    estimateMessageFee({ from_address, to_address, entry_point_selector, payload }: CallL1Handler, blockIdentifier?: BlockIdentifier): Promise<EstimateFeeResponse$1>;
    /**
     * Simulate transaction using Sequencer provider
     * WARNING!: Sequencer will process only first element from invocations array
     *
     * @param invocations Array of invocations, but only first invocation will be processed
     * @param blockIdentifier block identifier, default 'latest'
     * @param skipValidate Skip Account __validate__ method
     * @returns
     */
    getSimulateTransaction(invocations: AccountInvocations, { blockIdentifier, skipValidate, skipExecute, }: getSimulateTransactionOptions): Promise<SimulateTransactionResponse>;
    getStateUpdate(blockIdentifier?: BlockIdentifier): Promise<StateUpdateResponse>;
    getBlockTraces(blockIdentifier?: BlockIdentifier): Promise<BlockTransactionTracesResponse>;
    getStarkName(address: BigNumberish, StarknetIdContract?: string): Promise<string>;
    getAddressFromStarkName(name: string, StarknetIdContract?: string): Promise<string>;
    /**
     * Build Single AccountTransaction from Single AccountInvocation
     * @param invocation AccountInvocationItem
     * @param versionType 'fee' | 'transaction' - used to determine default versions
     * @returns AccountTransactionItem
     */
    buildTransaction(invocation: AccountInvocationItem, versionType?: 'fee' | 'transaction'): AccountTransactionItem;
}

declare class RpcProvider implements ProviderInterface {
    nodeUrl: string;
    headers: object;
    private responseParser;
    private retries;
    private blockIdentifier;
    private chainId?;
    constructor(optionsOrProvider: RpcProviderOptions);
    fetch(method: any, params: any): Promise<any>;
    protected errorHandler(error: any): void;
    protected fetchEndpoint<T extends keyof Methods>(method: T, params?: Methods[T]['params']): Promise<Methods[T]['result']>;
    getChainId(): Promise<StarknetChainId>;
    getBlock(blockIdentifier?: BlockIdentifier): Promise<GetBlockResponse>;
    getBlockHashAndNumber(): Promise<BlockHashAndNumber>;
    getBlockWithTxHashes(blockIdentifier?: BlockIdentifier): Promise<GetBlockWithTxHashesResponse>;
    getBlockWithTxs(blockIdentifier?: BlockIdentifier): Promise<GetBlockWithTxs>;
    getClassHashAt(contractAddress: ContractAddress, blockIdentifier?: BlockIdentifier): Promise<Felt>;
    getNonceForAddress(contractAddress: string, blockIdentifier?: BlockIdentifier): Promise<Nonce$2>;
    getPendingTransactions(): Promise<PendingTransactions>;
    getProtocolVersion(): Promise<Error>;
    getStateUpdate(blockIdentifier?: BlockIdentifier): Promise<StateUpdate>;
    getStorageAt(contractAddress: string, key: BigNumberish, blockIdentifier?: BlockIdentifier): Promise<Storage$2>;
    getTransaction(txHash: string): Promise<GetTransactionResponse>;
    getTransactionByHash(txHash: string): Promise<GetTransactionByHashResponse>;
    getTransactionByBlockIdAndIndex(blockIdentifier: BlockIdentifier, index: number): Promise<GetTransactionByBlockIdAndIndex>;
    getTransactionReceipt(txHash: string): Promise<TransactionReceipt>;
    getClassByHash(classHash: Felt): Promise<ContractClassResponse>;
    getClass(classHash: Felt, blockIdentifier?: BlockIdentifier): Promise<ContractClassResponse>;
    getClassAt(contractAddress: string, blockIdentifier?: BlockIdentifier): Promise<ContractClassResponse>;
    getCode(_contractAddress: string, _blockIdentifier?: BlockIdentifier): Promise<GetCodeResponse>;
    getEstimateFee(invocation: Invocation, invocationDetails: InvocationsDetailsWithNonce, blockIdentifier?: BlockIdentifier): Promise<EstimateFeeResponse>;
    getInvokeEstimateFee(invocation: Invocation, invocationDetails: InvocationsDetailsWithNonce, blockIdentifier?: BlockIdentifier): Promise<EstimateFeeResponse>;
    getDeclareEstimateFee(invocation: DeclareContractTransaction, details: InvocationsDetailsWithNonce, blockIdentifier?: BlockIdentifier): Promise<EstimateFeeResponse>;
    getDeployAccountEstimateFee(invocation: DeployAccountContractTransaction, details: InvocationsDetailsWithNonce, blockIdentifier?: BlockIdentifier): Promise<EstimateFeeResponse>;
    getEstimateFeeBulk(invocations: AccountInvocations, { blockIdentifier, skipValidate }: getEstimateFeeBulkOptions): Promise<EstimateFeeResponseBulk>;
    declareContract({ contract, signature, senderAddress, compiledClassHash }: DeclareContractTransaction, details: InvocationsDetailsWithNonce): Promise<DeclareContractResponse>;
    deployAccountContract({ classHash, constructorCalldata, addressSalt, signature }: DeployAccountContractTransaction, details: InvocationsDetailsWithNonce): Promise<DeployContractResponse>;
    invokeFunction(functionInvocation: Invocation, details: InvocationsDetailsWithNonce): Promise<InvokeFunctionResponse>;
    callContract(call: Call, blockIdentifier?: BlockIdentifier): Promise<CallContractResponse>;
    traceTransaction(transactionHash: TransactionHash): Promise<Trace>;
    traceBlockTransactions(blockHash: BlockHash): Promise<Traces>;
    waitForTransaction(txHash: string, options?: waitForTransactionOptions): Promise<any>;
    /**
     * Gets the transaction count from a block.
     *
     *
     * @param blockIdentifier
     * @returns Number of transactions
     */
    getTransactionCount(blockIdentifier?: BlockIdentifier): Promise<GetTransactionCountResponse>;
    /**
     * Gets the latest block number
     *
     *
     * @returns Number of the latest block
     */
    getBlockNumber(): Promise<GetBlockNumberResponse>;
    /**
     * Gets syncing status of the node
     *
     *
     * @returns Object with the stats data
     */
    getSyncingStats(): Promise<GetSyncingStatsResponse>;
    /**
     * Gets all the events filtered
     *
     *
     * @returns events and the pagination of the events
     */
    getEvents(eventFilter: EventFilter): Promise<GetEventsResponse>;
    getSimulateTransaction(invocations: AccountInvocations, { blockIdentifier, skipValidate, skipExecute, // @deprecated
    skipFeeCharge, }: getSimulateTransactionOptions): Promise<SimulateTransactionResponse>;
    getStarkName(address: BigNumberish, StarknetIdContract?: string): Promise<string>;
    getAddressFromStarkName(name: string, StarknetIdContract?: string): Promise<string>;
    buildTransaction(invocation: AccountInvocationItem, versionType?: 'fee' | 'transaction'): BaseTransaction;
}

declare const defaultProvider: Provider;

declare abstract class SignerInterface {
    /**
     * Method to get the public key of the signer
     *
     * @returns public key of signer as hex string with 0x prefix
     */
    abstract getPubKey(): Promise<string>;
    /**
     * Sign an JSON object for off-chain usage with the starknet private key and return the signature
     * This adds a message prefix so it cant be interchanged with transactions
     *
     * @param typedData - JSON object to be signed
     * @param accountAddress - account
     * @returns the signature of the JSON object
     * @throws {Error} if the JSON object is not a valid JSON
     */
    abstract signMessage(typedData: TypedData, accountAddress: string): Promise<Signature>;
    /**
     * Signs a transaction with the starknet private key and returns the signature
     *
     * @param invocation the invocation object containing:
     * - contractAddress - the address of the contract
     * - entrypoint - the entrypoint of the contract
     * - calldata - (defaults to []) the calldata
     * @param abi (optional) the abi of the contract for better displaying
     *
     * @returns signature
     */
    abstract signTransaction(transactions: Call[], transactionsDetail: InvocationsSignerDetails, abis?: Abi[]): Promise<Signature>;
    /**
     * Signs a DEPLOY_ACCOUNT transaction with the starknet private key and returns the signature
     *
     * @param transaction
     * - contractAddress - the computed address of the contract
     * - constructorCalldata - calldata to be passed in deploy constructor
     * - addressSalt - contract address salt
     * - chainId - the chainId to declare contract on
     * - maxFee - maxFee for the declare transaction
     * - version - transaction version
     * - nonce - Nonce of the declare transaction
     * @returns signature
     */
    abstract signDeployAccountTransaction(transaction: DeployAccountSignerDetails): Promise<Signature>;
    /**
     * Signs a DECLARE transaction with the starknet private key and returns the signature
     *
     * @param transaction
     * - classHash - computed class hash. Will be replaced by ContractClass in future once class hash is present in CompiledContract
     * - senderAddress - the address of the sender
     * - chainId - the chainId to declare contract on
     * - maxFee - maxFee for the declare transaction
     * - version - transaction version
     * - nonce - Nonce of the declare transaction
     * @returns signature
     */
    abstract signDeclareTransaction(transaction: DeclareSignerDetails): Promise<Signature>;
}

declare class Signer implements SignerInterface {
    protected pk: Uint8Array | string;
    constructor(pk?: Uint8Array | string);
    getPubKey(): Promise<string>;
    signMessage(typedData: TypedData, accountAddress: string): Promise<Signature>;
    signTransaction(transactions: Call[], transactionsDetail: InvocationsSignerDetails, abis?: Abi[]): Promise<Signature>;
    signDeployAccountTransaction({ classHash, contractAddress, constructorCalldata, addressSalt, maxFee, version, chainId, nonce, }: DeployAccountSignerDetails): Promise<Signature>;
    signDeclareTransaction({ classHash, senderAddress, chainId, maxFee, version, nonce, compiledClassHash, }: DeclareSignerDetails): Promise<Signature>;
}

declare abstract class AccountInterface extends ProviderInterface {
    abstract address: string;
    abstract signer: SignerInterface;
    abstract cairoVersion: CairoVersion;
    /**
     * Estimate Fee for executing an INVOKE transaction on starknet
     *
     * @param calls the invocation object containing:
     * - contractAddress - the address of the contract
     * - entrypoint - the entrypoint of the contract
     * - calldata - (defaults to []) the calldata
     *
     * @returns response from estimate_fee
     */
    abstract estimateInvokeFee(calls: AllowArray<Call>, estimateFeeDetails?: EstimateFeeDetails): Promise<EstimateFeeResponse>;
    /**
     * Estimate Fee for executing a DECLARE transaction on starknet
     *
     * @param contractPayload the payload object containing:
     * - contract - the compiled contract to be declared
     * - classHash - the class hash of the compiled contract. This can be obtained by using starknet-cli.
     *
     * @returns response from estimate_fee
     */
    abstract estimateDeclareFee(contractPayload: DeclareContractPayload, estimateFeeDetails?: EstimateFeeDetails): Promise<EstimateFeeResponse>;
    /**
     * Estimate Fee for executing a DEPLOY_ACCOUNT transaction on starknet
     *
     * @param contractPayload -
     * - contract - the compiled contract to be deployed
     * - classHash - the class hash of the compiled contract. This can be obtained by using starknet-cli.
     * @param estimateFeeDetails -
     * - optional blockIdentifier
     * - constant nonce = 0
     * @returns response from estimate_fee
     */
    abstract estimateAccountDeployFee(contractPayload: DeployAccountContractPayload, estimateFeeDetails?: EstimateFeeDetails): Promise<EstimateFeeResponse>;
    /**
     * Estimate Fee for executing a UDC DEPLOY transaction on starknet
     * This is different from the normal DEPLOY transaction as it goes through the Universal Deployer Contract (UDC)
     
    * @param deployContractPayload containing
     * - classHash: computed class hash of compiled contract
     * - salt: address salt
     * - unique: bool if true ensure unique salt
     * - calldata: constructor calldata
     *
     * @param transactionsDetail Invocation Details containing:
     *  - optional nonce
     *  - optional version
     *  - optional maxFee
     */
    abstract estimateDeployFee(deployContractPayload: UniversalDeployerContractPayload | UniversalDeployerContractPayload[], transactionsDetail?: InvocationsDetails): Promise<EstimateFeeResponse>;
    /**
     * Estimate Fee for executing a list of transactions on starknet
     * Contract must be deployed for fee estimation to be possible
     *
     * @param transactions array of transaction object containing :
     * - type - the type of transaction : 'DECLARE' | (multi)'DEPLOY' | (multi)'INVOKE_FUNCTION' | 'DEPLOY_ACCOUNT'
     * - payload - the payload of the transaction
     *
     * @returns response from estimate_fee
     */
    abstract estimateFeeBulk(invocations: Invocations, details?: EstimateFeeDetails): Promise<EstimateFeeResponseBulk>;
    /**
     * Invoke execute function in account contract
     *
     * @param transactions the invocation object or an array of them, containing:
     * - contractAddress - the address of the contract
     * - entrypoint - the entrypoint of the contract
     * - calldata - (defaults to []) the calldata
     * - signature - (defaults to []) the signature
     * @param abi (optional) the abi of the contract for better displaying
     *
     * @returns response from addTransaction
     */
    abstract execute(transactions: AllowArray<Call>, abis?: Abi[], transactionsDetail?: InvocationsDetails): Promise<InvokeFunctionResponse>;
    /**
     * Declares a given compiled contract (json) to starknet
     *
     * @param contractPayload transaction payload to be deployed containing:
    - contract: compiled contract code
    - (optional) classHash: computed class hash of compiled contract. Pre-compute it for faster execution.
    - (required for Cairo1 without compiledClassHash) casm: CompiledContract | string;
    - (optional for Cairo1 with casm) compiledClassHash: compiled class hash from casm. Pre-compute it for faster execution.
     * @param transactionsDetail Invocation Details containing:
    - optional nonce
    - optional version
    - optional maxFee
     * @returns a confirmation of sending a transaction on the starknet contract
     */
    abstract declare(contractPayload: DeclareContractPayload, transactionsDetail?: InvocationsDetails): Promise<DeclareContractResponse>;
    /**
     * Deploys a declared contract to starknet - using Universal Deployer Contract (UDC)
     * support multicall
     *
     * @param payload -
     * - classHash: computed class hash of compiled contract
     * - [constructorCalldata] contract constructor calldata
     * - [salt=pseudorandom] deploy address salt
     * - [unique=true] ensure unique salt
     * @param details -
     * - [nonce=getNonce]
     * - [version=transactionVersion]
     * - [maxFee=getSuggestedMaxFee]
     * @returns
     * - contract_address[]
     * - transaction_hash
     */
    abstract deploy(payload: UniversalDeployerContractPayload | UniversalDeployerContractPayload[], details?: InvocationsDetails | undefined): Promise<MultiDeployContractResponse>;
    /**
     * Simplify deploy simulating old DeployContract with same response + UDC specific response
     * Internal wait for L2 transaction, support multicall
     *
     * @param payload -
     * - classHash: computed class hash of compiled contract
     * - [constructorCalldata] contract constructor calldata
     * - [salt=pseudorandom] deploy address salt
     * - [unique=true] ensure unique salt
     * @param details -
     * - [nonce=getNonce]
     * - [version=transactionVersion]
     * - [maxFee=getSuggestedMaxFee]
     * @returns
     *  - contract_address
     *  - transaction_hash
     *  - address
     *  - deployer
     *  - unique
     *  - classHash
     *  - calldata_len
     *  - calldata
     *  - salt
     */
    abstract deployContract(payload: UniversalDeployerContractPayload | UniversalDeployerContractPayload[], details?: InvocationsDetails | undefined): Promise<DeployContractUDCResponse>;
    /**
     * Declares and Deploy a given compiled contract (json) to starknet using UDC
     * Internal wait for L2 transaction, do not support multicall
     * Method will pass even if contract is already declared (internal using DeclareIfNot)
     *
     * @param payload
     * - contract: compiled contract code
     * - [casm=cairo1]: CairoAssembly | undefined;
     * - [compiledClassHash]: string | undefined;
     * - [classHash]: computed class hash of compiled contract
     * - [constructorCalldata] contract constructor calldata
     * - [salt=pseudorandom] deploy address salt
     * - [unique=true] ensure unique salt
     * @param details
     * - [nonce=getNonce]
     * - [version=transactionVersion]
     * - [maxFee=getSuggestedMaxFee]
     * @returns
     * - declare
     *    - transaction_hash
     * - deploy
     *    - contract_address
     *    - transaction_hash
     *    - address
     *    - deployer
     *    - unique
     *    - classHash
     *    - calldata_len
     *    - calldata
     *    - salt
     */
    abstract declareAndDeploy(payload: DeclareAndDeployContractPayload, details?: InvocationsDetails | undefined): Promise<DeclareDeployUDCResponse>;
    /**
     * Deploy the account on Starknet
     *
     * @param contractPayload transaction payload to be deployed containing:
    - classHash: computed class hash of compiled contract
    - optional constructor calldata
    - optional address salt
    - optional contractAddress
     * @param transactionsDetail Invocation Details containing:
    - constant nonce = 0
    - optional version
    - optional maxFee
     * @returns a confirmation of sending a transaction on the starknet contract
     */
    abstract deployAccount(contractPayload: DeployAccountContractPayload, transactionsDetail?: InvocationsDetails): Promise<DeployContractResponse>;
    /**
     * Sign an JSON object for off-chain usage with the starknet private key and return the signature
     * This adds a message prefix so it cant be interchanged with transactions
     *
     * @param json - JSON object to be signed
     * @returns the signature of the JSON object
     * @throws {Error} if the JSON object is not a valid JSON
     */
    abstract signMessage(typedData: TypedData): Promise<Signature>;
    /**
     * Hash a JSON object with pederson hash and return the hash
     * This adds a message prefix so it cant be interchanged with transactions
     *
     * @param json - JSON object to be hashed
     * @returns the hash of the JSON object
     * @throws {Error} if the JSON object is not a valid JSON
     */
    abstract hashMessage(typedData: TypedData): Promise<string>;
    /**
     * Verify a signature of a JSON object
     *
     * @param typedData - JSON object to be verified
     * @param signature - signature of the JSON object
     * @returns true if the signature is valid, false otherwise
     * @throws {Error} if the JSON object is not a valid JSON or the signature is not a valid signature
     */
    abstract verifyMessage(typedData: TypedData, signature: Signature): Promise<boolean>;
    /**
     * Verify a signature of a given hash
     * @warning This method is not recommended, use verifyMessage instead
     *
     * @param hash - hash to be verified
     * @param signature - signature of the hash
     * @returns true if the signature is valid, false otherwise
     * @throws {Error} if the signature is not a valid signature
     */
    abstract verifyMessageHash(hash: BigNumberish, signature: Signature): Promise<boolean>;
    /**
     * Gets the nonce of the account with respect to a specific block
     *
     * @param  {BlockIdentifier} blockIdentifier - optional blockIdentifier. Defaults to 'pending'
     * @returns nonce of the account
     */
    abstract getNonce(blockIdentifier?: BlockIdentifier): Promise<Nonce>;
    /**
     * Gets Suggested Max Fee based on the transaction type
     *
     * @param  {EstimateFeeAction} estimateFeeAction
     * @param  {EstimateFeeDetails} details
     * @returns suggestedMaxFee
     */
    abstract getSuggestedMaxFee(estimateFeeAction: EstimateFeeAction, details: EstimateFeeDetails): Promise<bigint>;
    /**
     * Simulates an array of transaction and returns an array of transaction trace and estimated fee.
     *
     * @param invocations Invocations containing:
     * - type - transaction type: DECLARE, (multi)DEPLOY, DEPLOY_ACCOUNT, (multi)INVOKE_FUNCTION
     * @param details SimulateTransactionDetails
     *
     * @returns response from simulate_transaction
     */
    abstract simulateTransaction(invocations: Invocations, details?: SimulateTransactionDetails): Promise<SimulateTransactionResponse>;
}

declare class Account extends Provider implements AccountInterface {
    signer: SignerInterface;
    address: string;
    cairoVersion: CairoVersion;
    constructor(providerOrOptions: ProviderOptions | ProviderInterface, address: string, pkOrSigner: Uint8Array | string | SignerInterface, cairoVersion?: CairoVersion);
    getNonce(blockIdentifier?: BlockIdentifier): Promise<Nonce>;
    private getNonceSafe;
    estimateFee(calls: AllowArray<Call>, estimateFeeDetails?: EstimateFeeDetails | undefined): Promise<EstimateFee>;
    estimateInvokeFee(calls: AllowArray<Call>, { nonce: providedNonce, blockIdentifier, skipValidate }?: EstimateFeeDetails): Promise<EstimateFee>;
    estimateDeclareFee({ contract, classHash: providedClassHash, casm, compiledClassHash }: DeclareContractPayload, { blockIdentifier, nonce: providedNonce, skipValidate }?: EstimateFeeDetails): Promise<EstimateFee>;
    estimateAccountDeployFee({ classHash, addressSalt, constructorCalldata, contractAddress: providedContractAddress, }: DeployAccountContractPayload, { blockIdentifier, skipValidate }?: EstimateFeeDetails): Promise<EstimateFee>;
    estimateDeployFee(payload: UniversalDeployerContractPayload | UniversalDeployerContractPayload[], transactionsDetail?: InvocationsDetails | undefined): Promise<EstimateFee>;
    estimateFeeBulk(invocations: Invocations, { nonce, blockIdentifier, skipValidate }?: EstimateFeeDetails): Promise<EstimateFeeBulk>;
    buildInvocation(call: Array<Call>, signerDetails: InvocationsSignerDetails): Promise<Invocation>;
    execute(calls: AllowArray<Call>, abis?: Abi[] | undefined, transactionsDetail?: InvocationsDetails): Promise<InvokeFunctionResponse>;
    /**
     * First check if contract is already declared, if not declare it
     * If contract already declared returned transaction_hash is ''.
     * Method will pass even if contract is already declared
     * @param transactionsDetail (optional)
     */
    declareIfNot(payload: DeclareContractPayload, transactionsDetail?: InvocationsDetails): Promise<DeclareContractResponse>;
    declare(payload: DeclareContractPayload, transactionsDetail?: InvocationsDetails): Promise<DeclareContractResponse>;
    deploy(payload: UniversalDeployerContractPayload | UniversalDeployerContractPayload[], details?: InvocationsDetails | undefined): Promise<MultiDeployContractResponse>;
    deployContract(payload: UniversalDeployerContractPayload | UniversalDeployerContractPayload[], details?: InvocationsDetails | undefined): Promise<DeployContractUDCResponse>;
    declareAndDeploy(payload: DeclareAndDeployContractPayload, details?: InvocationsDetails | undefined): Promise<DeclareDeployUDCResponse>;
    deploySelf: ({ classHash, constructorCalldata, addressSalt, contractAddress: providedContractAddress, }: DeployAccountContractPayload, transactionsDetail?: InvocationsDetails) => Promise<DeployContractResponse>;
    deployAccount({ classHash, constructorCalldata, addressSalt, contractAddress: providedContractAddress, }: DeployAccountContractPayload, transactionsDetail?: InvocationsDetails): Promise<DeployContractResponse>;
    signMessage(typedData: TypedData): Promise<Signature>;
    hashMessage(typedData: TypedData): Promise<string>;
    verifyMessageHash(hash: BigNumberish, signature: Signature): Promise<boolean>;
    verifyMessage(typedData: TypedData, signature: Signature): Promise<boolean>;
    getSuggestedMaxFee({ type, payload }: EstimateFeeAction, details: EstimateFeeDetails): Promise<bigint>;
    /**
     * will be renamed to buildDeclareContractTransaction
     */
    buildDeclarePayload(payload: DeclareContractPayload, { nonce, chainId, version, walletAddress, maxFee }: InvocationsSignerDetails): Promise<DeclareContractTransaction>;
    buildAccountDeployPayload({ classHash, addressSalt, constructorCalldata, contractAddress: providedContractAddress, }: DeployAccountContractPayload, { nonce, chainId, version, maxFee }: InvocationsSignerDetails): Promise<DeployAccountContractTransaction>;
    buildUDCContractPayload(payload: UniversalDeployerContractPayload | UniversalDeployerContractPayload[]): Call[];
    simulateTransaction(invocations: Invocations, { nonce, blockIdentifier, skipValidate, skipExecute }?: SimulateTransactionDetails): Promise<SimulateTransactionResponse>;
    accountInvocationsFactory(invocations: Invocations, { versions, nonce, blockIdentifier }: AccountInvocationsFactoryDetails): Promise<AccountInvocations>;
    getStarkName(address?: BigNumberish, // default to the wallet address
    StarknetIdContract?: string): Promise<string>;
}

type TypedContract<TAbi extends Abi$1> = TypedContract$1<TAbi> & ContractInterface;
declare abstract class ContractInterface {
    abstract abi: Abi;
    abstract address: string;
    abstract providerOrAccount: ProviderInterface | AccountInterface;
    abstract deployTransactionHash?: string;
    readonly functions: {
        [name: string]: AsyncContractFunction;
    };
    readonly callStatic: {
        [name: string]: AsyncContractFunction;
    };
    readonly populateTransaction: {
        [name: string]: ContractFunction;
    };
    readonly estimateFee: {
        [name: string]: ContractFunction;
    };
    readonly [key: string]: AsyncContractFunction | any;
    /**
     * Saves the address of the contract deployed on network that will be used for interaction
     *
     * @param address - address of the contract
     */
    abstract attach(address: string): void;
    /**
     * Attaches to new Provider or Account
     *
     * @param providerOrAccount - new Provider or Account to attach to
     */
    abstract connect(providerOrAccount: ProviderInterface | AccountInterface): void;
    /**
     * Resolves when contract is deployed on the network or when no deployment transaction is found
     *
     * @returns Promise that resolves when contract is deployed on the network or when no deployment transaction is found
     * @throws When deployment fails
     */
    abstract deployed(): Promise<ContractInterface>;
    /**
     * Calls a method on a contract
     *
     * @param method name of the method
     * @param args Array of the arguments for the call
     * @param options optional blockIdentifier
     * @returns Result of the call as an array with key value pars
     */
    abstract call(method: string, args?: ArgsOrCalldata, options?: CallOptions): Promise<Result>;
    /**
     * Invokes a method on a contract
     *
     * @param method name of the method
     * @param args Array of the arguments for the invoke or Calldata
     * @param options
     * @returns Add Transaction Response
     */
    abstract invoke(method: string, args?: ArgsOrCalldata, options?: InvokeOptions): Promise<InvokeFunctionResponse>;
    /**
     * Estimates a method on a contract
     *
     * @param method name of the method
     * @param args Array of the arguments for the call or Calldata
     * @param options optional blockIdentifier
     */
    abstract estimate(method: string, args?: ArgsOrCalldata, options?: {
        blockIdentifier?: BlockIdentifier;
    }): Promise<EstimateFeeResponse>;
    /**
     * Calls a method on a contract
     *
     * @param method name of the method
     * @param args Array of the arguments for the call or Calldata
     * @returns Invocation object
     */
    abstract populate(method: string, args?: ArgsOrCalldata): Invocation;
    /**
     * Parse contract events of a GetTransactionReceiptResponse received from waitForTransaction. Based on contract's abi
     *
     * @param receipt transaction receipt
     * @returns Events parsed
     */
    abstract parseEvents(receipt: GetTransactionReceiptResponse): ParsedEvents;
    /**
     * tells if the contract comes from a Cairo 1 contract
     *
     * @returns TRUE if the contract comes from a Cairo1 contract
     * @example
     * ```typescript
     * const isCairo1: boolean = myContract.isCairo1();
     * ```
     */
    abstract isCairo1(): boolean;
    abstract typed<TAbi extends Abi$1>(tAbi: TAbi): TypedContract<TAbi>;
}

declare const splitArgsAndOptions: (args: ArgsOrCalldataWithOptions) => {
    args: ArgsOrCalldata;
    options: ContractOptions;
} | {
    args: ArgsOrCalldata;
    options?: undefined;
};
declare function getCalldata(args: RawArgs, callback: Function): Calldata;
declare class Contract implements ContractInterface {
    abi: Abi;
    address: string;
    providerOrAccount: ProviderInterface | AccountInterface;
    deployTransactionHash?: string;
    protected readonly structs: {
        [name: string]: StructAbi;
    };
    protected readonly events: AbiEvents;
    readonly functions: {
        [name: string]: AsyncContractFunction;
    };
    readonly callStatic: {
        [name: string]: AsyncContractFunction;
    };
    readonly populateTransaction: {
        [name: string]: ContractFunction;
    };
    readonly estimateFee: {
        [name: string]: ContractFunction;
    };
    readonly [key: string]: AsyncContractFunction | any;
    private callData;
    /**
     * Contract class to handle contract methods
     *
     * @param abi - Abi of the contract object
     * @param address (optional) - address to connect to
     * @param providerOrAccount (optional) - Provider or Account to attach to
     */
    constructor(abi: Abi, address: string, providerOrAccount?: ProviderInterface | AccountInterface);
    attach(address: string): void;
    connect(providerOrAccount: ProviderInterface | AccountInterface): void;
    deployed(): Promise<Contract>;
    call(method: string, args?: ArgsOrCalldata, { parseRequest, parseResponse, formatResponse, blockIdentifier, }?: CallOptions): Promise<Result>;
    invoke(method: string, args?: ArgsOrCalldata, { parseRequest, maxFee, nonce, signature }?: InvokeOptions): Promise<InvokeFunctionResponse>;
    estimate(method: string, args?: ArgsOrCalldata): Promise<EstimateFeeResponse>;
    populate(method: string, args?: RawArgs): Call;
    parseEvents(receipt: GetTransactionReceiptResponse): ParsedEvents;
    isCairo1(): boolean;
    typed<TAbi extends Abi$1>(tAbi: TAbi): TypedContract<TAbi>;
}

type ContractFactoryParams = {
    compiledContract: CompiledContract;
    account: any;
    casm?: CairoAssembly;
    classHash?: string;
    compiledClassHash?: string;
    abi?: Abi;
};
declare class ContractFactory {
    compiledContract: CompiledContract;
    account: AccountInterface;
    abi: Abi;
    classHash?: string;
    casm?: CairoAssembly;
    compiledClassHash?: string;
    private CallData;
    /**
     * @param params CFParams
     *  - compiledContract: CompiledContract;
     *  - account: AccountInterface;
     *  - casm?: CairoAssembly;
     *  - classHash?: string;
     *  - compiledClassHash?: string;
     *  - abi?: Abi;
     */
    constructor(params: ContractFactoryParams);
    /**
     * Deploys contract and returns new instance of the Contract
     *
     * If contract is not declared it will first declare it, and then deploy
     */
    deploy(...args: ArgsOrCalldataWithOptions): Promise<Contract>;
    /**
     * Attaches to new Account
     *
     * @param account - new Account to attach to
     */
    connect(account: AccountInterface): ContractFactory;
    /**
     * Attaches current abi and account to the new address
     */
    attach(address: string): Contract;
}

/**
 * Calculate hex-string keccak hash for a given BigNumberish
 *
 * BigNumberish -> hex-string keccak hash
 * @returns format: hex-string
 */
declare function keccakBn(value: BigNumberish): string;
/**
 * Calculate bigint keccak hash for a given string
 *
 * String -> bigint keccak hash
 *
 * [Reference](https://github.com/starkware-libs/cairo-lang/blob/master/src/starkware/starknet/public/abi.py#L17-L22)
 * @param str the value you want to get the keccak hash from
 * @returns starknet keccak hash as BigInt
 */
declare function starknetKeccak(str: string): bigint;
/**
 * Calculate hex-string selector for a given abi-function-name
 *
 * Abi-function-name -> hex-string selector
 *
 * [Reference](https://github.com/starkware-libs/cairo-lang/blob/master/src/starkware/starknet/public/abi.py#L25-L26)
 * @param funcName ascii-string of 'abi function name'
 * @returns format: hex-string; selector for 'abi function name'
 */
declare function getSelectorFromName(funcName: string): string;
/**
 * Calculate hex-string selector from abi-function-name, decimal string or hex string
 *
 * ('abi-function-name' or dec-string or hex-string) -> hex-string selector
 *
 * @param value hex-string | dec-string | ascii-string
 * @returns format: hex-string
 */
declare function getSelector(value: string): string;

declare const selector_getSelector: typeof getSelector;
declare const selector_getSelectorFromName: typeof getSelectorFromName;
declare const selector_keccakBn: typeof keccakBn;
declare const selector_starknetKeccak: typeof starknetKeccak;
declare namespace selector {
  export {
    selector_getSelector as getSelector,
    selector_getSelectorFromName as getSelectorFromName,
    selector_keccakBn as keccakBn,
    selector_starknetKeccak as starknetKeccak,
  };
}

declare const transactionVersion = 1n;
declare const transactionVersion_2 = 2n;
declare const feeTransactionVersion: bigint;
declare const feeTransactionVersion_2: bigint;
/**
 * Return transaction versions based on version type, default version type is 'transaction'
 */
declare function getVersionsByType(versionType?: 'fee' | 'transaction'): {
    v1: bigint;
    v2: bigint;
};
/**
 * Compute pedersen hash from data
 * @returns format: hex-string - pedersen hash
 */
declare function computeHashOnElements(data: BigNumberish[]): string;
/**
 * Calculate transaction pedersen hash for common properties
 *
 * Following implementation is based on this python [implementation #](https://github.com/starkware-libs/cairo-lang/blob/b614d1867c64f3fb2cf4a4879348cfcf87c3a5a7/src/starkware/starknet/core/os/transaction_hash/transaction_hash.py)
 * @returns format: hex-string
 */
declare function calculateTransactionHashCommon(txHashPrefix: TransactionHashPrefix, version: BigNumberish, contractAddress: BigNumberish, entryPointSelector: BigNumberish, calldata: RawCalldata, maxFee: BigNumberish, chainId: StarknetChainId, additionalData?: BigNumberish[]): string;
/**
 * Calculate deploy transaction hash
 * @returns format: hex-string
 */
declare function calculateDeployTransactionHash(contractAddress: BigNumberish, constructorCalldata: RawCalldata, version: BigNumberish, chainId: StarknetChainId, constructorName?: string): string;
/**
 * Calculate declare transaction hash
 * @param classHash hex-string
 * @param compiledClassHash hex-string
 * @returns format: hex-string
 */
declare function calculateDeclareTransactionHash(classHash: string, senderAddress: BigNumberish, version: BigNumberish, maxFee: BigNumberish, chainId: StarknetChainId, nonce: BigNumberish, compiledClassHash?: string): string;
/**
 * Calculate deploy_account transaction hash
 * @returns format: hex-string
 */
declare function calculateDeployAccountTransactionHash(contractAddress: BigNumberish, classHash: BigNumberish, constructorCalldata: RawCalldata, salt: BigNumberish, version: BigNumberish, maxFee: BigNumberish, chainId: StarknetChainId, nonce: BigNumberish): string;
/**
 * Calculate invoke transaction hash
 * @returns format: hex-string
 */
declare function calculateTransactionHash(contractAddress: BigNumberish, version: BigNumberish, calldata: RawCalldata, maxFee: BigNumberish, chainId: StarknetChainId, nonce: BigNumberish): string;
/**
 * Calculate contract address from class hash
 * @returns format: hex-string
 */
declare function calculateContractAddressFromHash(salt: BigNumberish, classHash: BigNumberish, constructorCalldata: RawArgs, deployerAddress: BigNumberish): string;
/**
 * Format json-string to conform starknet json-string
 * @param json json-string
 * @returns format: json-string
 */
declare function formatSpaces(json: string): string;
/**
 * Compute hinted class hash for legacy compiled contract (Cairo 0)
 * @returns format: hex-string
 */
declare function computeHintedClassHash(compiledContract: LegacyCompiledContract): string;
/**
 * Computes the class hash for legacy compiled contract (Cairo 0)
 * @returns format: hex-string
 */
declare function computeLegacyContractClassHash(contract: LegacyCompiledContract | string): string;
/**
 * Compute compiled class hash for contract (Cairo 1)
 * @returns format: hex-string
 */
declare function computeCompiledClassHash(casm: CompiledSierraCasm): string;
/**
 * Compute sierra contract class hash (Cairo 1)
 * @returns format: hex-string
 */
declare function computeSierraContractClassHash(sierra: CompiledSierra): string;
/**
 * Compute ClassHash (sierra or legacy) based on provided contract
 * @returns format: hex-string
 */
declare function computeContractClassHash(contract: CompiledContract | string): string;

declare const hash_calculateContractAddressFromHash: typeof calculateContractAddressFromHash;
declare const hash_calculateDeclareTransactionHash: typeof calculateDeclareTransactionHash;
declare const hash_calculateDeployAccountTransactionHash: typeof calculateDeployAccountTransactionHash;
declare const hash_calculateDeployTransactionHash: typeof calculateDeployTransactionHash;
declare const hash_calculateTransactionHash: typeof calculateTransactionHash;
declare const hash_calculateTransactionHashCommon: typeof calculateTransactionHashCommon;
declare const hash_computeCompiledClassHash: typeof computeCompiledClassHash;
declare const hash_computeContractClassHash: typeof computeContractClassHash;
declare const hash_computeHashOnElements: typeof computeHashOnElements;
declare const hash_computeLegacyContractClassHash: typeof computeLegacyContractClassHash;
declare const hash_computeSierraContractClassHash: typeof computeSierraContractClassHash;
declare const hash_feeTransactionVersion: typeof feeTransactionVersion;
declare const hash_feeTransactionVersion_2: typeof feeTransactionVersion_2;
declare const hash_formatSpaces: typeof formatSpaces;
declare const hash_getSelector: typeof getSelector;
declare const hash_getSelectorFromName: typeof getSelectorFromName;
declare const hash_getVersionsByType: typeof getVersionsByType;
declare const hash_keccakBn: typeof keccakBn;
declare const hash_poseidon: typeof poseidon;
declare const hash_starknetKeccak: typeof starknetKeccak;
declare const hash_transactionVersion: typeof transactionVersion;
declare const hash_transactionVersion_2: typeof transactionVersion_2;
declare namespace hash {
  export {
    hash_calculateContractAddressFromHash as calculateContractAddressFromHash,
    hash_calculateDeclareTransactionHash as calculateDeclareTransactionHash,
    hash_calculateDeployAccountTransactionHash as calculateDeployAccountTransactionHash,
    hash_calculateDeployTransactionHash as calculateDeployTransactionHash,
    hash_calculateTransactionHash as calculateTransactionHash,
    hash_calculateTransactionHashCommon as calculateTransactionHashCommon,
    hash_computeCompiledClassHash as computeCompiledClassHash,
    hash_computeContractClassHash as computeContractClassHash,
    hash_computeHashOnElements as computeHashOnElements,
    hash_computeLegacyContractClassHash as computeLegacyContractClassHash,
    hash_computeSierraContractClassHash as computeSierraContractClassHash,
    computeHintedClassHash as default,
    hash_feeTransactionVersion as feeTransactionVersion,
    hash_feeTransactionVersion_2 as feeTransactionVersion_2,
    hash_formatSpaces as formatSpaces,
    hash_getSelector as getSelector,
    hash_getSelectorFromName as getSelectorFromName,
    hash_getVersionsByType as getVersionsByType,
    hash_keccakBn as keccakBn,
    hash_poseidon as poseidon,
    hash_starknetKeccak as starknetKeccak,
    hash_transactionVersion as transactionVersion,
    hash_transactionVersion_2 as transactionVersion_2,
  };
}

/**
 * Convert JSON string to JSON object
 *
 * NOTE: the String() wrapping is used so the behavior conforms to JSON.parse()
 * which can accept simple data types but is not represented in the default typing
 * @param x JSON string
 */
declare const parse: (x: string) => any;
/**
 * Convert JSON string to JSON object with all numbers as bigint
 * @param x JSON string
 */
declare const parseAlwaysAsBig: (x: string) => any;
/**
 * Convert JSON object to JSON string
 *
 * NOTE: the not-null assertion is used so the return type conforms to JSON.stringify()
 * which can also return undefined but is not represented in the default typing
 * @returns JSON string
 */
declare const stringify: (value: json$1.JavaScriptValue, replacer?: any, space?: string | number | undefined, numberStringifiers?: json$1.NumberStringifier[] | undefined) => string;
/** @deprecated equivalent to 'stringify', alias will be removed */
declare const stringifyAlwaysAsBig: (value: json$1.JavaScriptValue, replacer?: any, space?: string | number | undefined, numberStringifiers?: json$1.NumberStringifier[] | undefined) => string;

declare const json_parse: typeof parse;
declare const json_parseAlwaysAsBig: typeof parseAlwaysAsBig;
declare const json_stringify: typeof stringify;
declare const json_stringifyAlwaysAsBig: typeof stringifyAlwaysAsBig;
declare namespace json {
  export {
    json_parse as parse,
    json_parseAlwaysAsBig as parseAlwaysAsBig,
    json_stringify as stringify,
    json_stringifyAlwaysAsBig as stringifyAlwaysAsBig,
  };
}

/**
 * Test if string is hex-string
 * @param hex hex-string
 */
declare function isHex(hex: string): boolean;
/**
 * Convert BigNumberish to bigint
 */
declare function toBigInt(value: BigNumberish): bigint;
/**
 * Test if value is bigint
 */
declare function isBigInt(value: any): value is bigint;
/**
 * Convert BigNumberish to hex-string
 * @returns format: hex-string
 */
declare function toHex(number: BigNumberish): string;
/**
 * Alias of ToHex
 */
declare const toHexString: typeof toHex;
/**
 * Convert BigNumberish to storage-key-string
 *
 * Same as toHex but conforming to the STORAGE_KEY pattern `^0x0[0-7]{1}[a-fA-F0-9]{0,62}$`.
 *
 * A storage key is represented as up to 62 hex digits, 3 bits, and 5 leading zeroes:
 * `0x0 + [0-7] + 62 hex = 0x + 64 hex`
 * @returns format: storage-key-string
 */
declare function toStorageKey(number: BigNumberish): string;
/**
 * Convert hexadecimal string to decimal string
 * @param hex hex-string
 * @returns format: decimal string
 */
declare function hexToDecimalString(hex: string): string;
/**
 * Remove hex string leading zero and lowercase it
 * @example '0x01A...' -> '0x1a..'
 * @param hex hex-string
 * @returns format: hex-string
 */
declare const cleanHex: (hex: string) => string;
/**
 * Asserts input is equal to or greater then lowerBound and lower then upperBound.
 *
 * The `inputName` parameter is used in the assertion message.
 */
declare function assertInRange(input: BigNumberish, lowerBound: BigNumberish, upperBound: BigNumberish, inputName?: string): void;
/**
 * Convert BigNumberish array to decimal string array
 * @returns format: decimal string array
 */
declare function bigNumberishArrayToDecimalStringArray(rawCalldata: BigNumberish[]): string[];
/**
 * Convert BigNumberish array to hexadecimal string array
 * @returns format: hex-string array
 */
declare function bigNumberishArrayToHexadecimalStringArray(rawCalldata: BigNumberish[]): string[];
/**
 * Test if string is whole number (0,1,2,3...)
 */
declare const isStringWholeNumber: (value: string) => boolean;
/**
 * Convert string to decimal string
 * @returns format: decimal string
 */
declare function getDecimalString(value: string): string;
/**
 * Convert string to hexadecimal string
 * @returns format: hex-string
 */
declare function getHexString(value: string): string;
/**
 * Convert string array to hex-string array
 * @returns format: hex-string array
 */
declare function getHexStringArray(value: Array<string>): string[];
/**
 * Convert boolean to "0" or "1"
 */
declare const toCairoBool: (value: boolean) => string;
/**
 * Convert hex-string to an array of Bytes (Uint8Array)
 * @param value hex-string
 */
declare function hexToBytes(value: string): Uint8Array;

type num_BigNumberish = BigNumberish;
declare const num_assertInRange: typeof assertInRange;
declare const num_bigNumberishArrayToDecimalStringArray: typeof bigNumberishArrayToDecimalStringArray;
declare const num_bigNumberishArrayToHexadecimalStringArray: typeof bigNumberishArrayToHexadecimalStringArray;
declare const num_cleanHex: typeof cleanHex;
declare const num_getDecimalString: typeof getDecimalString;
declare const num_getHexString: typeof getHexString;
declare const num_getHexStringArray: typeof getHexStringArray;
declare const num_hexToBytes: typeof hexToBytes;
declare const num_hexToDecimalString: typeof hexToDecimalString;
declare const num_isBigInt: typeof isBigInt;
declare const num_isHex: typeof isHex;
declare const num_isStringWholeNumber: typeof isStringWholeNumber;
declare const num_toBigInt: typeof toBigInt;
declare const num_toCairoBool: typeof toCairoBool;
declare const num_toHex: typeof toHex;
declare const num_toHexString: typeof toHexString;
declare const num_toStorageKey: typeof toStorageKey;
declare namespace num {
  export {
    num_BigNumberish as BigNumberish,
    num_assertInRange as assertInRange,
    num_bigNumberishArrayToDecimalStringArray as bigNumberishArrayToDecimalStringArray,
    num_bigNumberishArrayToHexadecimalStringArray as bigNumberishArrayToHexadecimalStringArray,
    num_cleanHex as cleanHex,
    num_getDecimalString as getDecimalString,
    num_getHexString as getHexString,
    num_getHexStringArray as getHexStringArray,
    num_hexToBytes as hexToBytes,
    num_hexToDecimalString as hexToDecimalString,
    num_isBigInt as isBigInt,
    num_isHex as isHex,
    num_isStringWholeNumber as isStringWholeNumber,
    num_toBigInt as toBigInt,
    num_toCairoBool as toCairoBool,
    num_toHex as toHex,
    num_toHexString as toHexString,
    num_toStorageKey as toStorageKey,
  };
}

/**
 * Transforms a list of Calls, each with their own calldata, into
 * two arrays: one with the entrypoints, and one with the concatenated calldata.
 */
declare const transformCallsToMulticallArrays: (calls: Call[]) => {
    callArray: ParsedStruct[];
    calldata: Calldata;
};
/**
 * Transforms a list of calls into the Cairo 0 `__execute__` calldata.
 */
declare const fromCallsToExecuteCalldata: (calls: Call[]) => Calldata;
/**
 * Transforms a list of calls into the Cairo 0 `__execute__` calldata including nonce.
 *
 * @deprecated
 */
declare const fromCallsToExecuteCalldataWithNonce: (calls: Call[], nonce: BigNumberish) => Calldata;
/**
 * Format Data inside Calls
 *
 * @deprecated Not required for getting execute Calldata
 */
declare const transformCallsToMulticallArrays_cairo1: (calls: Call[]) => CallStruct[];
/**
 * Transforms a list of calls into the Cairo 1 `__execute__` calldata.
 */
declare const fromCallsToExecuteCalldata_cairo1: (calls: Call[]) => Calldata;
/**
 * Create `__execute__` Calldata from Calls based on Cairo versions
 */
declare const getExecuteCalldata: (calls: Call[], cairoVersion?: CairoVersion) => Calldata;

declare const transaction_fromCallsToExecuteCalldata: typeof fromCallsToExecuteCalldata;
declare const transaction_fromCallsToExecuteCalldataWithNonce: typeof fromCallsToExecuteCalldataWithNonce;
declare const transaction_fromCallsToExecuteCalldata_cairo1: typeof fromCallsToExecuteCalldata_cairo1;
declare const transaction_getExecuteCalldata: typeof getExecuteCalldata;
declare const transaction_transformCallsToMulticallArrays: typeof transformCallsToMulticallArrays;
declare const transaction_transformCallsToMulticallArrays_cairo1: typeof transformCallsToMulticallArrays_cairo1;
declare namespace transaction {
  export {
    transaction_fromCallsToExecuteCalldata as fromCallsToExecuteCalldata,
    transaction_fromCallsToExecuteCalldataWithNonce as fromCallsToExecuteCalldataWithNonce,
    transaction_fromCallsToExecuteCalldata_cairo1 as fromCallsToExecuteCalldata_cairo1,
    transaction_getExecuteCalldata as getExecuteCalldata,
    transaction_transformCallsToMulticallArrays as transformCallsToMulticallArrays,
    transaction_transformCallsToMulticallArrays_cairo1 as transformCallsToMulticallArrays_cairo1,
  };
}

/**
 * Compress compiled Cairo program
 *
 * [Reference](https://github.com/starkware-libs/cairo-lang/blob/master/src/starkware/starknet/services/api/gateway/transaction.py#L54-L58)
 * @param jsonProgram Representing the compiled cairo program
 */
declare function compressProgram(jsonProgram: Program | string): CompressedProgram;
/**
 * Decompress compressed compiled Cairo program
 * @param base64 Compressed program
 * @returns Parsed decompressed compiled Cairo program
 */
declare function decompressProgram(base64: CompressedProgram): any;
/**
 * Random Address based on random keyPair
 */
declare function randomAddress(): string;
/**
 * Lowercase and hex prefix string
 *
 * @deprecated Not used internally, naming is confusing based on functionality
 */
declare function makeAddress(input: string): string;
/**
 * Format Signature to standard type (hex array)
 * @returns Custom hex array or weierstrass.SignatureType hex array
 */
declare function formatSignature(sig?: Signature): ArraySignatureType;
/**
 * Format Signature to decimal string array
 */
declare function signatureToDecimalArray(sig?: Signature): ArraySignatureType;
/**
 * Format Signature to hex string array
 */
declare function signatureToHexArray(sig?: Signature): ArraySignatureType;
/**
 * Convert estimated fee to max fee with overhead
 */
declare function estimatedFeeToMaxFee(estimatedFee: BigNumberish, overhead?: number): bigint;

declare const stark_compressProgram: typeof compressProgram;
declare const stark_decompressProgram: typeof decompressProgram;
declare const stark_estimatedFeeToMaxFee: typeof estimatedFeeToMaxFee;
declare const stark_formatSignature: typeof formatSignature;
declare const stark_makeAddress: typeof makeAddress;
declare const stark_randomAddress: typeof randomAddress;
declare const stark_signatureToDecimalArray: typeof signatureToDecimalArray;
declare const stark_signatureToHexArray: typeof signatureToHexArray;
declare namespace stark {
  export {
    stark_compressProgram as compressProgram,
    stark_decompressProgram as decompressProgram,
    stark_estimatedFeeToMaxFee as estimatedFeeToMaxFee,
    stark_formatSignature as formatSignature,
    stark_makeAddress as makeAddress,
    stark_randomAddress as randomAddress,
    stark_signatureToDecimalArray as signatureToDecimalArray,
    stark_signatureToHexArray as signatureToHexArray,
  };
}

declare class MerkleTree {
    leaves: string[];
    branches: string[][];
    root: string;
    constructor(leafHashes: string[]);
    /**
     * Create Merkle tree
     * @param leaves hex-string array
     * @returns format: hex-string; Merkle tree root
     */
    private build;
    /**
     * Create pedersen hash from a and b
     * @returns format: hex-string
     */
    static hash(a: string, b: string): string;
    /**
     * Return path to leaf
     * @param leaf hex-string
     * @param branch hex-string array
     * @param hashPath hex-string array
     * @returns format: hex-string array
     */
    getProof(leaf: string, branch?: string[], hashPath?: string[]): string[];
}
/**
 * Test Merkle tree path
 * @param root hex-string
 * @param leaf hex-string
 * @param path hex-string array
 */
declare function proofMerklePath(root: string, leaf: string, path: string[]): boolean;

type merkle_MerkleTree = MerkleTree;
declare const merkle_MerkleTree: typeof MerkleTree;
declare const merkle_proofMerklePath: typeof proofMerklePath;
declare namespace merkle {
  export {
    merkle_MerkleTree as MerkleTree,
    merkle_proofMerklePath as proofMerklePath,
  };
}

declare const UINT_128_MAX: bigint;
declare const UINT_256_MAX: bigint;
/**
 * Convert Uint256 to bigint
 */
declare function uint256ToBN(uint256: Uint256): bigint;
/**
 * Test BigNumberish is smaller or equal 2**256-1
 */
declare function isUint256(bn: BigNumberish): boolean;
/**
 * Convert BigNumberish (string | number | bigint) to Uint256 (hex)
 */
declare function bnToUint256(bn: BigNumberish): Uint256;

declare const uint256$1_UINT_128_MAX: typeof UINT_128_MAX;
declare const uint256$1_UINT_256_MAX: typeof UINT_256_MAX;
type uint256$1_Uint256 = Uint256;
declare const uint256$1_bnToUint256: typeof bnToUint256;
declare const uint256$1_isUint256: typeof isUint256;
declare const uint256$1_uint256ToBN: typeof uint256ToBN;
declare namespace uint256$1 {
  export {
    uint256$1_UINT_128_MAX as UINT_128_MAX,
    uint256$1_UINT_256_MAX as UINT_256_MAX,
    uint256$1_Uint256 as Uint256,
    uint256$1_bnToUint256 as bnToUint256,
    uint256$1_isUint256 as isUint256,
    uint256$1_uint256ToBN as uint256ToBN,
  };
}

/**
 * Test if string contains only ASCII characters (string can be ascii text)
 */
declare function isASCII(str: string): boolean;
/**
 * Test if string is a Cairo short string (string has less or equal 31 characters)
 */
declare function isShortString(str: string): boolean;
/**
 * Test if string contains only numbers (string can be converted to decimal number)
 */
declare function isDecimalString(str: string): boolean;
/**
 * Test if value is a free-from string text, and not a hex string or number string
 */
declare function isText(val: any): boolean;
/**
 * Test if value is short text
 */
declare const isShortText: (val: any) => boolean;
/**
 * Test if value is long text
 */
declare const isLongText: (val: any) => boolean;
/**
 * Split long text into short strings
 */
declare function splitLongString(longStr: string): string[];
/**
 * Convert an ASCII string to a hexadecimal string.
 * @param str short string (ASCII string, 31 characters max)
 * @returns format: hex-string; 248 bits max
 * @example
 * ```typescript
 * const myEncodedString: string = encodeShortString("uri/pict/t38.jpg");
 * // return hex string (ex."0x7572692f706963742f7433382e6a7067")
 * ```
 */
declare function encodeShortString(str: string): string;
/**
 * Convert a hexadecimal or decimal string to an ASCII string.
 * @param str representing a 248 bit max number (ex. "0x1A4F64EA56" or "236942575435676423")
 * @returns format: short string; 31 characters max
 * @example
 * ```typescript
 * const myDecodedString: string = decodeShortString("0x7572692f706963742f7433382e6a7067");
 * // return string (ex."uri/pict/t38.jpg")
 * ```
 */
declare function decodeShortString(str: string): string;

declare const shortString_decodeShortString: typeof decodeShortString;
declare const shortString_encodeShortString: typeof encodeShortString;
declare const shortString_isASCII: typeof isASCII;
declare const shortString_isDecimalString: typeof isDecimalString;
declare const shortString_isLongText: typeof isLongText;
declare const shortString_isShortString: typeof isShortString;
declare const shortString_isShortText: typeof isShortText;
declare const shortString_isText: typeof isText;
declare const shortString_splitLongString: typeof splitLongString;
declare namespace shortString {
  export {
    shortString_decodeShortString as decodeShortString,
    shortString_encodeShortString as encodeShortString,
    shortString_isASCII as isASCII,
    shortString_isDecimalString as isDecimalString,
    shortString_isLongText as isLongText,
    shortString_isShortString as isShortString,
    shortString_isShortText as isShortText,
    shortString_isText as isText,
    shortString_splitLongString as splitLongString,
  };
}

declare function prepareSelector(selector: string): string;
declare function isMerkleTreeType(type: StarkNetType): type is StarkNetMerkleType;
interface Context {
    parent?: string;
    key?: string;
}
/**
 * Get the dependencies of a struct type. If a struct has the same dependency multiple times, it's only included once
 * in the resulting array.
 *
 * @param {TypedData} typedData
 * @param {string} type
 * @param {string[]} [dependencies]
 * @return {string[]}
 */
declare const getDependencies: (types: TypedData['types'], type: string, dependencies?: string[]) => string[];
/**
 * Encode a type to a string. All dependant types are alphabetically sorted.
 */
declare const encodeType: (types: TypedData['types'], type: string) => string;
/**
 * Get a type string as hash.
 */
declare const getTypeHash: (types: TypedData['types'], type: string) => string;
/**
 * Encodes a single value to an ABI serialisable string, number or Buffer. Returns the data as tuple, which consists of
 * an array of ABI compatible types, and an array of corresponding values.
 */
declare const encodeValue: (types: TypedData['types'], type: string, data: unknown, ctx?: Context) => [string, string];
/**
 * Encode the data to an ABI encoded Buffer. The data should be a key -> value object with all the required values. All
 * dependant types are automatically encoded.
 */
declare const encodeData: <T extends TypedData>(types: T["types"], type: string, data: T["message"]) => string[][];
/**
 * Get encoded data as a hash. The data should be a key -> value object with all the required values. All dependant
 * types are automatically encoded.
 */
declare const getStructHash: <T extends TypedData>(types: T["types"], type: string, data: T["message"]) => string;
/**
 * Get the EIP-191 encoded message to sign, from the typedData object.
 */
declare const getMessageHash: (typedData: TypedData, account: BigNumberish) => string;

type typedData_StarkNetDomain = StarkNetDomain;
type typedData_StarkNetMerkleType = StarkNetMerkleType;
type typedData_StarkNetType = StarkNetType;
type typedData_TypedData = TypedData;
declare const typedData_encodeData: typeof encodeData;
declare const typedData_encodeType: typeof encodeType;
declare const typedData_encodeValue: typeof encodeValue;
declare const typedData_getDependencies: typeof getDependencies;
declare const typedData_getMessageHash: typeof getMessageHash;
declare const typedData_getStructHash: typeof getStructHash;
declare const typedData_getTypeHash: typeof getTypeHash;
declare const typedData_isMerkleTreeType: typeof isMerkleTreeType;
declare const typedData_prepareSelector: typeof prepareSelector;
declare namespace typedData {
  export {
    typedData_StarkNetDomain as StarkNetDomain,
    typedData_StarkNetMerkleType as StarkNetMerkleType,
    typedData_StarkNetType as StarkNetType,
    typedData_TypedData as TypedData,
    typedData_encodeData as encodeData,
    typedData_encodeType as encodeType,
    typedData_encodeValue as encodeValue,
    typedData_getDependencies as getDependencies,
    typedData_getMessageHash as getMessageHash,
    typedData_getStructHash as getStructHash,
    typedData_getTypeHash as getTypeHash,
    typedData_isMerkleTreeType as isMerkleTreeType,
    typedData_prepareSelector as prepareSelector,
  };
}

declare function useDecoded(encoded: bigint[]): string;
declare function useEncoded(decoded: string): bigint;
declare const enum StarknetIdContract {
    MAINNET = "0x6ac597f8116f886fa1c97a23fa4e08299975ecaf6b598873ca6792b9bbfb678",
    TESTNET = "0x3bab268e932d2cecd1946f100ae67ce3dff9fd234119ea2f6da57d16d29fce"
}
declare function getStarknetIdContract(chainId: StarknetChainId): string;

type starknetId_StarknetIdContract = StarknetIdContract;
declare const starknetId_StarknetIdContract: typeof StarknetIdContract;
declare const starknetId_getStarknetIdContract: typeof getStarknetIdContract;
declare const starknetId_useDecoded: typeof useDecoded;
declare const starknetId_useEncoded: typeof useEncoded;
declare namespace starknetId {
  export {
    starknetId_StarknetIdContract as StarknetIdContract,
    starknetId_getStarknetIdContract as getStarknetIdContract,
    starknetId_useDecoded as useDecoded,
    starknetId_useEncoded as useEncoded,
  };
}

/**
 * Helper - Async Sleep for 'delay' time
 */
declare function wait(delay: number): Promise<unknown>;
/**
 * Create Sierra Contract Class from a given Compiled Sierra
 *
 * CompiledSierra -> SierraContractClass
 */
declare function createSierraContractClass(contract: CompiledSierra): SierraContractClass;
/**
 * Create Contract Class from a given CompiledContract or string
 *
 * (CompiledContract or string) -> ContractClass
 */
declare function parseContract(contract: CompiledContract | string): ContractClass$1;

declare const provider_createSierraContractClass: typeof createSierraContractClass;
declare const provider_parseContract: typeof parseContract;
declare const provider_wait: typeof wait;
declare namespace provider {
  export {
    provider_createSierraContractClass as createSierraContractClass,
    provider_parseContract as parseContract,
    provider_wait as wait,
  };
}

declare function getAbiEvents(abi: Abi): AbiEvents;
/**
 * Parse raw events and structure them into response object based on a contract structs and defined events
 * @param providerReceivedEvents ProviderEvent[] - Array of raw events
 * @param abiEvents AbiEvents - Events defined in the abi
 * @param abiStructs AbiStructs - Structs defined in the abi
 * @return ParsedEvents - parsed events corresponding to the abi
 */
declare function parseEvents(providerReceivedEvents: Array<Event>, abiEvents: AbiEvents, abiStructs: AbiStructs, abiEnums: AbiEnums): ParsedEvents;

declare const index_getAbiEvents: typeof getAbiEvents;
declare const index_parseEvents: typeof parseEvents;
declare namespace index {
  export {
    index_getAbiEvents as getAbiEvents,
    index_parseEvents as parseEvents,
  };
}

declare function addAddressPadding(address: BigNumberish): string;
declare function validateAndParseAddress(address: BigNumberish): string;
declare function getChecksumAddress(address: BigNumberish): string;
declare function validateChecksumAddress(address: string): boolean;

/**
 * Loosely validate a URL `string`.
 */
declare function isUrl(s?: string): boolean;
declare function buildUrl(baseUrl: string, defaultPath: string, urlOrPath?: string): string;

declare abstract class AbiParserInterface {
    /**
     * Helper to calculate inputs length from abi
     * @param abiMethod FunctionAbi
     * @return number
     */
    abstract methodInputsLength(abiMethod: FunctionAbi): number;
    /**
     *
     * @param name string
     * @return FunctionAbi | undefined
     */
    abstract getMethod(name: string): FunctionAbi | undefined;
    /**
     * Return Abi in legacy format
     * @return Abi
     */
    abstract getLegacyFormat(): Abi;
}

declare const isLen: (name: string) => boolean;
declare const isTypeFelt: (type: string) => boolean;
declare const isTypeArray: (type: string) => boolean;
declare const isTypeTuple: (type: string) => boolean;
declare const isTypeNamedTuple: (type: string) => boolean;
declare const isTypeStruct: (type: string, structs: AbiStructs) => boolean;
declare const isTypeEnum: (type: string, enums: AbiEnums) => boolean;
declare const isTypeOption: (type: string) => boolean;
declare const isTypeResult: (type: string) => boolean;
declare const isTypeUint: (type: string) => boolean;
declare const isTypeLitteral: (type: string) => boolean;
declare const isTypeUint256: (type: string) => boolean;
declare const isTypeBool: (type: string) => boolean;
declare const isTypeContractAddress: (type: string) => boolean;
declare const isTypeEthAddress: (type: string) => boolean;
declare const isCairo1Type: (type: string) => boolean;
declare const getArrayType: (type: string) => string;
/**
 * Test if an ABI comes from a Cairo 1 contract
 * @param abi representing the interface of a Cairo contract
 * @returns TRUE if it is an ABI from a Cairo1 contract
 * @example
 * ```typescript
 * const isCairo1: boolean = isCairo1Abi(myAbi: Abi);
 * ```
 */
declare function isCairo1Abi(abi: Abi): boolean;
/**
 * named tuple cairo type is described as js object {}
 * struct cairo type are described as js object {}
 * array cairo type are described as js array []
 */
/**
 * Create Uint256 Cairo type (helper for common struct type)
 * @example
 * ```typescript
 * uint256('892349863487563453485768723498');
 * ```
 */
declare const uint256: (it: BigNumberish) => Uint256;
/**
 * Create unnamed tuple Cairo type (helper same as common struct type)
 * @example
 * ```typescript
 * tuple(1,'0x101',16);
 * ```
 */
declare const tuple: (...args: (BigNumberish | object | boolean)[]) => Record<number, BigNumberish | object | boolean>;
/**
 * Create felt Cairo type (cairo type helper)
 * @returns format: felt-string
 */
declare function felt(it: BigNumberish): string;

declare const cairo_felt: typeof felt;
declare const cairo_getArrayType: typeof getArrayType;
declare const cairo_isCairo1Abi: typeof isCairo1Abi;
declare const cairo_isCairo1Type: typeof isCairo1Type;
declare const cairo_isLen: typeof isLen;
declare const cairo_isTypeArray: typeof isTypeArray;
declare const cairo_isTypeBool: typeof isTypeBool;
declare const cairo_isTypeContractAddress: typeof isTypeContractAddress;
declare const cairo_isTypeEnum: typeof isTypeEnum;
declare const cairo_isTypeEthAddress: typeof isTypeEthAddress;
declare const cairo_isTypeFelt: typeof isTypeFelt;
declare const cairo_isTypeLitteral: typeof isTypeLitteral;
declare const cairo_isTypeNamedTuple: typeof isTypeNamedTuple;
declare const cairo_isTypeOption: typeof isTypeOption;
declare const cairo_isTypeResult: typeof isTypeResult;
declare const cairo_isTypeStruct: typeof isTypeStruct;
declare const cairo_isTypeTuple: typeof isTypeTuple;
declare const cairo_isTypeUint: typeof isTypeUint;
declare const cairo_isTypeUint256: typeof isTypeUint256;
declare const cairo_tuple: typeof tuple;
declare const cairo_uint256: typeof uint256;
declare namespace cairo {
  export {
    cairo_felt as felt,
    cairo_getArrayType as getArrayType,
    cairo_isCairo1Abi as isCairo1Abi,
    cairo_isCairo1Type as isCairo1Type,
    cairo_isLen as isLen,
    cairo_isTypeArray as isTypeArray,
    cairo_isTypeBool as isTypeBool,
    cairo_isTypeContractAddress as isTypeContractAddress,
    cairo_isTypeEnum as isTypeEnum,
    cairo_isTypeEthAddress as isTypeEthAddress,
    cairo_isTypeFelt as isTypeFelt,
    cairo_isTypeLitteral as isTypeLitteral,
    cairo_isTypeNamedTuple as isTypeNamedTuple,
    cairo_isTypeOption as isTypeOption,
    cairo_isTypeResult as isTypeResult,
    cairo_isTypeStruct as isTypeStruct,
    cairo_isTypeTuple as isTypeTuple,
    cairo_isTypeUint as isTypeUint,
    cairo_isTypeUint256 as isTypeUint256,
    cairo_tuple as tuple,
    cairo_uint256 as uint256,
  };
}

declare class CallData {
    abi: Abi;
    parser: AbiParserInterface;
    protected readonly structs: AbiStructs;
    protected readonly enums: AbiEnums;
    constructor(abi: Abi);
    /**
     * Validate arguments passed to the method as corresponding to the ones in the abi
     * @param type ValidateType - type of the method
     * @param method string - name of the method
     * @param args ArgsOrCalldata - arguments that are passed to the method
     */
    validate(type: ValidateType, method: string, args?: ArgsOrCalldata): void;
    /**
     * Compile contract callData with abi
     * Parse the calldata by using input fields from the abi for that method
     * @param method string - method name
     * @param args RawArgs - arguments passed to the method. Can be an array of arguments (in the order of abi definition), or an object constructed in conformity with abi (in this case, the parameter can be in a wrong order).
     * @return Calldata - parsed arguments in format that contract is expecting
     * @example
     * ```typescript
     * const calldata = myCallData.compile("constructor",["0x34a",[1,3n]]);
     * ```
     * ```typescript
     * const calldata2 = myCallData.compile("constructor",{list:[1,3n],balance:"0x34"}); // wrong order is valid
     * ```
     */
    compile(method: string, argsCalldata: RawArgs): Calldata;
    /**
     * Compile contract callData without abi
     * @param rawArgs RawArgs representing cairo method arguments or string array of compiled data
     * @returns Calldata
     */
    static compile(rawArgs: RawArgs): Calldata;
    /**
     * Parse elements of the response array and structuring them into response object
     * @param method string - method name
     * @param response string[] - response from the method
     * @return Result - parsed response corresponding to the abi
     */
    parse(method: string, response: string[]): Result;
    /**
     * Format cairo method response data to native js values based on provided format schema
     * @param method string - cairo method name
     * @param response string[] - cairo method response
     * @param format object - formatter object schema
     * @returns Result - parsed and formatted response object
     */
    format(method: string, response: string[], format: object): Result;
    /**
     * Helper to extract structs from abi
     * @param abi Abi
     * @returns AbiStructs - structs from abi
     */
    static getAbiStruct(abi: Abi): AbiStructs;
    /**
     * Helper to extract enums from abi
     * @param abi Abi
     * @returns AbiEnums - enums from abi
     */
    static getAbiEnum(abi: Abi): AbiEnums;
    /**
     * Helper: Compile HexCalldata | RawCalldata | RawArgs
     * @param rawCalldata HexCalldata | RawCalldata | RawArgs
     * @returns Calldata
     */
    static toCalldata(rawCalldata?: RawArgs): Calldata;
    /**
     * Helper: Convert raw to HexCalldata
     * @param raw HexCalldata | RawCalldata | RawArgs
     * @returns HexCalldata
     */
    static toHex(raw?: RawArgs): HexCalldata;
}

declare function isSierra(contract: CairoContract | string): contract is SierraContractClass | CompiledSierra;
declare function extractContractHashes(payload: DeclareContractPayload): CompleteDeclareContractPayload;
/**
 * Helper to redeclare response Cairo0 contract
 */
declare function contractClassResponseToLegacyCompiledContract(ccr: ContractClassResponse): LegacyCompiledContract;

/**
 * Parse Transaction Receipt Event from UDC invoke transaction and
 * create DeployContractResponse compatible response with addition of the UDC Event data
 *
 * @returns DeployContractResponse | UDC Event Response data
 */
declare function parseUDCEvent(txReceipt: InvokeTransactionReceiptResponse): {
    transaction_hash: string;
    contract_address: any;
    address: any;
    deployer: any;
    unique: any;
    classHash: any;
    calldata_len: any;
    calldata: any;
    salt: any;
};

/**
 * Main
 */

/** @deprecated prefer the 'num' naming */
declare const number: typeof num;

export { Abi, AbiEntry, AbiEnums, AbiEvents, AbiStructs, Account, AccountInterface, AccountInvocationItem, AccountInvocations, AccountInvocationsFactoryDetails, AllowArray, Args, ArgsOrCalldata, ArgsOrCalldataWithOptions, ArraySignatureType, AsyncContractFunction, BigNumberish, BlockIdentifier, BlockNumber, BlockStatus, BlockTag, Builtins, ByteCode, Cairo1Event, CairoAssembly, CairoContract, CairoCustomEnum, CairoEnum, CairoEnumRaw, CairoOption, CairoOptionVariant, CairoResult, CairoResultVariant, CairoVersion, Call, CallContractResponse, CallData, CallDetails, CallL1Handler, CallOptions, CallStruct, Calldata, CommonTransactionResponse, CompiledContract, CompiledSierra, CompiledSierraCasm, CompleteDeclareContractPayload, CompressedProgram, Contract, ContractClass$1 as ContractClass, ContractClassResponse, ContractEntryPoint, ContractEntryPointFields, ContractFactory, ContractFactoryParams, ContractFunction, ContractInterface, ContractOptions, CustomError, DeclareAndDeployContractPayload, DeclareContractPayload, DeclareContractResponse, DeclareContractTransaction, DeclareDeployUDCResponse, DeclareSignerDetails, DeclareTransactionReceiptResponse, DeclareTransactionResponse, DeployAccountContractPayload, DeployAccountContractTransaction, DeployAccountSignerDetails, DeployContractResponse, DeployContractUDCResponse, DeployTransactionReceiptResponse, DeployedContractItem, Details, EntryPointType, EntryPointsByType, EnumAbi, EstimateFee, EstimateFeeAction, EstimateFeeBulk, EstimateFeeDetails, EstimateFeeResponse, EstimateFeeResponseBulk, Event, EventAbi, EventEntry, ExecutionResources, FunctionAbi, FunctionInvocation, GatewayError, GetBlockResponse, GetCodeResponse, GetContractAddressesResponse, GetTransactionReceiptResponse, GetTransactionResponse, GetTransactionStatusResponse, HexCalldata, HttpError, Invocation, Invocations, InvocationsDetails, InvocationsDetailsWithNonce, InvocationsSignerDetails, InvokeFunctionResponse, InvokeOptions, InvokeTransactionReceiptResponse, InvokeTransactionResponse, LegacyCompiledContract, LegacyContractClass, LegacyEvent, LibraryError, Litteral, MessageToL1, MessageToL2, MultiDeployContractResponse, MultiType, Nonce, OptionalPayload, ParsedEvent, ParsedEvents, ParsedStruct, Program, Provider, ProviderInterface, ProviderOptions, PythonicHints, rpc as RPC, RawArgs, RawArgsArray, RawArgsObject, RawCalldata, RejectedTransactionReceiptResponse, RejectedTransactionResponse, Result, RevertedTransactionReceiptResponse, RpcProvider, RpcProviderOptions, SIMULATION_FLAG, sequencer as Sequencer, SequencerHttpMethod, SequencerIdentifier, SequencerProvider, SequencerProviderOptions, SierraContractClass, SierraContractEntryPointFields, SierraEntryPointsByType, SierraProgramDebugInfo, Signature, Signer, SignerInterface, SimulateTransactionDetails, SimulateTransactionResponse, SimulatedTransaction, SimulationFlags, StarkNetDomain, StarkNetMerkleType, StarkNetType, StateUpdateResponse, Storage, StructAbi, SuccessfulTransactionReceiptResponse, TransactionExecutionStatus$1 as TransactionExecutionStatus, TransactionFinalityStatus$1 as TransactionFinalityStatus, TransactionStatus, TransactionType$1 as TransactionType, Tupled, TypedContract, TypedData, Uint, Uint256, UniversalDeployerContractPayload, ValidateType, WeierstrassSignatureType, addAddressPadding, buildUrl, cairo, constants, contractClassResponseToLegacyCompiledContract, defaultProvider, ec, encode, index as events, extractContractHashes, fixProto, fixStack, getCalldata, getChecksumAddress, getEstimateFeeBulkOptions, getSimulateTransactionOptions, hash, isSierra, isUrl, json, merkle, num, number, parseUDCEvent, provider, selector, shortString, splitArgsAndOptions, stark, starknetId, transaction, typedData, index$1 as types, uint256$1 as uint256, validateAndParseAddress, validateChecksumAddress, waitForTransactionOptions };
