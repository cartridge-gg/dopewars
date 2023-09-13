"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Account: () => Account,
  AccountInterface: () => AccountInterface,
  BlockStatus: () => BlockStatus,
  BlockTag: () => BlockTag,
  CairoCustomEnum: () => CairoCustomEnum,
  CairoOption: () => CairoOption,
  CairoOptionVariant: () => CairoOptionVariant,
  CairoResult: () => CairoResult,
  CairoResultVariant: () => CairoResultVariant,
  CallData: () => CallData,
  Contract: () => Contract,
  ContractFactory: () => ContractFactory,
  ContractInterface: () => ContractInterface,
  CustomError: () => CustomError,
  EntryPointType: () => EntryPointType,
  GatewayError: () => GatewayError,
  HttpError: () => HttpError,
  LibraryError: () => LibraryError,
  Litteral: () => Litteral,
  Provider: () => Provider,
  ProviderInterface: () => ProviderInterface,
  RPC: () => rpc_exports,
  RpcProvider: () => RpcProvider,
  SIMULATION_FLAG: () => SIMULATION_FLAG,
  Sequencer: () => sequencer_exports,
  SequencerProvider: () => SequencerProvider,
  Signer: () => Signer,
  SignerInterface: () => SignerInterface,
  TransactionExecutionStatus: () => TransactionExecutionStatus,
  TransactionFinalityStatus: () => TransactionFinalityStatus,
  TransactionStatus: () => TransactionStatus,
  TransactionType: () => TransactionType,
  Uint: () => Uint,
  ValidateType: () => ValidateType,
  addAddressPadding: () => addAddressPadding,
  buildUrl: () => buildUrl,
  cairo: () => cairo_exports,
  constants: () => constants_exports,
  contractClassResponseToLegacyCompiledContract: () => contractClassResponseToLegacyCompiledContract,
  defaultProvider: () => defaultProvider,
  ec: () => ec_exports,
  encode: () => encode_exports,
  events: () => events_exports,
  extractContractHashes: () => extractContractHashes,
  fixProto: () => fixProto,
  fixStack: () => fixStack,
  getCalldata: () => getCalldata,
  getChecksumAddress: () => getChecksumAddress,
  hash: () => hash_exports,
  isSierra: () => isSierra,
  isUrl: () => isUrl,
  json: () => json_exports,
  merkle: () => merkle_exports,
  num: () => num_exports,
  number: () => number,
  parseUDCEvent: () => parseUDCEvent,
  provider: () => provider_exports,
  selector: () => selector_exports,
  shortString: () => shortString_exports,
  splitArgsAndOptions: () => splitArgsAndOptions,
  stark: () => stark_exports,
  starknetId: () => starknetId_exports,
  transaction: () => transaction_exports,
  typedData: () => typedData_exports,
  types: () => types_exports,
  uint256: () => uint256_exports,
  validateAndParseAddress: () => validateAndParseAddress,
  validateChecksumAddress: () => validateChecksumAddress
});
module.exports = __toCommonJS(src_exports);

// src/constants.ts
var constants_exports = {};
__export(constants_exports, {
  API_VERSION: () => API_VERSION,
  BN_FEE_TRANSACTION_VERSION_1: () => BN_FEE_TRANSACTION_VERSION_1,
  BN_FEE_TRANSACTION_VERSION_2: () => BN_FEE_TRANSACTION_VERSION_2,
  BN_TRANSACTION_VERSION_1: () => BN_TRANSACTION_VERSION_1,
  BN_TRANSACTION_VERSION_2: () => BN_TRANSACTION_VERSION_2,
  BaseUrl: () => BaseUrl,
  HEX_STR_TRANSACTION_VERSION_1: () => HEX_STR_TRANSACTION_VERSION_1,
  HEX_STR_TRANSACTION_VERSION_2: () => HEX_STR_TRANSACTION_VERSION_2,
  IS_BROWSER: () => IS_BROWSER,
  MASK_250: () => MASK_250,
  MASK_251: () => MASK_251,
  NetworkName: () => NetworkName,
  StarknetChainId: () => StarknetChainId,
  TEXT_TO_FELT_MAX_LEN: () => TEXT_TO_FELT_MAX_LEN,
  TransactionHashPrefix: () => TransactionHashPrefix,
  UDC: () => UDC,
  ZERO: () => ZERO
});

// src/utils/encode.ts
var encode_exports = {};
__export(encode_exports, {
  IS_BROWSER: () => IS_BROWSER,
  addHexPrefix: () => addHexPrefix,
  arrayBufferToString: () => arrayBufferToString,
  atobUniversal: () => atobUniversal,
  btoaUniversal: () => btoaUniversal,
  buf2hex: () => buf2hex,
  calcByteLength: () => calcByteLength,
  padLeft: () => padLeft,
  pascalToSnake: () => pascalToSnake,
  removeHexPrefix: () => removeHexPrefix,
  sanitizeBytes: () => sanitizeBytes,
  sanitizeHex: () => sanitizeHex,
  stringToArrayBuffer: () => stringToArrayBuffer,
  utf8ToArray: () => utf8ToArray
});
var IS_BROWSER = typeof window !== "undefined";
var STRING_ZERO = "0";
function arrayBufferToString(array) {
  return new Uint8Array(array).reduce((data, byte) => data + String.fromCharCode(byte), "");
}
function stringToArrayBuffer(s) {
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
}
function atobUniversal(a) {
  return IS_BROWSER ? stringToArrayBuffer(atob(a)) : Buffer.from(a, "base64");
}
function btoaUniversal(b) {
  return IS_BROWSER ? btoa(arrayBufferToString(b)) : Buffer.from(b).toString("base64");
}
function buf2hex(buffer) {
  return [...buffer].map((x) => x.toString(16).padStart(2, "0")).join("");
}
function removeHexPrefix(hex) {
  return hex.replace(/^0x/i, "");
}
function addHexPrefix(hex) {
  return `0x${removeHexPrefix(hex)}`;
}
function padString(str, length, left, padding = STRING_ZERO) {
  const diff = length - str.length;
  let result = str;
  if (diff > 0) {
    const pad = padding.repeat(diff);
    result = left ? pad + str : str + pad;
  }
  return result;
}
function padLeft(str, length, padding = STRING_ZERO) {
  return padString(str, length, true, padding);
}
function calcByteLength(str, byteSize = 8) {
  const { length } = str;
  const remainder = length % byteSize;
  return remainder ? (length - remainder) / byteSize * byteSize + byteSize : length;
}
function sanitizeBytes(str, byteSize = 8, padding = STRING_ZERO) {
  return padLeft(str, calcByteLength(str, byteSize), padding);
}
function sanitizeHex(hex) {
  hex = removeHexPrefix(hex);
  hex = sanitizeBytes(hex, 2);
  if (hex) {
    hex = addHexPrefix(hex);
  }
  return hex;
}
function utf8ToArray(str) {
  return new TextEncoder().encode(str);
}
var pascalToSnake = (text) => /[a-z]/.test(text) ? text.split(/(?=[A-Z])/).join("_").toUpperCase() : text;

// src/constants.ts
var TEXT_TO_FELT_MAX_LEN = 31;
var HEX_STR_TRANSACTION_VERSION_1 = "0x1";
var HEX_STR_TRANSACTION_VERSION_2 = "0x2";
var BN_TRANSACTION_VERSION_1 = 1n;
var BN_TRANSACTION_VERSION_2 = 2n;
var BN_FEE_TRANSACTION_VERSION_1 = 2n ** 128n + BN_TRANSACTION_VERSION_1;
var BN_FEE_TRANSACTION_VERSION_2 = 2n ** 128n + BN_TRANSACTION_VERSION_2;
var ZERO = 0n;
var MASK_250 = 2n ** 250n - 1n;
var MASK_251 = 2n ** 251n;
var API_VERSION = ZERO;
var BaseUrl = /* @__PURE__ */ ((BaseUrl2) => {
  BaseUrl2["SN_MAIN"] = "https://alpha-mainnet.starknet.io";
  BaseUrl2["SN_GOERLI"] = "https://alpha4.starknet.io";
  BaseUrl2["SN_GOERLI2"] = "https://alpha4-2.starknet.io";
  return BaseUrl2;
})(BaseUrl || {});
var NetworkName = /* @__PURE__ */ ((NetworkName2) => {
  NetworkName2["SN_MAIN"] = "SN_MAIN";
  NetworkName2["SN_GOERLI"] = "SN_GOERLI";
  NetworkName2["SN_GOERLI2"] = "SN_GOERLI2";
  return NetworkName2;
})(NetworkName || {});
var StarknetChainId = /* @__PURE__ */ ((StarknetChainId4) => {
  StarknetChainId4["SN_MAIN"] = "0x534e5f4d41494e";
  StarknetChainId4["SN_GOERLI"] = "0x534e5f474f45524c49";
  StarknetChainId4["SN_GOERLI2"] = "0x534e5f474f45524c4932";
  return StarknetChainId4;
})(StarknetChainId || {});
var TransactionHashPrefix = /* @__PURE__ */ ((TransactionHashPrefix2) => {
  TransactionHashPrefix2["DECLARE"] = "0x6465636c617265";
  TransactionHashPrefix2["DEPLOY"] = "0x6465706c6f79";
  TransactionHashPrefix2["DEPLOY_ACCOUNT"] = "0x6465706c6f795f6163636f756e74";
  TransactionHashPrefix2["INVOKE"] = "0x696e766f6b65";
  TransactionHashPrefix2["L1_HANDLER"] = "0x6c315f68616e646c6572";
  return TransactionHashPrefix2;
})(TransactionHashPrefix || {});
var UDC = {
  ADDRESS: "0x041a78e741e5af2fec34b695679bc6891742439f7afb8484ecd7766661ad02bf",
  ENTRYPOINT: "deployContract"
};

// src/types/index.ts
var types_exports = {};
__export(types_exports, {
  BlockStatus: () => BlockStatus,
  BlockTag: () => BlockTag,
  EntryPointType: () => EntryPointType,
  Litteral: () => Litteral,
  RPC: () => rpc_exports,
  SIMULATION_FLAG: () => SIMULATION_FLAG,
  Sequencer: () => sequencer_exports,
  TransactionExecutionStatus: () => TransactionExecutionStatus,
  TransactionFinalityStatus: () => TransactionFinalityStatus,
  TransactionStatus: () => TransactionStatus,
  TransactionType: () => TransactionType,
  Uint: () => Uint,
  ValidateType: () => ValidateType
});

// src/types/account.ts
var SIMULATION_FLAG = /* @__PURE__ */ ((SIMULATION_FLAG3) => {
  SIMULATION_FLAG3["SKIP_VALIDATE"] = "SKIP_VALIDATE";
  SIMULATION_FLAG3["SKIP_EXECUTE"] = "SKIP_EXECUTE";
  return SIMULATION_FLAG3;
})(SIMULATION_FLAG || {});

// src/types/calldata.ts
var ValidateType = /* @__PURE__ */ ((ValidateType2) => {
  ValidateType2["DEPLOY"] = "DEPLOY";
  ValidateType2["CALL"] = "CALL";
  ValidateType2["INVOKE"] = "INVOKE";
  return ValidateType2;
})(ValidateType || {});
var Uint = /* @__PURE__ */ ((Uint2) => {
  Uint2["u8"] = "core::integer::u8";
  Uint2["u16"] = "core::integer::u16";
  Uint2["u32"] = "core::integer::u32";
  Uint2["u64"] = "core::integer::u64";
  Uint2["u128"] = "core::integer::u128";
  Uint2["u256"] = "core::integer::u256";
  return Uint2;
})(Uint || {});
var Litteral = /* @__PURE__ */ ((Litteral2) => {
  Litteral2["ClassHash"] = "core::starknet::class_hash::ClassHash";
  Litteral2["ContractAddress"] = "core::starknet::contract_address::ContractAddress";
  return Litteral2;
})(Litteral || {});

// src/types/lib/contract/index.ts
var EntryPointType = /* @__PURE__ */ ((EntryPointType2) => {
  EntryPointType2["EXTERNAL"] = "EXTERNAL";
  EntryPointType2["L1_HANDLER"] = "L1_HANDLER";
  EntryPointType2["CONSTRUCTOR"] = "CONSTRUCTOR";
  return EntryPointType2;
})(EntryPointType || {});

// src/types/lib/index.ts
var TransactionType = /* @__PURE__ */ ((TransactionType3) => {
  TransactionType3["DECLARE"] = "DECLARE";
  TransactionType3["DEPLOY"] = "DEPLOY";
  TransactionType3["DEPLOY_ACCOUNT"] = "DEPLOY_ACCOUNT";
  TransactionType3["INVOKE"] = "INVOKE_FUNCTION";
  return TransactionType3;
})(TransactionType || {});
var TransactionStatus = /* @__PURE__ */ ((TransactionStatus2) => {
  TransactionStatus2["NOT_RECEIVED"] = "NOT_RECEIVED";
  TransactionStatus2["RECEIVED"] = "RECEIVED";
  TransactionStatus2["ACCEPTED_ON_L2"] = "ACCEPTED_ON_L2";
  TransactionStatus2["ACCEPTED_ON_L1"] = "ACCEPTED_ON_L1";
  TransactionStatus2["REJECTED"] = "REJECTED";
  TransactionStatus2["REVERTED"] = "REVERTED";
  return TransactionStatus2;
})(TransactionStatus || {});
var TransactionFinalityStatus = /* @__PURE__ */ ((TransactionFinalityStatus3) => {
  TransactionFinalityStatus3["NOT_RECEIVED"] = "NOT_RECEIVED";
  TransactionFinalityStatus3["RECEIVED"] = "RECEIVED";
  TransactionFinalityStatus3["ACCEPTED_ON_L2"] = "ACCEPTED_ON_L2";
  TransactionFinalityStatus3["ACCEPTED_ON_L1"] = "ACCEPTED_ON_L1";
  return TransactionFinalityStatus3;
})(TransactionFinalityStatus || {});
var TransactionExecutionStatus = /* @__PURE__ */ ((TransactionExecutionStatus3) => {
  TransactionExecutionStatus3["REJECTED"] = "REJECTED";
  TransactionExecutionStatus3["REVERTED"] = "REVERTED";
  TransactionExecutionStatus3["SUCCEEDED"] = "SUCCEEDED";
  return TransactionExecutionStatus3;
})(TransactionExecutionStatus || {});
var BlockStatus = /* @__PURE__ */ ((BlockStatus2) => {
  BlockStatus2["PENDING"] = "PENDING";
  BlockStatus2["ACCEPTED_ON_L1"] = "ACCEPTED_ON_L1";
  BlockStatus2["ACCEPTED_ON_L2"] = "ACCEPTED_ON_L2";
  BlockStatus2["REJECTED"] = "REJECTED";
  return BlockStatus2;
})(BlockStatus || {});
var BlockTag = /* @__PURE__ */ ((BlockTag2) => {
  BlockTag2["pending"] = "pending";
  BlockTag2["latest"] = "latest";
  return BlockTag2;
})(BlockTag || {});

// src/types/api/rpc.ts
var rpc_exports = {};
__export(rpc_exports, {
  SimulationFlag: () => SimulationFlag,
  TransactionExecutionStatus: () => TransactionExecutionStatus2,
  TransactionFinalityStatus: () => TransactionFinalityStatus2,
  TransactionType: () => TransactionType2
});

// src/types/api/openrpc.ts
var TXN_TYPE = /* @__PURE__ */ ((TXN_TYPE2) => {
  TXN_TYPE2["DECLARE"] = "DECLARE";
  TXN_TYPE2["DEPLOY"] = "DEPLOY";
  TXN_TYPE2["DEPLOY_ACCOUNT"] = "DEPLOY_ACCOUNT";
  TXN_TYPE2["INVOKE"] = "INVOKE";
  TXN_TYPE2["L1_HANDLER"] = "L1_HANDLER";
  return TXN_TYPE2;
})(TXN_TYPE || {});
var TXN_FINALITY_STATUS = /* @__PURE__ */ ((TXN_FINALITY_STATUS2) => {
  TXN_FINALITY_STATUS2["ACCEPTED_ON_L2"] = "ACCEPTED_ON_L2";
  TXN_FINALITY_STATUS2["ACCEPTED_ON_L1"] = "ACCEPTED_ON_L1";
  return TXN_FINALITY_STATUS2;
})(TXN_FINALITY_STATUS || {});
var TXN_EXECUTION_STATUS = /* @__PURE__ */ ((TXN_EXECUTION_STATUS2) => {
  TXN_EXECUTION_STATUS2["SUCCEEDED"] = "SUCCEEDED";
  TXN_EXECUTION_STATUS2["REVERTED"] = "REVERTED";
  return TXN_EXECUTION_STATUS2;
})(TXN_EXECUTION_STATUS || {});
var SIMULATION_FLAG2 = /* @__PURE__ */ ((SIMULATION_FLAG3) => {
  SIMULATION_FLAG3["SKIP_VALIDATE"] = "SKIP_VALIDATE";
  SIMULATION_FLAG3["SKIP_FEE_CHARGE"] = "SKIP_FEE_CHARGE";
  return SIMULATION_FLAG3;
})(SIMULATION_FLAG2 || {});

// src/types/api/rpc.ts
var TransactionType2 = TXN_TYPE;
var SimulationFlag = SIMULATION_FLAG2;
var TransactionFinalityStatus2 = TXN_FINALITY_STATUS;
var TransactionExecutionStatus2 = TXN_EXECUTION_STATUS;

// src/types/api/sequencer.ts
var sequencer_exports = {};

// src/utils/assert.ts
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failure");
  }
}

// src/utils/num.ts
var num_exports = {};
__export(num_exports, {
  assertInRange: () => assertInRange,
  bigNumberishArrayToDecimalStringArray: () => bigNumberishArrayToDecimalStringArray,
  bigNumberishArrayToHexadecimalStringArray: () => bigNumberishArrayToHexadecimalStringArray,
  cleanHex: () => cleanHex,
  getDecimalString: () => getDecimalString,
  getHexString: () => getHexString,
  getHexStringArray: () => getHexStringArray,
  hexToBytes: () => hexToBytes,
  hexToDecimalString: () => hexToDecimalString,
  isBigInt: () => isBigInt,
  isHex: () => isHex,
  isStringWholeNumber: () => isStringWholeNumber,
  toBigInt: () => toBigInt,
  toCairoBool: () => toCairoBool,
  toHex: () => toHex,
  toHexString: () => toHexString,
  toStorageKey: () => toStorageKey
});
var import_utils = require("@noble/curves/abstract/utils");
function isHex(hex) {
  return /^0x[0-9a-f]*$/i.test(hex);
}
function toBigInt(value) {
  return BigInt(value);
}
function isBigInt(value) {
  return typeof value === "bigint";
}
function toHex(number2) {
  return addHexPrefix(toBigInt(number2).toString(16));
}
var toHexString = toHex;
function toStorageKey(number2) {
  const res = addHexPrefix(toBigInt(number2).toString(16).padStart(64, "0"));
  return res;
}
function hexToDecimalString(hex) {
  return BigInt(addHexPrefix(hex)).toString(10);
}
var cleanHex = (hex) => hex.toLowerCase().replace(/^(0x)0+/, "$1");
function assertInRange(input, lowerBound, upperBound, inputName = "") {
  const messageSuffix = inputName === "" ? "invalid length" : `invalid ${inputName} length`;
  const inputBigInt = BigInt(input);
  const lowerBoundBigInt = BigInt(lowerBound);
  const upperBoundBigInt = BigInt(upperBound);
  assert(
    inputBigInt >= lowerBoundBigInt && inputBigInt <= upperBoundBigInt,
    `Message not signable, ${messageSuffix}.`
  );
}
function bigNumberishArrayToDecimalStringArray(rawCalldata) {
  return rawCalldata.map((x) => toBigInt(x).toString(10));
}
function bigNumberishArrayToHexadecimalStringArray(rawCalldata) {
  return rawCalldata.map((x) => toHex(x));
}
var isStringWholeNumber = (value) => /^\d+$/.test(value);
function getDecimalString(value) {
  if (isHex(value)) {
    return hexToDecimalString(value);
  }
  if (isStringWholeNumber(value)) {
    return value;
  }
  throw new Error(`${value} need to be hex-string or whole-number-string`);
}
function getHexString(value) {
  if (isHex(value)) {
    return value;
  }
  if (isStringWholeNumber(value)) {
    return toHexString(value);
  }
  throw new Error(`${value} need to be hex-string or whole-number-string`);
}
function getHexStringArray(value) {
  return value.map((el) => getHexString(el));
}
var toCairoBool = (value) => (+value).toString();
function hexToBytes(value) {
  if (!isHex(value))
    throw new Error(`${value} need to be a hex-string`);
  let adaptedValue = removeHexPrefix(value);
  if (adaptedValue.length % 2 !== 0) {
    adaptedValue = `0${adaptedValue}`;
  }
  return (0, import_utils.hexToBytes)(adaptedValue);
}

// src/utils/selector.ts
var selector_exports = {};
__export(selector_exports, {
  getSelector: () => getSelector,
  getSelectorFromName: () => getSelectorFromName,
  keccakBn: () => keccakBn,
  starknetKeccak: () => starknetKeccak
});
var import_starknet = require("@scure/starknet");
function keccakBn(value) {
  const hexWithoutPrefix = removeHexPrefix(toHex(BigInt(value)));
  const evenHex = hexWithoutPrefix.length % 2 === 0 ? hexWithoutPrefix : `0${hexWithoutPrefix}`;
  return addHexPrefix((0, import_starknet.keccak)(hexToBytes(addHexPrefix(evenHex))).toString(16));
}
function keccakHex(str) {
  return addHexPrefix((0, import_starknet.keccak)(utf8ToArray(str)).toString(16));
}
function starknetKeccak(str) {
  const hash = BigInt(keccakHex(str));
  return hash & MASK_250;
}
function getSelectorFromName(funcName) {
  return toHex(starknetKeccak(funcName));
}
function getSelector(value) {
  if (isHex(value)) {
    return value;
  }
  if (isStringWholeNumber(value)) {
    return toHexString(value);
  }
  return getSelectorFromName(value);
}

// src/utils/shortString.ts
var shortString_exports = {};
__export(shortString_exports, {
  decodeShortString: () => decodeShortString,
  encodeShortString: () => encodeShortString,
  isASCII: () => isASCII,
  isDecimalString: () => isDecimalString,
  isLongText: () => isLongText,
  isShortString: () => isShortString,
  isShortText: () => isShortText,
  isText: () => isText,
  splitLongString: () => splitLongString
});
function isASCII(str) {
  return /^[\x00-\x7F]*$/.test(str);
}
function isShortString(str) {
  return str.length <= TEXT_TO_FELT_MAX_LEN;
}
function isDecimalString(str) {
  return /^[0-9]*$/i.test(str);
}
function isText(val) {
  return typeof val === "string" && !isHex(val) && !isStringWholeNumber(val);
}
var isShortText = (val) => isText(val) && isShortString(val);
var isLongText = (val) => isText(val) && !isShortString(val);
function splitLongString(longStr) {
  const regex = RegExp(`[^]{1,${TEXT_TO_FELT_MAX_LEN}}`, "g");
  return longStr.match(regex) || [];
}
function encodeShortString(str) {
  if (!isASCII(str))
    throw new Error(`${str} is not an ASCII string`);
  if (!isShortString(str))
    throw new Error(`${str} is too long`);
  return addHexPrefix(str.replace(/./g, (char) => char.charCodeAt(0).toString(16)));
}
function decodeShortString(str) {
  if (!isASCII(str))
    throw new Error(`${str} is not an ASCII string`);
  if (isHex(str)) {
    return removeHexPrefix(str).replace(/.{2}/g, (hex) => String.fromCharCode(parseInt(hex, 16)));
  }
  if (isDecimalString(str)) {
    return decodeShortString("0X".concat(BigInt(str).toString(16)));
  }
  throw new Error(`${str} is not Hex or decimal`);
}

// src/utils/calldata/cairo.ts
var cairo_exports = {};
__export(cairo_exports, {
  felt: () => felt,
  getArrayType: () => getArrayType,
  isCairo1Abi: () => isCairo1Abi,
  isCairo1Type: () => isCairo1Type,
  isLen: () => isLen,
  isTypeArray: () => isTypeArray,
  isTypeBool: () => isTypeBool,
  isTypeContractAddress: () => isTypeContractAddress,
  isTypeEnum: () => isTypeEnum,
  isTypeEthAddress: () => isTypeEthAddress,
  isTypeFelt: () => isTypeFelt,
  isTypeLitteral: () => isTypeLitteral,
  isTypeNamedTuple: () => isTypeNamedTuple,
  isTypeOption: () => isTypeOption,
  isTypeResult: () => isTypeResult,
  isTypeStruct: () => isTypeStruct,
  isTypeTuple: () => isTypeTuple,
  isTypeUint: () => isTypeUint,
  isTypeUint256: () => isTypeUint256,
  tuple: () => tuple,
  uint256: () => uint256
});

// src/utils/uint256.ts
var uint256_exports = {};
__export(uint256_exports, {
  UINT_128_MAX: () => UINT_128_MAX,
  UINT_256_MAX: () => UINT_256_MAX,
  bnToUint256: () => bnToUint256,
  isUint256: () => isUint256,
  uint256ToBN: () => uint256ToBN
});
var UINT_128_MAX = (1n << 128n) - 1n;
var UINT_256_MAX = (1n << 256n) - 1n;
function uint256ToBN(uint2562) {
  return (toBigInt(uint2562.high) << 128n) + toBigInt(uint2562.low);
}
function isUint256(bn) {
  return toBigInt(bn) <= UINT_256_MAX;
}
function bnToUint256(bn) {
  const bi = toBigInt(bn);
  if (!isUint256(bi))
    throw new Error("Number is too large");
  return {
    low: addHexPrefix((bi & UINT_128_MAX).toString(16)),
    high: addHexPrefix((bi >> 128n).toString(16))
  };
}

// src/utils/calldata/cairo.ts
var isLen = (name) => /_len$/.test(name);
var isTypeFelt = (type) => type === "felt" || type === "core::felt252";
var isTypeArray = (type) => /\*/.test(type) || type.startsWith("core::array::Array::") || type.startsWith("core::array::Span::");
var isTypeTuple = (type) => /^\(.*\)$/i.test(type);
var isTypeNamedTuple = (type) => /\(.*\)/i.test(type) && type.includes(":");
var isTypeStruct = (type, structs) => type in structs;
var isTypeEnum = (type, enums) => type in enums;
var isTypeOption = (type) => type.startsWith("core::option::Option::");
var isTypeResult = (type) => type.startsWith("core::result::Result::");
var isTypeUint = (type) => Object.values(Uint).includes(type);
var isTypeLitteral = (type) => Object.values(Litteral).includes(type);
var isTypeUint256 = (type) => type === "core::integer::u256";
var isTypeBool = (type) => type === "core::bool";
var isTypeContractAddress = (type) => type === "core::starknet::contract_address::ContractAddress";
var isTypeEthAddress = (type) => type === "core::starknet::eth_address::EthAddress";
var isCairo1Type = (type) => type.includes("core::");
var getArrayType = (type) => {
  if (isCairo1Type(type)) {
    return type.substring(type.indexOf("<") + 1, type.lastIndexOf(">"));
  }
  return type.replace("*", "");
};
function isCairo1Abi(abi) {
  const firstFunction = abi.find((entry) => entry.type === "function");
  if (!firstFunction) {
    if (abi.find((it) => it.type === "interface")) {
      return true;
    }
    throw new Error(`Error in ABI. No function in ABI.`);
  }
  if (firstFunction.inputs.length) {
    return isCairo1Type(firstFunction.inputs[0].type);
  }
  if (firstFunction.outputs.length) {
    return isCairo1Type(firstFunction.outputs[0].type);
  }
  throw new Error(`Error in ABI. No input/output in function ${firstFunction.name}`);
}
var uint256 = (it) => {
  const bn = BigInt(it);
  if (!isUint256(bn))
    throw new Error("Number is too large");
  return {
    // eslint-disable-next-line no-bitwise
    low: (bn & UINT_128_MAX).toString(10),
    // eslint-disable-next-line no-bitwise
    high: (bn >> 128n).toString(10)
  };
};
var tuple = (...args) => ({ ...args });
function felt(it) {
  if (isBigInt(it) || typeof it === "number" && Number.isInteger(it)) {
    return it.toString();
  }
  if (isText(it)) {
    if (!isShortString(it))
      throw new Error(
        `${it} is a long string > 31 chars, felt can store short strings, split it to array of short strings`
      );
    const encoded = encodeShortString(it);
    return BigInt(encoded).toString();
  }
  if (typeof it === "string" && isHex(it)) {
    return BigInt(it).toString();
  }
  if (typeof it === "string" && isStringWholeNumber(it)) {
    return it;
  }
  if (typeof it === "boolean") {
    return `${+it}`;
  }
  throw new Error(`${it} can't be computed by felt()`);
}

// src/utils/calldata/enum/CairoCustomEnum.ts
var CairoCustomEnum = class {
  /**
   * @param enumContent an object with the variants as keys and the content as value. Only one content shall be defined.
   */
  constructor(enumContent) {
    const variantsList = Object.values(enumContent);
    if (variantsList.length === 0) {
      throw new Error("This Enum must have a least 1 variant");
    }
    const nbActiveVariants = variantsList.filter(
      (content) => typeof content !== "undefined"
    ).length;
    if (nbActiveVariants !== 1) {
      throw new Error("This Enum must have exactly one active variant");
    }
    this.variant = enumContent;
  }
  /**
   *
   * @returns the content of the valid variant of a Cairo custom Enum.
   */
  unwrap() {
    const variants = Object.entries(this.variant);
    const activeVariant = variants.find((item) => typeof item[1] !== "undefined");
    if (typeof activeVariant === "undefined") {
      return void 0;
    }
    return activeVariant[1];
  }
  /**
   *
   * @returns the name of the valid variant of a Cairo custom Enum.
   */
  activeVariant() {
    const variants = Object.entries(this.variant);
    const activeVariant = variants.find((item) => typeof item[1] !== "undefined");
    if (typeof activeVariant === "undefined") {
      return "";
    }
    return activeVariant[0];
  }
};

// src/utils/calldata/enum/CairoOption.ts
var CairoOptionVariant = /* @__PURE__ */ ((CairoOptionVariant2) => {
  CairoOptionVariant2[CairoOptionVariant2["Some"] = 0] = "Some";
  CairoOptionVariant2[CairoOptionVariant2["None"] = 1] = "None";
  return CairoOptionVariant2;
})(CairoOptionVariant || {});
var CairoOption = class {
  constructor(variant, someContent) {
    if (!(variant in CairoOptionVariant)) {
      throw new Error("Wrong variant : should be CairoOptionVariant.Some or .None.");
    }
    if (variant === 0 /* Some */) {
      if (typeof someContent === "undefined") {
        throw new Error(
          'The creation of a Cairo Option with "Some" variant needs a content as input.'
        );
      }
      this.Some = someContent;
      this.None = void 0;
    } else {
      this.Some = void 0;
      this.None = true;
    }
  }
  /**
   *
   * @returns the content of the valid variant of a Cairo custom Enum.
   *  If None, returns 'undefined'.
   */
  unwrap() {
    if (this.None) {
      return void 0;
    }
    return this.Some;
  }
  /**
   *
   * @returns true if the valid variant is 'isSome'.
   */
  isSome() {
    return !(typeof this.Some === "undefined");
  }
  /**
   *
   * @returns true if the valid variant is 'isNone'.
   */
  isNone() {
    return this.None === true;
  }
};

// src/utils/calldata/enum/CairoResult.ts
var CairoResultVariant = /* @__PURE__ */ ((CairoResultVariant2) => {
  CairoResultVariant2[CairoResultVariant2["Ok"] = 0] = "Ok";
  CairoResultVariant2[CairoResultVariant2["Err"] = 1] = "Err";
  return CairoResultVariant2;
})(CairoResultVariant || {});
var CairoResult = class {
  constructor(variant, resultContent) {
    if (!(variant in CairoResultVariant)) {
      throw new Error("Wrong variant : should be CairoResultVariant.Ok or .Err.");
    }
    if (variant === 0 /* Ok */) {
      this.Ok = resultContent;
      this.Err = void 0;
    } else {
      this.Ok = void 0;
      this.Err = resultContent;
    }
  }
  /**
   *
   * @returns the content of the valid variant of a Cairo Result.
   */
  unwrap() {
    if (typeof this.Ok !== "undefined") {
      return this.Ok;
    }
    if (typeof this.Err !== "undefined") {
      return this.Err;
    }
    throw new Error("Both Result.Ok and .Err are undefined. Not authorized.");
  }
  /**
   *
   * @returns true if the valid variant is 'Ok'.
   */
  isOk() {
    return !(typeof this.Ok === "undefined");
  }
  /**
   *
   * @returns true if the valid variant is 'isErr'.
   */
  isErr() {
    return !(typeof this.Err === "undefined");
  }
};

// src/utils/calldata/formatter.ts
var guard = {
  isBN: (data, type, key) => {
    if (!isBigInt(data[key]))
      throw new Error(
        `Data and formatter mismatch on ${key}:${type[key]}, expected response data ${key}:${data[key]} to be BN instead it is ${typeof data[key]}`
      );
  },
  unknown: (data, type, key) => {
    throw new Error(`Unhandled formatter type on ${key}:${type[key]} for data ${key}:${data[key]}`);
  }
};
function formatter(data, type, sameType) {
  return Object.entries(data).reduce((acc, [key, value]) => {
    const elType = sameType ?? type[key];
    if (!(key in type) && !sameType) {
      acc[key] = value;
      return acc;
    }
    if (elType === "string") {
      if (Array.isArray(data[key])) {
        const arrayStr = formatter(
          data[key],
          data[key].map((_) => elType)
        );
        acc[key] = Object.values(arrayStr).join("");
        return acc;
      }
      guard.isBN(data, type, key);
      acc[key] = decodeShortString(value);
      return acc;
    }
    if (elType === "number") {
      guard.isBN(data, type, key);
      acc[key] = Number(value);
      return acc;
    }
    if (typeof elType === "function") {
      acc[key] = elType(value);
      return acc;
    }
    if (Array.isArray(elType)) {
      const arrayObj = formatter(data[key], elType, elType[0]);
      acc[key] = Object.values(arrayObj);
      return acc;
    }
    if (typeof elType === "object") {
      acc[key] = formatter(data[key], elType);
      return acc;
    }
    guard.unknown(data, type, key);
    return acc;
  }, {});
}

// src/utils/calldata/parser/parser-0-1.1.0.ts
var AbiParser1 = class {
  constructor(abi) {
    this.abi = abi;
  }
  /**
   * abi method inputs length without '_len' inputs
   * cairo 0 reducer
   * @param abiMethod FunctionAbi
   * @returns number
   */
  methodInputsLength(abiMethod) {
    return abiMethod.inputs.reduce((acc, input) => !isLen(input.name) ? acc + 1 : acc, 0);
  }
  /**
   * get method definition from abi
   * @param name string
   * @returns FunctionAbi | undefined
   */
  getMethod(name) {
    return this.abi.find((it) => it.name === name);
  }
  /**
   * Get Abi in legacy format
   * @returns Abi
   */
  getLegacyFormat() {
    return this.abi;
  }
};

// src/utils/calldata/parser/parser-2.0.0.ts
var AbiParser2 = class {
  constructor(abi) {
    this.abi = abi;
  }
  /**
   * abi method inputs length
   * @param abiMethod FunctionAbi
   * @returns number
   */
  methodInputsLength(abiMethod) {
    return abiMethod.inputs.length;
  }
  /**
   * get method definition from abi
   * @param name string
   * @returns FunctionAbi | undefined
   */
  getMethod(name) {
    const intf = this.abi.find((it) => it.type === "interface");
    return intf.items.find((it) => it.name === name);
  }
  /**
   * Get Abi in legacy format
   * @returns Abi
   */
  getLegacyFormat() {
    return this.abi.flatMap((e) => {
      if (e.type === "interface") {
        return e.items;
      }
      return e;
    });
  }
};

// src/utils/calldata/parser/index.ts
function createAbiParser(abi) {
  const version = getAbiVersion(abi);
  if (version === 0 || version === 1) {
    return new AbiParser1(abi);
  }
  if (version === 2) {
    return new AbiParser2(abi);
  }
  throw Error(`Unsupported ABI version ${version}`);
}
function getAbiVersion(abi) {
  if (abi.find((it) => it.type === "interface"))
    return 2;
  if (isCairo1Abi(abi))
    return 1;
  return 0;
}
function isNoConstructorValid(method, argsCalldata, abiMethod) {
  return method === "constructor" && !abiMethod && !argsCalldata.length;
}

// src/utils/calldata/tuple.ts
function parseNamedTuple(namedTuple) {
  const name = namedTuple.substring(0, namedTuple.indexOf(":"));
  const type = namedTuple.substring(name.length + ":".length);
  return { name, type };
}
function parseSubTuple(s) {
  if (!s.includes("("))
    return { subTuple: [], result: s };
  const subTuple = [];
  let result = "";
  let i = 0;
  while (i < s.length) {
    if (s[i] === "(") {
      let counter = 1;
      const lBracket = i;
      i++;
      while (counter) {
        if (s[i] === ")")
          counter--;
        if (s[i] === "(")
          counter++;
        i++;
      }
      subTuple.push(s.substring(lBracket, i));
      result += " ";
      i--;
    } else {
      result += s[i];
    }
    i++;
  }
  return {
    subTuple,
    result
  };
}
function extractCairo0Tuple(type) {
  const cleanType = type.replace(/\s/g, "").slice(1, -1);
  const { subTuple, result } = parseSubTuple(cleanType);
  let recomposed = result.split(",").map((it) => {
    return subTuple.length ? it.replace(" ", subTuple.shift()) : it;
  });
  if (isTypeNamedTuple(type)) {
    recomposed = recomposed.reduce((acc, it) => {
      return acc.concat(parseNamedTuple(it));
    }, []);
  }
  return recomposed;
}
function extractCairo1Tuple(type) {
  const cleanType = type.replace(/\s/g, "").slice(1, -1);
  const { subTuple, result } = parseSubTuple(cleanType);
  const recomposed = result.split(",").map((it) => {
    return subTuple.length ? it.replace(" ", subTuple.shift()) : it;
  });
  return recomposed;
}
function extractTupleMemberTypes(type) {
  if (isCairo1Type(type)) {
    return extractCairo1Tuple(type);
  }
  return extractCairo0Tuple(type);
}

// src/utils/calldata/propertyOrder.ts
function errorU256(key) {
  return Error(
    `Your object includes the property : ${key}, containing an Uint256 object without the 'low' and 'high' keys.`
  );
}
function orderPropsByAbi(unorderedObject, abiOfObject, structs, enums) {
  const orderInput = (unorderedItem, abiType) => {
    if (isTypeArray(abiType)) {
      return orderArray(unorderedItem, abiType);
    }
    if (isTypeEnum(abiType, enums)) {
      const abiObj = enums[abiType];
      return orderEnum(unorderedItem, abiObj);
    }
    if (isTypeTuple(abiType)) {
      return orderTuple(unorderedItem, abiType);
    }
    if (isTypeEthAddress(abiType)) {
      return unorderedItem;
    }
    if (isTypeUint256(abiType)) {
      const u256 = unorderedItem;
      if (typeof u256 !== "object") {
        return u256;
      }
      if (!("low" in u256 && "high" in u256)) {
        throw errorU256(abiType);
      }
      return { low: u256.low, high: u256.high };
    }
    if (isTypeStruct(abiType, structs)) {
      const abiOfStruct = structs[abiType].members;
      return orderStruct(unorderedItem, abiOfStruct);
    }
    return unorderedItem;
  };
  const orderStruct = (unorderedObject2, abiObject) => {
    const orderedObject2 = abiObject.reduce((orderedObject, abiParam) => {
      const setProperty = (value) => Object.defineProperty(orderedObject, abiParam.name, {
        enumerable: true,
        value: value ?? unorderedObject2[abiParam.name]
      });
      if (unorderedObject2[abiParam.name] === "undefined") {
        if (isCairo1Type(abiParam.type) || !isLen(abiParam.name)) {
          throw Error(`Your object needs a property with key : ${abiParam.name} .`);
        }
      }
      setProperty(orderInput(unorderedObject2[abiParam.name], abiParam.type));
      return orderedObject;
    }, {});
    return orderedObject2;
  };
  function orderArray(myArray, abiParam) {
    const typeInArray = getArrayType(abiParam);
    if (typeof myArray === "string") {
      return myArray;
    }
    return myArray.map((myElem) => orderInput(myElem, typeInArray));
  }
  function orderTuple(unorderedObject2, abiParam) {
    const typeList = extractTupleMemberTypes(abiParam);
    const orderedObject2 = typeList.reduce((orderedObject, abiTypeCairoX, index) => {
      const myObjKeys = Object.keys(unorderedObject2);
      const setProperty = (value) => Object.defineProperty(orderedObject, index.toString(), {
        enumerable: true,
        value: value ?? unorderedObject2[myObjKeys[index]]
      });
      const abiType = abiTypeCairoX?.type ? abiTypeCairoX.type : abiTypeCairoX;
      setProperty(orderInput(unorderedObject2[myObjKeys[index]], abiType));
      return orderedObject;
    }, {});
    return orderedObject2;
  }
  const orderEnum = (unorderedObject2, abiObject) => {
    if (isTypeResult(abiObject.name)) {
      const unorderedResult = unorderedObject2;
      const resultOkType = abiObject.name.substring(
        abiObject.name.indexOf("<") + 1,
        abiObject.name.lastIndexOf(",")
      );
      const resultErrType = abiObject.name.substring(
        abiObject.name.indexOf(",") + 1,
        abiObject.name.lastIndexOf(">")
      );
      if (unorderedResult.isOk()) {
        return new CairoResult(
          0 /* Ok */,
          orderInput(unorderedObject2.unwrap(), resultOkType)
        );
      }
      return new CairoResult(
        1 /* Err */,
        orderInput(unorderedObject2.unwrap(), resultErrType)
      );
    }
    if (isTypeOption(abiObject.name)) {
      const unorderedOption = unorderedObject2;
      const resultSomeType = abiObject.name.substring(
        abiObject.name.indexOf("<") + 1,
        abiObject.name.lastIndexOf(">")
      );
      if (unorderedOption.isSome()) {
        return new CairoOption(
          0 /* Some */,
          orderInput(unorderedOption.unwrap(), resultSomeType)
        );
      }
      return new CairoOption(1 /* None */, {});
    }
    const unorderedCustomEnum = unorderedObject2;
    const variants = Object.entries(unorderedCustomEnum.variant);
    const newEntries = variants.map((variant) => {
      if (typeof variant[1] === "undefined") {
        return variant;
      }
      const variantType = abiObject.type.substring(
        abiObject.type.lastIndexOf("<") + 1,
        abiObject.type.lastIndexOf(">")
      );
      if (variantType === "()") {
        return variant;
      }
      return [variant[0], orderInput(unorderedCustomEnum.unwrap(), variantType)];
    });
    return new CairoCustomEnum(Object.fromEntries(newEntries));
  };
  const finalOrderedObject = abiOfObject.reduce((orderedObject, abiParam) => {
    const setProperty = (value) => Object.defineProperty(orderedObject, abiParam.name, {
      enumerable: true,
      value
    });
    if (isLen(abiParam.name)) {
      return orderedObject;
    }
    setProperty(orderInput(unorderedObject[abiParam.name], abiParam.type));
    return orderedObject;
  }, {});
  return finalOrderedObject;
}

// src/utils/calldata/requestParser.ts
function parseBaseTypes(type, val) {
  switch (true) {
    case isTypeUint256(type):
      const el_uint256 = uint256(val);
      return [felt(el_uint256.low), felt(el_uint256.high)];
    default:
      return felt(val);
  }
}
function parseTuple(element, typeStr) {
  const memberTypes = extractTupleMemberTypes(typeStr);
  const elements = Object.values(element);
  if (elements.length !== memberTypes.length) {
    throw Error(
      `ParseTuple: provided and expected abi tuple size do not match.
      provided: ${elements} 
      expected: ${memberTypes}`
    );
  }
  return memberTypes.map((it, dx) => {
    return {
      element: elements[dx],
      type: it.type ?? it
    };
  });
}
function parseUint256(element) {
  if (typeof element === "object") {
    const { low, high } = element;
    return [felt(low), felt(high)];
  }
  const el_uint256 = uint256(element);
  return [felt(el_uint256.low), felt(el_uint256.high)];
}
function parseCalldataValue(element, type, structs, enums) {
  if (element === void 0) {
    throw Error(`Missing parameter for type ${type}`);
  }
  if (Array.isArray(element)) {
    const result = [];
    result.push(felt(element.length));
    const arrayType = getArrayType(type);
    return element.reduce((acc, it) => {
      return acc.concat(parseCalldataValue(it, arrayType, structs, enums));
    }, result);
  }
  if (structs[type] && structs[type].members.length) {
    if (isTypeUint256(type)) {
      return parseUint256(element);
    }
    if (type === "core::starknet::eth_address::EthAddress")
      return parseBaseTypes(type, element);
    const { members } = structs[type];
    const subElement = element;
    return members.reduce((acc, it) => {
      return acc.concat(parseCalldataValue(subElement[it.name], it.type, structs, enums));
    }, []);
  }
  if (isTypeTuple(type)) {
    const tupled = parseTuple(element, type);
    return tupled.reduce((acc, it) => {
      const parsedData = parseCalldataValue(it.element, it.type, structs, enums);
      return acc.concat(parsedData);
    }, []);
  }
  if (isTypeUint256(type)) {
    return parseUint256(element);
  }
  if (isTypeEnum(type, enums)) {
    const { variants } = enums[type];
    if (isTypeOption(type)) {
      const myOption = element;
      if (myOption.isSome()) {
        const listTypeVariant2 = variants.find((variant) => variant.name === "Some");
        if (typeof listTypeVariant2 === "undefined") {
          throw Error(`Error in abi : Option has no 'Some' variant.`);
        }
        const typeVariantSome = listTypeVariant2.type;
        if (typeVariantSome === "()") {
          return 0 /* Some */.toString();
        }
        const parsedParameter2 = parseCalldataValue(
          myOption.unwrap(),
          typeVariantSome,
          structs,
          enums
        );
        if (Array.isArray(parsedParameter2)) {
          return [0 /* Some */.toString(), ...parsedParameter2];
        }
        return [0 /* Some */.toString(), parsedParameter2];
      }
      return 1 /* None */.toString();
    }
    if (isTypeResult(type)) {
      const myResult = element;
      if (myResult.isOk()) {
        const listTypeVariant3 = variants.find((variant) => variant.name === "Ok");
        if (typeof listTypeVariant3 === "undefined") {
          throw Error(`Error in abi : Result has no 'Ok' variant.`);
        }
        const typeVariantOk = listTypeVariant3.type;
        if (typeVariantOk === "()") {
          return 0 /* Ok */.toString();
        }
        const parsedParameter3 = parseCalldataValue(
          myResult.unwrap(),
          typeVariantOk,
          structs,
          enums
        );
        if (Array.isArray(parsedParameter3)) {
          return [0 /* Ok */.toString(), ...parsedParameter3];
        }
        return [0 /* Ok */.toString(), parsedParameter3];
      }
      const listTypeVariant2 = variants.find((variant) => variant.name === "Err");
      if (typeof listTypeVariant2 === "undefined") {
        throw Error(`Error in abi : Result has no 'Err' variant.`);
      }
      const typeVariantErr = listTypeVariant2.type;
      if (typeVariantErr === "()") {
        return 1 /* Err */.toString();
      }
      const parsedParameter2 = parseCalldataValue(myResult.unwrap(), typeVariantErr, structs, enums);
      if (Array.isArray(parsedParameter2)) {
        return [1 /* Err */.toString(), ...parsedParameter2];
      }
      return [1 /* Err */.toString(), parsedParameter2];
    }
    const myEnum = element;
    const activeVariant = myEnum.activeVariant();
    const listTypeVariant = variants.find((variant) => variant.name === activeVariant);
    if (typeof listTypeVariant === "undefined") {
      throw Error(`Not find in abi : Enum has no '${activeVariant}' variant.`);
    }
    const typeActiveVariant = listTypeVariant.type;
    const numActiveVariant = variants.findIndex((variant) => variant.name === activeVariant);
    if (typeActiveVariant === "()") {
      return numActiveVariant.toString();
    }
    const parsedParameter = parseCalldataValue(myEnum.unwrap(), typeActiveVariant, structs, enums);
    if (Array.isArray(parsedParameter)) {
      return [numActiveVariant.toString(), ...parsedParameter];
    }
    return [numActiveVariant.toString(), parsedParameter];
  }
  if (typeof element === "object") {
    throw Error(`Parameter ${element} do not align with abi parameter ${type}`);
  }
  return parseBaseTypes(type, element);
}
function parseCalldataField(argsIterator, input, structs, enums) {
  const { name, type } = input;
  let { value } = argsIterator.next();
  switch (true) {
    case isTypeArray(type):
      if (!Array.isArray(value) && !isText(value)) {
        throw Error(`ABI expected parameter ${name} to be array or long string, got ${value}`);
      }
      if (typeof value === "string") {
        value = splitLongString(value);
      }
      return parseCalldataValue(value, input.type, structs, enums);
    case type === "core::starknet::eth_address::EthAddress":
      return parseBaseTypes(type, value);
    case (isTypeStruct(type, structs) || isTypeTuple(type) || isTypeUint256(type)):
      return parseCalldataValue(value, type, structs, enums);
    case isTypeEnum(type, enums):
      return parseCalldataValue(
        value,
        type,
        structs,
        enums
      );
    default:
      return parseBaseTypes(type, value);
  }
}

// src/utils/calldata/responseParser.ts
function parseBaseTypes2(type, it) {
  let temp;
  switch (true) {
    case isTypeBool(type):
      temp = it.next().value;
      return Boolean(BigInt(temp));
    case isTypeUint256(type):
      const low = it.next().value;
      const high = it.next().value;
      return uint256ToBN({ low, high });
    case type === "core::starknet::eth_address::EthAddress":
      temp = it.next().value;
      return BigInt(temp);
    default:
      temp = it.next().value;
      return BigInt(temp);
  }
}
function parseResponseValue(responseIterator, element, structs, enums) {
  if (element.type === "()") {
    return {};
  }
  if (isTypeUint256(element.type)) {
    const low = responseIterator.next().value;
    const high = responseIterator.next().value;
    return uint256ToBN({ low, high });
  }
  if (isTypeArray(element.type)) {
    const parsedDataArr = [];
    const el = { name: "", type: getArrayType(element.type) };
    const len = BigInt(responseIterator.next().value);
    while (parsedDataArr.length < len) {
      parsedDataArr.push(parseResponseValue(responseIterator, el, structs, enums));
    }
    return parsedDataArr;
  }
  if (structs && element.type in structs && structs[element.type]) {
    if (element.type === "core::starknet::eth_address::EthAddress") {
      return parseBaseTypes2(element.type, responseIterator);
    }
    return structs[element.type].members.reduce((acc, el) => {
      acc[el.name] = parseResponseValue(responseIterator, el, structs, enums);
      return acc;
    }, {});
  }
  if (enums && element.type in enums && enums[element.type]) {
    const variantNum = Number(responseIterator.next().value);
    const rawEnum = enums[element.type].variants.reduce((acc, variant, num) => {
      if (num === variantNum) {
        acc[variant.name] = parseResponseValue(
          responseIterator,
          { name: "", type: variant.type },
          structs,
          enums
        );
        return acc;
      }
      acc[variant.name] = void 0;
      return acc;
    }, {});
    if (element.type.startsWith("core::option::Option")) {
      const content = variantNum === 0 /* Some */ ? rawEnum.Some : void 0;
      return new CairoOption(variantNum, content);
    }
    if (element.type.startsWith("core::result::Result")) {
      let content;
      if (variantNum === 0 /* Ok */) {
        content = rawEnum.Ok;
      } else {
        content = rawEnum.Err;
      }
      return new CairoResult(variantNum, content);
    }
    const customEnum = new CairoCustomEnum(rawEnum);
    return customEnum;
  }
  if (isTypeTuple(element.type)) {
    const memberTypes = extractTupleMemberTypes(element.type);
    return memberTypes.reduce((acc, it, idx) => {
      const name = it?.name ? it.name : idx;
      const type = it?.type ? it.type : it;
      const el = { name, type };
      acc[name] = parseResponseValue(responseIterator, el, structs, enums);
      return acc;
    }, {});
  }
  if (isTypeArray(element.type)) {
    const parsedDataArr = [];
    const el = { name: "", type: getArrayType(element.type) };
    const len = BigInt(responseIterator.next().value);
    while (parsedDataArr.length < len) {
      parsedDataArr.push(parseResponseValue(responseIterator, el, structs, enums));
    }
    return parsedDataArr;
  }
  return parseBaseTypes2(element.type, responseIterator);
}
function responseParser(responseIterator, output, structs, enums, parsedResult) {
  const { name, type } = output;
  let temp;
  switch (true) {
    case isLen(name):
      temp = responseIterator.next().value;
      return BigInt(temp);
    case (structs && type in structs || isTypeTuple(type)):
      return parseResponseValue(responseIterator, output, structs, enums);
    case (enums && isTypeEnum(type, enums)):
      return parseResponseValue(responseIterator, output, structs, enums);
    case isTypeArray(type):
      if (isCairo1Type(type)) {
        return parseResponseValue(responseIterator, output, structs, enums);
      }
      const parsedDataArr = [];
      if (parsedResult && parsedResult[`${name}_len`]) {
        const arrLen = parsedResult[`${name}_len`];
        while (parsedDataArr.length < arrLen) {
          parsedDataArr.push(
            parseResponseValue(
              responseIterator,
              { name, type: output.type.replace("*", "") },
              structs,
              enums
            )
          );
        }
      }
      return parsedDataArr;
    default:
      return parseBaseTypes2(type, responseIterator);
  }
}

// src/utils/calldata/validate.ts
var validateFelt = (parameter, input) => {
  assert(
    typeof parameter === "string" || typeof parameter === "number" || typeof parameter === "bigint",
    `Validate: arg ${input.name} should be a felt typed as (String, Number or BigInt)`
  );
  if (typeof parameter === "string" && !isHex(parameter))
    return;
  const param = BigInt(parameter.toString(10));
  assert(
    // from : https://github.com/starkware-libs/starknet-specs/blob/29bab650be6b1847c92d4461d4c33008b5e50b1a/api/starknet_api_openrpc.json#L1266
    param >= 0n && param <= 2n ** 252n - 1n,
    `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 2^252-1]`
  );
};
var validateUint = (parameter, input) => {
  if (typeof parameter === "number") {
    assert(
      parameter <= Number.MAX_SAFE_INTEGER,
      `Validation: Parameter is to large to be typed as Number use (BigInt or String)`
    );
  }
  assert(
    typeof parameter === "string" || typeof parameter === "number" || typeof parameter === "bigint" || typeof parameter === "object" && "low" in parameter && "high" in parameter,
    `Validate: arg ${input.name} of cairo type ${input.type} should be type (String, Number or BigInt), but is ${typeof parameter} ${parameter}.`
  );
  const param = typeof parameter === "object" ? uint256ToBN(parameter) : toBigInt(parameter);
  switch (input.type) {
    case "core::integer::u8" /* u8 */:
      assert(
        param >= 0n && param <= 255n,
        `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0 - 255]`
      );
      break;
    case "core::integer::u16" /* u16 */:
      assert(
        param >= 0n && param <= 65535n,
        `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 65535]`
      );
      break;
    case "core::integer::u32" /* u32 */:
      assert(
        param >= 0n && param <= 4294967295n,
        `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 4294967295]`
      );
      break;
    case "core::integer::u64" /* u64 */:
      assert(
        param >= 0n && param <= 2n ** 64n - 1n,
        `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 2^64-1]`
      );
      break;
    case "core::integer::u128" /* u128 */:
      assert(
        param >= 0n && param <= 2n ** 128n - 1n,
        `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 2^128-1]`
      );
      break;
    case "core::integer::u256" /* u256 */:
      assert(
        param >= 0n && param <= 2n ** 256n - 1n,
        `Validate: arg ${input.name} is ${input.type} 0 - 2^256-1`
      );
      break;
    case "core::starknet::class_hash::ClassHash" /* ClassHash */:
      assert(
        // from : https://github.com/starkware-libs/starknet-specs/blob/29bab650be6b1847c92d4461d4c33008b5e50b1a/api/starknet_api_openrpc.json#L1670
        param >= 0n && param <= 2n ** 252n - 1n,
        `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 2^252-1]`
      );
      break;
    case "core::starknet::contract_address::ContractAddress" /* ContractAddress */:
      assert(
        // from : https://github.com/starkware-libs/starknet-specs/blob/29bab650be6b1847c92d4461d4c33008b5e50b1a/api/starknet_api_openrpc.json#L1245
        param >= 0n && param <= 2n ** 252n - 1n,
        `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 2^252-1]`
      );
      break;
    default:
      break;
  }
};
var validateBool = (parameter, input) => {
  assert(
    typeof parameter === "boolean",
    `Validate: arg ${input.name} of cairo type ${input.type} should be type (Boolean)`
  );
};
var validateStruct = (parameter, input, structs) => {
  if (input.type === "core::integer::u256" /* u256 */) {
    validateUint(parameter, input);
    return;
  }
  if (input.type === "core::starknet::eth_address::EthAddress") {
    assert(
      typeof parameter !== "object",
      `EthAdress type is waiting a BigNumberish. Got ${parameter}`
    );
    const param = BigInt(parameter.toString(10));
    assert(
      // from : https://github.com/starkware-libs/starknet-specs/blob/29bab650be6b1847c92d4461d4c33008b5e50b1a/api/starknet_api_openrpc.json#L1259
      param >= 0n && param <= 2n ** 160n - 1n,
      `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 2^160-1]`
    );
    return;
  }
  assert(
    typeof parameter === "object" && !Array.isArray(parameter),
    `Validate: arg ${input.name} is cairo type struct (${input.type}), and should be defined as js object (not array)`
  );
  structs[input.type].members.forEach(({ name }) => {
    assert(
      Object.keys(parameter).includes(name),
      `Validate: arg ${input.name} should have a property ${name}`
    );
  });
};
var validateEnum = (parameter, input) => {
  assert(
    typeof parameter === "object" && !Array.isArray(parameter),
    `Validate: arg ${input.name} is cairo type Enum (${input.type}), and should be defined as js object (not array)`
  );
  const methodsKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(parameter));
  const keys = [...Object.getOwnPropertyNames(parameter), ...methodsKeys];
  if (isTypeOption(input.type) && keys.includes("isSome") && keys.includes("isNone")) {
    return;
  }
  if (isTypeResult(input.type) && keys.includes("isOk") && keys.includes("isErr")) {
    return;
  }
  if (keys.includes("variant") && keys.includes("activeVariant")) {
    return;
  }
  throw new Error(
    `Validate Enum: argument ${input.name}, type ${input.type}, value received ${parameter}, is not an Enum.`
  );
};
var validateTuple = (parameter, input) => {
  assert(
    typeof parameter === "object" && !Array.isArray(parameter),
    `Validate: arg ${input.name} should be a tuple (defined as object)`
  );
};
var validateArray = (parameter, input, structs, enums) => {
  const baseType = getArrayType(input.type);
  if (isTypeFelt(baseType) && isLongText(parameter)) {
    return;
  }
  assert(Array.isArray(parameter), `Validate: arg ${input.name} should be an Array`);
  switch (true) {
    case isTypeFelt(baseType):
      parameter.forEach((param) => validateFelt(param, input));
      break;
    case isTypeTuple(baseType):
      parameter.forEach((it) => validateTuple(it, { name: input.name, type: baseType }));
      break;
    case isTypeArray(baseType):
      parameter.forEach(
        (param) => validateArray(param, { name: "", type: baseType }, structs, enums)
      );
      break;
    case isTypeStruct(baseType, structs):
      parameter.forEach(
        (it) => validateStruct(it, { name: input.name, type: baseType }, structs)
      );
      break;
    case isTypeEnum(baseType, enums):
      parameter.forEach((it) => validateEnum(it, { name: input.name, type: baseType }));
      break;
    case (isTypeUint(baseType) || isTypeLitteral(baseType)):
      parameter.forEach((param) => validateUint(param, input));
      break;
    case isTypeBool(baseType):
      parameter.forEach((param) => validateBool(param, input));
      break;
    default:
      throw new Error(
        `Validate Unhandled: argument ${input.name}, type ${input.type}, value ${parameter}`
      );
  }
};
function validateFields(abiMethod, args, structs, enums) {
  abiMethod.inputs.reduce((acc, input) => {
    const parameter = args[acc];
    switch (true) {
      case isLen(input.name):
        return acc;
      case isTypeFelt(input.type):
        validateFelt(parameter, input);
        break;
      case (isTypeUint(input.type) || isTypeLitteral(input.type)):
        validateUint(parameter, input);
        break;
      case isTypeBool(input.type):
        validateBool(parameter, input);
        break;
      case isTypeArray(input.type):
        validateArray(parameter, input, structs, enums);
        break;
      case isTypeStruct(input.type, structs):
        validateStruct(parameter, input, structs);
        break;
      case isTypeEnum(input.type, enums):
        validateEnum(parameter, input);
        break;
      case isTypeTuple(input.type):
        validateTuple(parameter, input);
        break;
      default:
        throw new Error(
          `Validate Unhandled: argument ${input.name}, type ${input.type}, value ${parameter}`
        );
    }
    return acc + 1;
  }, 0);
}

// src/utils/calldata/index.ts
var CallData = class {
  constructor(abi) {
    this.structs = CallData.getAbiStruct(abi);
    this.enums = CallData.getAbiEnum(abi);
    this.parser = createAbiParser(abi);
    this.abi = this.parser.getLegacyFormat();
  }
  /**
   * Validate arguments passed to the method as corresponding to the ones in the abi
   * @param type ValidateType - type of the method
   * @param method string - name of the method
   * @param args ArgsOrCalldata - arguments that are passed to the method
   */
  validate(type, method, args = []) {
    if (type !== "DEPLOY" /* DEPLOY */) {
      const invocableFunctionNames = this.abi.filter((abi) => {
        if (abi.type !== "function")
          return false;
        const isView = abi.stateMutability === "view" || abi.state_mutability === "view";
        return type === "INVOKE" /* INVOKE */ ? !isView : isView;
      }).map((abi) => abi.name);
      assert(
        invocableFunctionNames.includes(method),
        `${type === "INVOKE" /* INVOKE */ ? "invocable" : "viewable"} method not found in abi`
      );
    }
    const abiMethod = this.abi.find(
      (abi) => type === "DEPLOY" /* DEPLOY */ ? abi.name === method && abi.type === "constructor" : abi.name === method && abi.type === "function"
    );
    if (isNoConstructorValid(method, args, abiMethod)) {
      return;
    }
    const inputsLength = this.parser.methodInputsLength(abiMethod);
    if (args.length !== inputsLength) {
      throw Error(
        `Invalid number of arguments, expected ${inputsLength} arguments, but got ${args.length}`
      );
    }
    validateFields(abiMethod, args, this.structs, this.enums);
  }
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
  compile(method, argsCalldata) {
    const abiMethod = this.abi.find((abiFunction) => abiFunction.name === method);
    if (isNoConstructorValid(method, argsCalldata, abiMethod)) {
      return [];
    }
    let args;
    if (Array.isArray(argsCalldata)) {
      args = argsCalldata;
    } else {
      const orderedObject = orderPropsByAbi(
        argsCalldata,
        abiMethod.inputs,
        this.structs,
        this.enums
      );
      args = Object.values(orderedObject);
      validateFields(abiMethod, args, this.structs, this.enums);
    }
    const argsIterator = args[Symbol.iterator]();
    const callArray = abiMethod.inputs.reduce(
      (acc, input) => isLen(input.name) ? acc : acc.concat(parseCalldataField(argsIterator, input, this.structs, this.enums)),
      []
    );
    Object.defineProperty(callArray, "__compiled__", {
      enumerable: false,
      writable: false,
      value: true
    });
    return callArray;
  }
  /**
   * Compile contract callData without abi
   * @param rawArgs RawArgs representing cairo method arguments or string array of compiled data
   * @returns Calldata
   */
  static compile(rawArgs) {
    const createTree = (obj) => {
      const getEntries = (o, prefix = ".") => {
        const oe = Array.isArray(o) ? [o.length.toString(), ...o] : o;
        return Object.entries(oe).flatMap(([k, v]) => {
          let value = v;
          if (isLongText(value))
            value = splitLongString(value);
          if (k === "entrypoint")
            value = getSelectorFromName(value);
          const kk = Array.isArray(oe) && k === "0" ? "$$len" : k;
          if (isBigInt(value))
            return [[`${prefix}${kk}`, felt(value)]];
          if (Object(value) === value) {
            const methodsKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(value));
            const keys = [...Object.getOwnPropertyNames(value), ...methodsKeys];
            if (keys.includes("isSome") && keys.includes("isNone")) {
              const myOption = value;
              const variantNb = myOption.isSome() ? 0 /* Some */ : 1 /* None */;
              if (myOption.isSome())
                return getEntries({ 0: variantNb, 1: myOption.unwrap() }, `${prefix}${kk}.`);
              return [[`${prefix}${kk}`, felt(variantNb)]];
            }
            if (keys.includes("isOk") && keys.includes("isErr")) {
              const myResult = value;
              const variantNb = myResult.isOk() ? 0 /* Ok */ : 1 /* Err */;
              return getEntries({ 0: variantNb, 1: myResult.unwrap() }, `${prefix}${kk}.`);
            }
            if (keys.includes("variant") && keys.includes("activeVariant")) {
              const myEnum = value;
              const activeVariant = myEnum.activeVariant();
              const listVariants = Object.keys(myEnum.variant);
              const activeVariantNb = listVariants.findIndex(
                (variant) => variant === activeVariant
              );
              if (typeof myEnum.unwrap() === "object" && Object.keys(myEnum.unwrap()).length === 0) {
                return [[`${prefix}${kk}`, felt(activeVariantNb)]];
              }
              return getEntries({ 0: activeVariantNb, 1: myEnum.unwrap() }, `${prefix}${kk}.`);
            }
            return getEntries(value, `${prefix}${kk}.`);
          }
          return [[`${prefix}${kk}`, felt(value)]];
        });
      };
      const result = Object.fromEntries(getEntries(obj));
      return result;
    };
    let callTreeArray;
    if (!Array.isArray(rawArgs)) {
      const callTree = createTree(rawArgs);
      callTreeArray = Object.values(callTree);
    } else {
      const callObj = { ...rawArgs };
      const callTree = createTree(callObj);
      callTreeArray = Object.values(callTree);
    }
    Object.defineProperty(callTreeArray, "__compiled__", {
      enumerable: false,
      writable: false,
      value: true
    });
    return callTreeArray;
  }
  /**
   * Parse elements of the response array and structuring them into response object
   * @param method string - method name
   * @param response string[] - response from the method
   * @return Result - parsed response corresponding to the abi
   */
  parse(method, response) {
    const { outputs } = this.abi.find((abi) => abi.name === method);
    const responseIterator = response.flat()[Symbol.iterator]();
    const parsed = outputs.flat().reduce((acc, output, idx) => {
      const propName = output.name ?? idx;
      acc[propName] = responseParser(responseIterator, output, this.structs, this.enums, acc);
      if (acc[propName] && acc[`${propName}_len`]) {
        delete acc[`${propName}_len`];
      }
      return acc;
    }, {});
    return Object.keys(parsed).length === 1 && 0 in parsed ? parsed[0] : parsed;
  }
  /**
   * Format cairo method response data to native js values based on provided format schema
   * @param method string - cairo method name
   * @param response string[] - cairo method response
   * @param format object - formatter object schema
   * @returns Result - parsed and formatted response object
   */
  format(method, response, format) {
    const parsed = this.parse(method, response);
    return formatter(parsed, format);
  }
  /**
   * Helper to extract structs from abi
   * @param abi Abi
   * @returns AbiStructs - structs from abi
   */
  static getAbiStruct(abi) {
    return abi.filter((abiEntry) => abiEntry.type === "struct").reduce(
      (acc, abiEntry) => ({
        ...acc,
        [abiEntry.name]: abiEntry
      }),
      {}
    );
  }
  /**
   * Helper to extract enums from abi
   * @param abi Abi
   * @returns AbiEnums - enums from abi
   */
  static getAbiEnum(abi) {
    const fullEnumList = abi.filter((abiEntry) => abiEntry.type === "enum").reduce(
      (acc, abiEntry) => ({
        ...acc,
        [abiEntry.name]: abiEntry
      }),
      {}
    );
    delete fullEnumList["core::bool"];
    return fullEnumList;
  }
  /**
   * Helper: Compile HexCalldata | RawCalldata | RawArgs
   * @param rawCalldata HexCalldata | RawCalldata | RawArgs
   * @returns Calldata
   */
  static toCalldata(rawCalldata = []) {
    return CallData.compile(rawCalldata);
  }
  /**
   * Helper: Convert raw to HexCalldata
   * @param raw HexCalldata | RawCalldata | RawArgs
   * @returns HexCalldata
   */
  static toHex(raw = []) {
    const calldata = CallData.compile(raw);
    return calldata.map((it) => toHex(it));
  }
};

// src/utils/hash.ts
var hash_exports = {};
__export(hash_exports, {
  calculateContractAddressFromHash: () => calculateContractAddressFromHash,
  calculateDeclareTransactionHash: () => calculateDeclareTransactionHash,
  calculateDeployAccountTransactionHash: () => calculateDeployAccountTransactionHash,
  calculateDeployTransactionHash: () => calculateDeployTransactionHash,
  calculateTransactionHash: () => calculateTransactionHash,
  calculateTransactionHashCommon: () => calculateTransactionHashCommon,
  computeCompiledClassHash: () => computeCompiledClassHash,
  computeContractClassHash: () => computeContractClassHash,
  computeHashOnElements: () => computeHashOnElements,
  computeLegacyContractClassHash: () => computeLegacyContractClassHash,
  computeSierraContractClassHash: () => computeSierraContractClassHash,
  default: () => computeHintedClassHash,
  feeTransactionVersion: () => feeTransactionVersion,
  feeTransactionVersion_2: () => feeTransactionVersion_2,
  formatSpaces: () => formatSpaces,
  getSelector: () => getSelector,
  getSelectorFromName: () => getSelectorFromName,
  getVersionsByType: () => getVersionsByType,
  keccakBn: () => keccakBn,
  poseidon: () => poseidon,
  starknetKeccak: () => starknetKeccak,
  transactionVersion: () => transactionVersion,
  transactionVersion_2: () => transactionVersion_2
});
var import_starknet2 = require("@scure/starknet");

// src/utils/ec.ts
var ec_exports = {};
__export(ec_exports, {
  starkCurve: () => starkCurve,
  weierstrass: () => weierstrass
});
var starkCurve = __toESM(require("@scure/starknet"));
var weierstrass = __toESM(require("@noble/curves/abstract/weierstrass"));

// src/utils/json.ts
var json_exports = {};
__export(json_exports, {
  parse: () => parse2,
  parseAlwaysAsBig: () => parseAlwaysAsBig,
  stringify: () => stringify2,
  stringifyAlwaysAsBig: () => stringifyAlwaysAsBig
});
var json = __toESM(require("lossless-json"));
var parseIntAsNumberOrBigInt = (x) => {
  if (!json.isInteger(x))
    return parseFloat(x);
  const v = parseInt(x, 10);
  return Number.isSafeInteger(v) ? v : BigInt(x);
};
var parse2 = (x) => json.parse(String(x), void 0, parseIntAsNumberOrBigInt);
var parseAlwaysAsBig = (x) => json.parse(String(x), void 0, json.parseNumberAndBigInt);
var stringify2 = (value, replacer, space, numberStringifiers) => json.stringify(value, replacer, space, numberStringifiers);
var stringifyAlwaysAsBig = stringify2;

// src/utils/hash.ts
var poseidon = __toESM(require("@noble/curves/abstract/poseidon"));
var transactionVersion = BN_TRANSACTION_VERSION_1;
var transactionVersion_2 = BN_TRANSACTION_VERSION_2;
var feeTransactionVersion = BN_FEE_TRANSACTION_VERSION_1;
var feeTransactionVersion_2 = BN_FEE_TRANSACTION_VERSION_2;
function getVersionsByType(versionType) {
  return versionType === "fee" ? { v1: feeTransactionVersion, v2: feeTransactionVersion_2 } : { v1: transactionVersion, v2: transactionVersion_2 };
}
function computeHashOnElements(data) {
  return [...data, data.length].reduce((x, y) => starkCurve.pedersen(toBigInt(x), toBigInt(y)), 0).toString();
}
function calculateTransactionHashCommon(txHashPrefix, version, contractAddress, entryPointSelector, calldata, maxFee, chainId, additionalData = []) {
  const calldataHash = computeHashOnElements(calldata);
  const dataToHash = [
    txHashPrefix,
    version,
    contractAddress,
    entryPointSelector,
    calldataHash,
    maxFee,
    chainId,
    ...additionalData
  ];
  return computeHashOnElements(dataToHash);
}
function calculateDeployTransactionHash(contractAddress, constructorCalldata, version, chainId, constructorName = "constructor") {
  return calculateTransactionHashCommon(
    "0x6465706c6f79" /* DEPLOY */,
    version,
    contractAddress,
    getSelectorFromName(constructorName),
    constructorCalldata,
    0,
    chainId
  );
}
function calculateDeclareTransactionHash(classHash, senderAddress, version, maxFee, chainId, nonce, compiledClassHash) {
  return calculateTransactionHashCommon(
    "0x6465636c617265" /* DECLARE */,
    version,
    senderAddress,
    0,
    [classHash],
    maxFee,
    chainId,
    [nonce, ...compiledClassHash ? [compiledClassHash] : []]
  );
}
function calculateDeployAccountTransactionHash(contractAddress, classHash, constructorCalldata, salt, version, maxFee, chainId, nonce) {
  const calldata = [classHash, salt, ...constructorCalldata];
  return calculateTransactionHashCommon(
    "0x6465706c6f795f6163636f756e74" /* DEPLOY_ACCOUNT */,
    version,
    contractAddress,
    0,
    calldata,
    maxFee,
    chainId,
    [nonce]
  );
}
function calculateTransactionHash(contractAddress, version, calldata, maxFee, chainId, nonce) {
  return calculateTransactionHashCommon(
    "0x696e766f6b65" /* INVOKE */,
    version,
    contractAddress,
    0,
    calldata,
    maxFee,
    chainId,
    [nonce]
  );
}
function calculateContractAddressFromHash(salt, classHash, constructorCalldata, deployerAddress) {
  const compiledCalldata = CallData.compile(constructorCalldata);
  const constructorCalldataHash = computeHashOnElements(compiledCalldata);
  const CONTRACT_ADDRESS_PREFIX = felt("0x535441524b4e45545f434f4e54524143545f41444452455353");
  return computeHashOnElements([
    CONTRACT_ADDRESS_PREFIX,
    deployerAddress,
    salt,
    classHash,
    constructorCalldataHash
  ]);
}
function nullSkipReplacer(key, value) {
  if (key === "attributes" || key === "accessible_scopes") {
    return Array.isArray(value) && value.length === 0 ? void 0 : value;
  }
  if (key === "debug_info") {
    return null;
  }
  return value === null ? void 0 : value;
}
function formatSpaces(json2) {
  let insideQuotes = false;
  const newString = [];
  for (const char of json2) {
    if (char === '"' && (newString.length > 0 && newString.slice(-1)[0] === "\\") === false) {
      insideQuotes = !insideQuotes;
    }
    if (insideQuotes) {
      newString.push(char);
    } else {
      newString.push(char === ":" ? ": " : char === "," ? ", " : char);
    }
  }
  return newString.join("");
}
function computeHintedClassHash(compiledContract) {
  const { abi, program } = compiledContract;
  const contractClass = { abi, program };
  const serializedJson = formatSpaces(stringify2(contractClass, nullSkipReplacer));
  return addHexPrefix(starkCurve.keccak(utf8ToArray(serializedJson)).toString(16));
}
function computeLegacyContractClassHash(contract) {
  const compiledContract = typeof contract === "string" ? parse2(contract) : contract;
  const apiVersion = toHex(API_VERSION);
  const externalEntryPointsHash = computeHashOnElements(
    compiledContract.entry_points_by_type.EXTERNAL.flatMap((e) => [e.selector, e.offset])
  );
  const l1HandlerEntryPointsHash = computeHashOnElements(
    compiledContract.entry_points_by_type.L1_HANDLER.flatMap((e) => [e.selector, e.offset])
  );
  const constructorEntryPointHash = computeHashOnElements(
    compiledContract.entry_points_by_type.CONSTRUCTOR.flatMap((e) => [e.selector, e.offset])
  );
  const builtinsHash = computeHashOnElements(
    compiledContract.program.builtins.map((s) => encodeShortString(s))
  );
  const hintedClassHash = computeHintedClassHash(compiledContract);
  const dataHash = computeHashOnElements(compiledContract.program.data);
  return computeHashOnElements([
    apiVersion,
    externalEntryPointsHash,
    l1HandlerEntryPointsHash,
    constructorEntryPointHash,
    builtinsHash,
    hintedClassHash,
    dataHash
  ]);
}
function hashBuiltins(builtins) {
  return (0, import_starknet2.poseidonHashMany)(
    builtins.flatMap((it) => {
      return BigInt(encodeShortString(it));
    })
  );
}
function hashEntryPoint(data) {
  const base = data.flatMap((it) => {
    return [BigInt(it.selector), BigInt(it.offset), hashBuiltins(it.builtins)];
  });
  return (0, import_starknet2.poseidonHashMany)(base);
}
function computeCompiledClassHash(casm) {
  const COMPILED_CLASS_VERSION = "COMPILED_CLASS_V1";
  const compiledClassVersion = BigInt(encodeShortString(COMPILED_CLASS_VERSION));
  const externalEntryPointsHash = hashEntryPoint(casm.entry_points_by_type.EXTERNAL);
  const l1Handlers = hashEntryPoint(casm.entry_points_by_type.L1_HANDLER);
  const constructor = hashEntryPoint(casm.entry_points_by_type.CONSTRUCTOR);
  const bytecode = (0, import_starknet2.poseidonHashMany)(casm.bytecode.map((it) => BigInt(it)));
  return toHex(
    (0, import_starknet2.poseidonHashMany)([
      compiledClassVersion,
      externalEntryPointsHash,
      l1Handlers,
      constructor,
      bytecode
    ])
  );
}
function hashEntryPointSierra(data) {
  const base = data.flatMap((it) => {
    return [BigInt(it.selector), BigInt(it.function_idx)];
  });
  return (0, import_starknet2.poseidonHashMany)(base);
}
function hashAbi(sierra) {
  const indentString = formatSpaces(stringify2(sierra.abi, null));
  return BigInt(addHexPrefix(starkCurve.keccak(utf8ToArray(indentString)).toString(16)));
}
function computeSierraContractClassHash(sierra) {
  const CONTRACT_CLASS_VERSION = "CONTRACT_CLASS_V0.1.0";
  const compiledClassVersion = BigInt(encodeShortString(CONTRACT_CLASS_VERSION));
  const externalEntryPointsHash = hashEntryPointSierra(sierra.entry_points_by_type.EXTERNAL);
  const l1Handlers = hashEntryPointSierra(sierra.entry_points_by_type.L1_HANDLER);
  const constructor = hashEntryPointSierra(sierra.entry_points_by_type.CONSTRUCTOR);
  const abiHash = hashAbi(sierra);
  const sierraProgram = (0, import_starknet2.poseidonHashMany)(sierra.sierra_program.map((it) => BigInt(it)));
  return toHex(
    (0, import_starknet2.poseidonHashMany)([
      compiledClassVersion,
      externalEntryPointsHash,
      l1Handlers,
      constructor,
      abiHash,
      sierraProgram
    ])
  );
}
function computeContractClassHash(contract) {
  const compiledContract = typeof contract === "string" ? parse2(contract) : contract;
  if ("sierra_program" in compiledContract) {
    return computeSierraContractClassHash(compiledContract);
  }
  return computeLegacyContractClassHash(compiledContract);
}

// src/utils/stark.ts
var stark_exports = {};
__export(stark_exports, {
  compressProgram: () => compressProgram,
  decompressProgram: () => decompressProgram,
  estimatedFeeToMaxFee: () => estimatedFeeToMaxFee,
  formatSignature: () => formatSignature,
  makeAddress: () => makeAddress,
  randomAddress: () => randomAddress,
  signatureToDecimalArray: () => signatureToDecimalArray,
  signatureToHexArray: () => signatureToHexArray
});
var import_starknet3 = require("@scure/starknet");
var import_pako = require("pako");
function compressProgram(jsonProgram) {
  const stringified = typeof jsonProgram === "string" ? jsonProgram : stringify2(jsonProgram);
  const compressedProgram = (0, import_pako.gzip)(stringified);
  return btoaUniversal(compressedProgram);
}
function decompressProgram(base64) {
  if (Array.isArray(base64))
    return base64;
  const decompressed = arrayBufferToString((0, import_pako.ungzip)(atobUniversal(base64)));
  return parse2(decompressed);
}
function randomAddress() {
  const randomKeyPair = import_starknet3.utils.randomPrivateKey();
  return (0, import_starknet3.getStarkKey)(randomKeyPair);
}
function makeAddress(input) {
  return addHexPrefix(input).toLowerCase();
}
function formatSignature(sig) {
  if (!sig)
    throw Error("formatSignature: provided signature is undefined");
  if (Array.isArray(sig)) {
    return sig.map((it) => toHex(it));
  }
  try {
    const { r, s } = sig;
    return [toHex(r), toHex(s)];
  } catch (e) {
    throw new Error("Signature need to be weierstrass.SignatureType or an array for custom");
  }
}
function signatureToDecimalArray(sig) {
  return bigNumberishArrayToDecimalStringArray(formatSignature(sig));
}
function signatureToHexArray(sig) {
  return bigNumberishArrayToHexadecimalStringArray(formatSignature(sig));
}
function estimatedFeeToMaxFee(estimatedFee, overhead = 0.5) {
  const overHeadPercent = Math.round((1 + overhead) * 100);
  return toBigInt(estimatedFee) * toBigInt(overHeadPercent) / 100n;
}

// src/utils/contract.ts
function isSierra(contract) {
  const compiledContract = typeof contract === "string" ? parse2(contract) : contract;
  return "sierra_program" in compiledContract;
}
function extractContractHashes(payload) {
  const response = { ...payload };
  if (isSierra(payload.contract)) {
    if (!payload.compiledClassHash && payload.casm) {
      response.compiledClassHash = computeCompiledClassHash(payload.casm);
    }
    if (!response.compiledClassHash)
      throw new Error(
        "Extract compiledClassHash failed, provide (CairoAssembly).casm file or compiledClassHash"
      );
  }
  response.classHash = payload.classHash ?? computeContractClassHash(payload.contract);
  if (!response.classHash)
    throw new Error("Extract classHash failed, provide (CompiledContract).json file or classHash");
  return response;
}
function contractClassResponseToLegacyCompiledContract(ccr) {
  if (isSierra(ccr)) {
    throw Error("ContractClassResponse need to be LegacyContractClass (cairo0 response class)");
  }
  const contract = ccr;
  return { ...contract, program: decompressProgram(contract.program) };
}

// src/utils/fetchPonyfill.ts
var import_isomorphic_fetch = __toESM(require("isomorphic-fetch"));
var fetchPonyfill_default = typeof window !== "undefined" && window.fetch || // use buildin fetch in browser if available
typeof global !== "undefined" && global.fetch || // use buildin fetch in node, react-native and service worker if available
import_isomorphic_fetch.default;

// src/utils/provider.ts
var provider_exports = {};
__export(provider_exports, {
  createSierraContractClass: () => createSierraContractClass,
  parseContract: () => parseContract,
  wait: () => wait
});
function wait(delay) {
  return new Promise((res) => {
    setTimeout(res, delay);
  });
}
function createSierraContractClass(contract) {
  const result = { ...contract };
  delete result.sierra_program_debug_info;
  result.abi = formatSpaces(stringify2(contract.abi));
  result.sierra_program = formatSpaces(stringify2(contract.sierra_program));
  result.sierra_program = compressProgram(result.sierra_program);
  return result;
}
function parseContract(contract) {
  const parsedContract = typeof contract === "string" ? parse2(contract) : contract;
  if (!isSierra(contract)) {
    return {
      ...parsedContract,
      ..."program" in parsedContract && { program: compressProgram(parsedContract.program) }
    };
  }
  return createSierraContractClass(parsedContract);
}

// src/utils/responseParser/rpc.ts
var RPCResponseParser = class {
  parseGetBlockResponse(res) {
    return {
      timestamp: res.timestamp,
      block_hash: res.block_hash,
      block_number: res.block_number,
      new_root: res.new_root,
      parent_hash: res.parent_hash,
      status: res.status,
      transactions: res.transactions
    };
  }
  parseGetTransactionResponse(res) {
    return {
      calldata: res.calldata || [],
      contract_address: res.contract_address,
      sender_address: res.contract_address,
      max_fee: res.max_fee,
      nonce: res.nonce,
      signature: res.signature || [],
      transaction_hash: res.transaction_hash,
      version: res.version
    };
  }
  parseFeeEstimateResponse(res) {
    return {
      overall_fee: toBigInt(res[0].overall_fee),
      gas_consumed: toBigInt(res[0].gas_consumed),
      gas_price: toBigInt(res[0].gas_price)
    };
  }
  parseFeeEstimateBulkResponse(res) {
    return res.map((val) => ({
      overall_fee: toBigInt(val.overall_fee),
      gas_consumed: toBigInt(val.gas_consumed),
      gas_price: toBigInt(val.gas_price)
    }));
  }
  parseCallContractResponse(res) {
    return {
      result: res
    };
  }
  parseSimulateTransactionResponse(res) {
    return res.map((it) => {
      return {
        ...it,
        suggestedMaxFee: estimatedFeeToMaxFee(BigInt(it.fee_estimation.overall_fee))
      };
    });
  }
  parseContractClassResponse(res) {
    return {
      ...res,
      abi: typeof res.abi === "string" ? JSON.parse(res.abi) : res.abi
    };
  }
};

// src/provider/errors.ts
function fixStack(target, fn = target.constructor) {
  const { captureStackTrace } = Error;
  captureStackTrace && captureStackTrace(target, fn);
}
function fixProto(target, prototype) {
  const { setPrototypeOf } = Object;
  setPrototypeOf ? setPrototypeOf(target, prototype) : target.__proto__ = prototype;
}
var CustomError = class extends Error {
  constructor(message) {
    super(message);
    Object.defineProperty(this, "name", {
      value: new.target.name,
      enumerable: false,
      configurable: true
    });
    fixProto(this, new.target.prototype);
    fixStack(this);
  }
};
var LibraryError = class extends CustomError {
};
var GatewayError = class extends LibraryError {
  constructor(message, errorCode) {
    super(message);
    this.errorCode = errorCode;
  }
};
var HttpError = class extends LibraryError {
  constructor(message, errorCode) {
    super(message);
    this.errorCode = errorCode;
  }
};

// src/utils/starknetId.ts
var starknetId_exports = {};
__export(starknetId_exports, {
  StarknetIdContract: () => StarknetIdContract,
  getStarknetIdContract: () => getStarknetIdContract,
  useDecoded: () => useDecoded,
  useEncoded: () => useEncoded
});
var basicAlphabet = "abcdefghijklmnopqrstuvwxyz0123456789-";
var basicSizePlusOne = BigInt(basicAlphabet.length + 1);
var bigAlphabet = "\u8FD9\u6765";
var basicAlphabetSize = BigInt(basicAlphabet.length);
var bigAlphabetSize = BigInt(bigAlphabet.length);
var bigAlphabetSizePlusOne = BigInt(bigAlphabet.length + 1);
function extractStars(str) {
  let k = 0;
  while (str.endsWith(bigAlphabet[bigAlphabet.length - 1])) {
    str = str.substring(0, str.length - 1);
    k += 1;
  }
  return [str, k];
}
function useDecoded(encoded) {
  let decoded = "";
  encoded.forEach((subdomain) => {
    while (subdomain !== ZERO) {
      const code = subdomain % basicSizePlusOne;
      subdomain /= basicSizePlusOne;
      if (code === BigInt(basicAlphabet.length)) {
        const nextSubdomain = subdomain / bigAlphabetSizePlusOne;
        if (nextSubdomain === ZERO) {
          const code2 = subdomain % bigAlphabetSizePlusOne;
          subdomain = nextSubdomain;
          if (code2 === ZERO)
            decoded += basicAlphabet[0];
          else
            decoded += bigAlphabet[Number(code2) - 1];
        } else {
          const code2 = subdomain % bigAlphabetSize;
          decoded += bigAlphabet[Number(code2)];
          subdomain /= bigAlphabetSize;
        }
      } else
        decoded += basicAlphabet[Number(code)];
    }
    const [str, k] = extractStars(decoded);
    if (k)
      decoded = str + (k % 2 === 0 ? bigAlphabet[bigAlphabet.length - 1].repeat(k / 2 - 1) + bigAlphabet[0] + basicAlphabet[1] : bigAlphabet[bigAlphabet.length - 1].repeat((k - 1) / 2 + 1));
    decoded += ".";
  });
  if (!decoded) {
    return decoded;
  }
  return decoded.concat("stark");
}
function useEncoded(decoded) {
  let encoded = BigInt(0);
  let multiplier = BigInt(1);
  if (decoded.endsWith(bigAlphabet[0] + basicAlphabet[1])) {
    const [str, k] = extractStars(decoded.substring(0, decoded.length - 2));
    decoded = str + bigAlphabet[bigAlphabet.length - 1].repeat(2 * (k + 1));
  } else {
    const [str, k] = extractStars(decoded);
    if (k)
      decoded = str + bigAlphabet[bigAlphabet.length - 1].repeat(1 + 2 * (k - 1));
  }
  for (let i = 0; i < decoded.length; i += 1) {
    const char = decoded[i];
    const index = basicAlphabet.indexOf(char);
    const bnIndex = BigInt(basicAlphabet.indexOf(char));
    if (index !== -1) {
      if (i === decoded.length - 1 && decoded[i] === basicAlphabet[0]) {
        encoded += multiplier * basicAlphabetSize;
        multiplier *= basicSizePlusOne;
        multiplier *= basicSizePlusOne;
      } else {
        encoded += multiplier * bnIndex;
        multiplier *= basicSizePlusOne;
      }
    } else if (bigAlphabet.indexOf(char) !== -1) {
      encoded += multiplier * basicAlphabetSize;
      multiplier *= basicSizePlusOne;
      const newid = (i === decoded.length - 1 ? 1 : 0) + bigAlphabet.indexOf(char);
      encoded += multiplier * BigInt(newid);
      multiplier *= bigAlphabetSize;
    }
  }
  return encoded;
}
var StarknetIdContract = /* @__PURE__ */ ((StarknetIdContract2) => {
  StarknetIdContract2["MAINNET"] = "0x6ac597f8116f886fa1c97a23fa4e08299975ecaf6b598873ca6792b9bbfb678";
  StarknetIdContract2["TESTNET"] = "0x3bab268e932d2cecd1946f100ae67ce3dff9fd234119ea2f6da57d16d29fce";
  return StarknetIdContract2;
})(StarknetIdContract || {});
function getStarknetIdContract(chainId) {
  switch (chainId) {
    case "0x534e5f4d41494e" /* SN_MAIN */:
      return "0x6ac597f8116f886fa1c97a23fa4e08299975ecaf6b598873ca6792b9bbfb678" /* MAINNET */;
    case "0x534e5f474f45524c49" /* SN_GOERLI */:
      return "0x3bab268e932d2cecd1946f100ae67ce3dff9fd234119ea2f6da57d16d29fce" /* TESTNET */;
    default:
      throw new Error("Starknet.id is not yet deployed on this network");
  }
}

// src/provider/starknetId.ts
async function getStarkName(provider, address, StarknetIdContract2) {
  const chainId = await provider.getChainId();
  const contract = StarknetIdContract2 ?? getStarknetIdContract(chainId);
  try {
    const hexDomain = await provider.callContract({
      contractAddress: contract,
      entrypoint: "address_to_domain",
      calldata: CallData.compile({
        address
      })
    });
    const decimalDomain = hexDomain.result.map((element) => BigInt(element)).slice(1);
    const stringDomain = useDecoded(decimalDomain);
    if (!stringDomain) {
      throw Error("Starkname not found");
    }
    return stringDomain;
  } catch (e) {
    if (e instanceof Error && e.message === "Starkname not found") {
      throw e;
    }
    throw Error("Could not get stark name");
  }
}
async function getAddressFromStarkName(provider, name, StarknetIdContract2) {
  const chainId = await provider.getChainId();
  const contract = StarknetIdContract2 ?? getStarknetIdContract(chainId);
  try {
    const addressData = await provider.callContract({
      contractAddress: contract,
      entrypoint: "domain_to_address",
      calldata: CallData.compile({
        domain: [useEncoded(name.replace(".stark", "")).toString(10)]
      })
    });
    return addressData.result[0];
  } catch {
    throw Error("Could not get address from stark name");
  }
}

// src/provider/utils.ts
var validBlockTags = Object.values(BlockTag);
var Block = class {
  constructor(_identifier) {
    this.hash = null;
    this.number = null;
    this.tag = null;
    this.valueOf = () => this.number;
    this.toString = () => this.hash;
    this.setIdentifier(_identifier);
  }
  setIdentifier(__identifier) {
    if (typeof __identifier === "string" && isHex(__identifier)) {
      this.hash = __identifier;
    } else if (typeof __identifier === "bigint") {
      this.hash = toHex(__identifier);
    } else if (typeof __identifier === "number") {
      this.number = __identifier;
    } else if (typeof __identifier === "string" && validBlockTags.includes(__identifier)) {
      this.tag = __identifier;
    } else {
      this.tag = "pending" /* pending */;
    }
  }
  // TODO: fix any
  get queryIdentifier() {
    if (this.number !== null) {
      return `blockNumber=${this.number}`;
    }
    if (this.hash !== null) {
      return `blockHash=${this.hash}`;
    }
    return `blockNumber=${this.tag}`;
  }
  // TODO: fix any
  get identifier() {
    if (this.number !== null) {
      return { block_number: this.number };
    }
    if (this.hash !== null) {
      return { block_hash: this.hash };
    }
    return this.tag;
  }
  set identifier(_identifier) {
    this.setIdentifier(_identifier);
  }
  get sequencerIdentifier() {
    return this.hash !== null ? { blockHash: this.hash } : { blockNumber: this.number ?? this.tag };
  }
};

// src/provider/rpc.ts
var defaultOptions = {
  headers: { "Content-Type": "application/json" },
  blockIdentifier: "pending" /* pending */,
  retries: 200
};
var RpcProvider = class {
  constructor(optionsOrProvider) {
    this.responseParser = new RPCResponseParser();
    const { nodeUrl, retries, headers, blockIdentifier, chainId } = optionsOrProvider;
    this.nodeUrl = nodeUrl;
    this.retries = retries || defaultOptions.retries;
    this.headers = { ...defaultOptions.headers, ...headers };
    this.blockIdentifier = blockIdentifier || defaultOptions.blockIdentifier;
    this.chainId = chainId;
    this.getChainId();
  }
  fetch(method, params) {
    const body = stringify2({ method, jsonrpc: "2.0", params, id: 0 });
    return fetchPonyfill_default(this.nodeUrl, {
      method: "POST",
      body,
      headers: this.headers
    });
  }
  errorHandler(error) {
    if (error) {
      const { code, message } = error;
      throw new LibraryError(`${code}: ${message}`);
    }
  }
  async fetchEndpoint(method, params) {
    try {
      const rawResult = await this.fetch(method, params);
      const { error, result } = await rawResult.json();
      this.errorHandler(error);
      return result;
    } catch (error) {
      this.errorHandler(error?.response?.data);
      throw error;
    }
  }
  // Methods from Interface
  async getChainId() {
    this.chainId ?? (this.chainId = await this.fetchEndpoint("starknet_chainId"));
    return this.chainId;
  }
  async getBlock(blockIdentifier = this.blockIdentifier) {
    return this.getBlockWithTxHashes(blockIdentifier).then(
      this.responseParser.parseGetBlockResponse
    );
  }
  async getBlockHashAndNumber() {
    return this.fetchEndpoint("starknet_blockHashAndNumber");
  }
  async getBlockWithTxHashes(blockIdentifier = this.blockIdentifier) {
    const block_id = new Block(blockIdentifier).identifier;
    return this.fetchEndpoint("starknet_getBlockWithTxHashes", { block_id });
  }
  async getBlockWithTxs(blockIdentifier = this.blockIdentifier) {
    const block_id = new Block(blockIdentifier).identifier;
    return this.fetchEndpoint("starknet_getBlockWithTxs", { block_id });
  }
  async getClassHashAt(contractAddress, blockIdentifier = this.blockIdentifier) {
    const block_id = new Block(blockIdentifier).identifier;
    return this.fetchEndpoint("starknet_getClassHashAt", {
      block_id,
      contract_address: contractAddress
    });
  }
  async getNonceForAddress(contractAddress, blockIdentifier = this.blockIdentifier) {
    const block_id = new Block(blockIdentifier).identifier;
    return this.fetchEndpoint("starknet_getNonce", {
      contract_address: contractAddress,
      block_id
    });
  }
  async getPendingTransactions() {
    return this.fetchEndpoint("starknet_pendingTransactions");
  }
  async getProtocolVersion() {
    throw new Error("Pathfinder does not implement this rpc 0.1.0 method");
  }
  async getStateUpdate(blockIdentifier = this.blockIdentifier) {
    const block_id = new Block(blockIdentifier).identifier;
    return this.fetchEndpoint("starknet_getStateUpdate", { block_id });
  }
  async getStorageAt(contractAddress, key, blockIdentifier = this.blockIdentifier) {
    const parsedKey = toStorageKey(key);
    const block_id = new Block(blockIdentifier).identifier;
    return this.fetchEndpoint("starknet_getStorageAt", {
      contract_address: contractAddress,
      key: parsedKey,
      block_id
    });
  }
  // Methods from Interface
  async getTransaction(txHash) {
    return this.getTransactionByHash(txHash).then(this.responseParser.parseGetTransactionResponse);
  }
  async getTransactionByHash(txHash) {
    return this.fetchEndpoint("starknet_getTransactionByHash", { transaction_hash: txHash });
  }
  async getTransactionByBlockIdAndIndex(blockIdentifier, index) {
    const block_id = new Block(blockIdentifier).identifier;
    return this.fetchEndpoint("starknet_getTransactionByBlockIdAndIndex", { block_id, index });
  }
  async getTransactionReceipt(txHash) {
    return this.fetchEndpoint("starknet_getTransactionReceipt", { transaction_hash: txHash });
  }
  async getClassByHash(classHash) {
    return this.getClass(classHash);
  }
  async getClass(classHash, blockIdentifier = this.blockIdentifier) {
    const block_id = new Block(blockIdentifier).identifier;
    return this.fetchEndpoint("starknet_getClass", {
      class_hash: classHash,
      block_id
    }).then(this.responseParser.parseContractClassResponse);
  }
  async getClassAt(contractAddress, blockIdentifier = this.blockIdentifier) {
    const block_id = new Block(blockIdentifier).identifier;
    return this.fetchEndpoint("starknet_getClassAt", {
      block_id,
      contract_address: contractAddress
    }).then(this.responseParser.parseContractClassResponse);
  }
  async getCode(_contractAddress, _blockIdentifier) {
    throw new Error("RPC does not implement getCode function");
  }
  async getEstimateFee(invocation, invocationDetails, blockIdentifier = this.blockIdentifier) {
    return this.getInvokeEstimateFee(invocation, invocationDetails, blockIdentifier);
  }
  async getInvokeEstimateFee(invocation, invocationDetails, blockIdentifier = this.blockIdentifier) {
    const block_id = new Block(blockIdentifier).identifier;
    const transaction = this.buildTransaction(
      {
        type: "INVOKE_FUNCTION" /* INVOKE */,
        ...invocation,
        ...invocationDetails
      },
      "fee"
    );
    return this.fetchEndpoint("starknet_estimateFee", {
      request: [transaction],
      block_id
    }).then(this.responseParser.parseFeeEstimateResponse);
  }
  async getDeclareEstimateFee(invocation, details, blockIdentifier = this.blockIdentifier) {
    const block_id = new Block(blockIdentifier).identifier;
    const transaction = this.buildTransaction(
      {
        type: "DECLARE" /* DECLARE */,
        ...invocation,
        ...details
      },
      "fee"
    );
    return this.fetchEndpoint("starknet_estimateFee", {
      request: [transaction],
      block_id
    }).then(this.responseParser.parseFeeEstimateResponse);
  }
  async getDeployAccountEstimateFee(invocation, details, blockIdentifier = this.blockIdentifier) {
    const block_id = new Block(blockIdentifier).identifier;
    const transaction = this.buildTransaction(
      {
        type: "DEPLOY_ACCOUNT" /* DEPLOY_ACCOUNT */,
        ...invocation,
        ...details
      },
      "fee"
    );
    return this.fetchEndpoint("starknet_estimateFee", {
      request: [transaction],
      block_id
    }).then(this.responseParser.parseFeeEstimateResponse);
  }
  async getEstimateFeeBulk(invocations, { blockIdentifier = this.blockIdentifier, skipValidate = false }) {
    if (skipValidate) {
      console.warn("getEstimateFeeBulk RPC does not support skipValidate");
    }
    const block_id = new Block(blockIdentifier).identifier;
    return this.fetchEndpoint("starknet_estimateFee", {
      request: invocations.map((it) => this.buildTransaction(it, "fee")),
      block_id
    }).then(this.responseParser.parseFeeEstimateBulkResponse);
  }
  async declareContract({ contract, signature, senderAddress, compiledClassHash }, details) {
    if (!isSierra(contract)) {
      return this.fetchEndpoint("starknet_addDeclareTransaction", {
        declare_transaction: {
          type: rpc_exports.TransactionType.DECLARE,
          contract_class: {
            program: contract.program,
            entry_points_by_type: contract.entry_points_by_type,
            abi: contract.abi
          },
          version: HEX_STR_TRANSACTION_VERSION_1,
          max_fee: toHex(details.maxFee || 0),
          signature: signatureToHexArray(signature),
          sender_address: senderAddress,
          nonce: toHex(details.nonce)
        }
      });
    }
    return this.fetchEndpoint("starknet_addDeclareTransaction", {
      declare_transaction: {
        type: rpc_exports.TransactionType.DECLARE,
        contract_class: {
          sierra_program: decompressProgram(contract.sierra_program),
          contract_class_version: contract.contract_class_version,
          entry_points_by_type: contract.entry_points_by_type,
          abi: contract.abi
        },
        compiled_class_hash: compiledClassHash || "",
        version: HEX_STR_TRANSACTION_VERSION_2,
        max_fee: toHex(details.maxFee || 0),
        signature: signatureToHexArray(signature),
        sender_address: senderAddress,
        nonce: toHex(details.nonce)
      }
    });
  }
  async deployAccountContract({ classHash, constructorCalldata, addressSalt, signature }, details) {
    return this.fetchEndpoint("starknet_addDeployAccountTransaction", {
      deploy_account_transaction: {
        constructor_calldata: CallData.toHex(constructorCalldata || []),
        class_hash: toHex(classHash),
        contract_address_salt: toHex(addressSalt || 0),
        type: rpc_exports.TransactionType.DEPLOY_ACCOUNT,
        max_fee: toHex(details.maxFee || 0),
        version: toHex(details.version || 0),
        signature: signatureToHexArray(signature),
        nonce: toHex(details.nonce)
      }
    });
  }
  async invokeFunction(functionInvocation, details) {
    return this.fetchEndpoint("starknet_addInvokeTransaction", {
      invoke_transaction: {
        sender_address: functionInvocation.contractAddress,
        calldata: CallData.toHex(functionInvocation.calldata),
        type: rpc_exports.TransactionType.INVOKE,
        max_fee: toHex(details.maxFee || 0),
        version: "0x1",
        signature: signatureToHexArray(functionInvocation.signature),
        nonce: toHex(details.nonce)
      }
    });
  }
  // Methods from Interface
  async callContract(call, blockIdentifier = this.blockIdentifier) {
    const block_id = new Block(blockIdentifier).identifier;
    const result = await this.fetchEndpoint("starknet_call", {
      request: {
        contract_address: call.contractAddress,
        entry_point_selector: getSelectorFromName(call.entrypoint),
        calldata: CallData.toHex(call.calldata)
      },
      block_id
    });
    return this.responseParser.parseCallContractResponse(result);
  }
  async traceTransaction(transactionHash) {
    return this.fetchEndpoint("starknet_traceTransaction", { transaction_hash: transactionHash });
  }
  async traceBlockTransactions(blockHash) {
    return this.fetchEndpoint("starknet_traceBlockTransactions", { block_hash: blockHash });
  }
  async waitForTransaction(txHash, options) {
    let { retries } = this;
    let onchain = false;
    let isErrorState = false;
    let txReceipt = {};
    const retryInterval = options?.retryInterval ?? 5e3;
    const errorStates = options?.errorStates ?? [TransactionExecutionStatus2.REVERTED];
    const successStates = options?.successStates ?? [
      TransactionExecutionStatus2.SUCCEEDED,
      TransactionFinalityStatus2.ACCEPTED_ON_L1,
      TransactionFinalityStatus2.ACCEPTED_ON_L2
    ];
    while (!onchain) {
      await wait(retryInterval);
      try {
        txReceipt = await this.getTransactionReceipt(txHash);
        const executionStatus = pascalToSnake(txReceipt.execution_status);
        const finalityStatus = pascalToSnake(txReceipt.finality_status);
        if (!executionStatus || !finalityStatus) {
          const error = new Error("waiting for transaction status");
          throw error;
        }
        if (successStates.includes(executionStatus) || successStates.includes(finalityStatus)) {
          onchain = true;
        } else if (errorStates.includes(executionStatus) || errorStates.includes(finalityStatus)) {
          const message = `${executionStatus}: ${finalityStatus}: ${txReceipt.revert_reason}`;
          const error = new Error(message);
          error.response = txReceipt;
          isErrorState = true;
          throw error;
        }
      } catch (error) {
        if (error instanceof Error && isErrorState) {
          throw error;
        }
        if (retries === 0) {
          throw new Error(`waitForTransaction timed-out with retries ${this.retries}`);
        }
      }
      retries -= 1;
    }
    await wait(retryInterval);
    return txReceipt;
  }
  /**
   * Gets the transaction count from a block.
   *
   *
   * @param blockIdentifier
   * @returns Number of transactions
   */
  async getTransactionCount(blockIdentifier = this.blockIdentifier) {
    const block_id = new Block(blockIdentifier).identifier;
    return this.fetchEndpoint("starknet_getBlockTransactionCount", { block_id });
  }
  /**
   * Gets the latest block number
   *
   *
   * @returns Number of the latest block
   */
  async getBlockNumber() {
    return this.fetchEndpoint("starknet_blockNumber");
  }
  /**
   * Gets syncing status of the node
   *
   *
   * @returns Object with the stats data
   */
  async getSyncingStats() {
    return this.fetchEndpoint("starknet_syncing");
  }
  /**
   * Gets all the events filtered
   *
   *
   * @returns events and the pagination of the events
   */
  async getEvents(eventFilter) {
    return this.fetchEndpoint("starknet_getEvents", { filter: eventFilter });
  }
  async getSimulateTransaction(invocations, {
    blockIdentifier = this.blockIdentifier,
    skipValidate = false,
    skipExecute = false,
    // @deprecated
    skipFeeCharge = true
    // Pathfinder currently does not support `starknet_simulateTransactions` without `SKIP_FEE_CHARGE` simulation flag being set. This will become supported in a future release
  }) {
    const block_id = new Block(blockIdentifier).identifier;
    const simulationFlags = [];
    if (skipValidate)
      simulationFlags.push(SimulationFlag.SKIP_VALIDATE);
    if (skipExecute || skipFeeCharge)
      simulationFlags.push(SimulationFlag.SKIP_FEE_CHARGE);
    return this.fetchEndpoint("starknet_simulateTransactions", {
      block_id,
      transactions: invocations.map((it) => this.buildTransaction(it)),
      simulation_flags: simulationFlags
    }).then(this.responseParser.parseSimulateTransactionResponse);
  }
  async getStarkName(address, StarknetIdContract2) {
    return getStarkName(this, address, StarknetIdContract2);
  }
  async getAddressFromStarkName(name, StarknetIdContract2) {
    return getAddressFromStarkName(this, name, StarknetIdContract2);
  }
  buildTransaction(invocation, versionType) {
    const defaultVersions = getVersionsByType(versionType);
    const details = {
      signature: signatureToHexArray(invocation.signature),
      nonce: toHex(invocation.nonce),
      max_fee: toHex(invocation.maxFee || 0)
    };
    if (invocation.type === "INVOKE_FUNCTION" /* INVOKE */) {
      return {
        type: rpc_exports.TransactionType.INVOKE,
        // Diff between sequencer and rpc invoke type
        sender_address: invocation.contractAddress,
        calldata: CallData.toHex(invocation.calldata),
        version: toHex(invocation.version || defaultVersions.v1),
        // HEX_STR_TRANSACTION_VERSION_1, // as any HOTFIX TODO: Resolve spec version
        ...details
      };
    }
    if (invocation.type === "DECLARE" /* DECLARE */) {
      if (!isSierra(invocation.contract)) {
        return {
          type: invocation.type,
          contract_class: invocation.contract,
          sender_address: invocation.senderAddress,
          version: toHex(invocation.version || defaultVersions.v1),
          // HEX_STR_TRANSACTION_VERSION_1, // as any HOTFIX TODO: Resolve spec version
          ...details
        };
      }
      return {
        // compiled_class_hash
        type: invocation.type,
        contract_class: {
          ...invocation.contract,
          sierra_program: decompressProgram(invocation.contract.sierra_program)
        },
        compiled_class_hash: invocation.compiledClassHash || "",
        sender_address: invocation.senderAddress,
        version: toHex(invocation.version || defaultVersions.v2),
        // HEX_STR_TRANSACTION_VERSION_2, // as any HOTFIX TODO: Resolve spec version
        ...details
      };
    }
    if (invocation.type === "DEPLOY_ACCOUNT" /* DEPLOY_ACCOUNT */) {
      return {
        type: invocation.type,
        constructor_calldata: CallData.toHex(invocation.constructorCalldata || []),
        class_hash: toHex(invocation.classHash),
        contract_address_salt: toHex(invocation.addressSalt || 0),
        version: toHex(invocation.version || defaultVersions.v1),
        ...details
      };
    }
    throw Error("RPC buildTransaction received unknown TransactionType");
  }
};

// src/provider/sequencer.ts
var import_url_join2 = __toESM(require("url-join"));

// src/utils/responseParser/index.ts
var ResponseParser = class {
};

// src/utils/responseParser/sequencer.ts
var SequencerAPIResponseParser = class extends ResponseParser {
  parseGetBlockResponse(res) {
    return {
      ...res,
      new_root: res.state_root,
      parent_hash: res.parent_block_hash,
      transactions: Object.values(res.transactions).map((value) => "transaction_hash" in value && value.transaction_hash).filter(Boolean)
    };
  }
  parseGetTransactionResponse(res) {
    if (res.status === "NOT_RECEIVED" /* NOT_RECEIVED */ && res.finality_status === "NOT_RECEIVED" /* NOT_RECEIVED */) {
      throw new LibraryError();
    }
    return {
      ...res,
      calldata: "calldata" in res.transaction ? res.transaction.calldata : [],
      contract_class: "contract_class" in res.transaction ? res.transaction.contract_class : void 0,
      entry_point_selector: "entry_point_selector" in res.transaction ? res.transaction.entry_point_selector : void 0,
      max_fee: "max_fee" in res.transaction ? res.transaction.max_fee : void 0,
      nonce: res.transaction.nonce,
      sender_address: "sender_address" in res.transaction ? res.transaction.sender_address : void 0,
      signature: "signature" in res.transaction ? res.transaction.signature : void 0,
      transaction_hash: "transaction_hash" in res.transaction ? res.transaction.transaction_hash : void 0,
      version: "version" in res.transaction ? res.transaction.version : void 0
    };
  }
  parseGetTransactionReceiptResponse(res) {
    return {
      ...res,
      messages_sent: res.l2_to_l1_messages,
      ..."revert_error" in res && { revert_reason: res.revert_error }
    };
  }
  parseFeeEstimateResponse(res) {
    if ("overall_fee" in res) {
      let gasInfo = {};
      try {
        gasInfo = {
          gas_consumed: toBigInt(res.gas_usage),
          gas_price: toBigInt(res.gas_price)
        };
      } catch {
      }
      return {
        overall_fee: toBigInt(res.overall_fee),
        ...gasInfo
      };
    }
    return {
      overall_fee: toBigInt(res.amount)
    };
  }
  parseFeeEstimateBulkResponse(res) {
    return [].concat(res).map((item) => {
      if ("overall_fee" in item) {
        let gasInfo = {};
        try {
          gasInfo = {
            gas_consumed: toBigInt(item.gas_usage),
            gas_price: toBigInt(item.gas_price)
          };
        } catch {
        }
        return {
          overall_fee: toBigInt(item.overall_fee),
          ...gasInfo
        };
      }
      return {
        overall_fee: toBigInt(item.amount)
      };
    });
  }
  parseSimulateTransactionResponse(res) {
    const suggestedMaxFee = "overall_fee" in res.fee_estimation ? res.fee_estimation.overall_fee : res.fee_estimation.amount;
    return [
      {
        transaction_trace: res.trace,
        fee_estimation: res.fee_estimation,
        suggestedMaxFee: estimatedFeeToMaxFee(BigInt(suggestedMaxFee))
      }
    ];
  }
  parseCallContractResponse(res) {
    return {
      result: res.result
    };
  }
  parseInvokeFunctionResponse(res) {
    return {
      transaction_hash: res.transaction_hash
    };
  }
  parseDeployContractResponse(res) {
    return {
      transaction_hash: res.transaction_hash,
      contract_address: res.address
    };
  }
  parseDeclareContractResponse(res) {
    return {
      transaction_hash: res.transaction_hash,
      class_hash: res.class_hash
    };
  }
  parseGetStateUpdateResponse(res) {
    const nonces = Object.entries(res.state_diff.nonces).map(([contract_address, nonce]) => ({
      contract_address,
      nonce
    }));
    const storage_diffs = Object.entries(res.state_diff.storage_diffs).map(
      ([address, storage_entries]) => ({ address, storage_entries })
    );
    return {
      ...res,
      state_diff: {
        ...res.state_diff,
        storage_diffs,
        nonces
      }
    };
  }
  parseContractClassResponse(res) {
    const response = isSierra(res) ? res : parseContract(res);
    return {
      ...response,
      abi: typeof response.abi === "string" ? JSON.parse(response.abi) : response.abi
    };
  }
};

// src/utils/url.ts
var import_url_join = __toESM(require("url-join"));
var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
var localhostDomainRE = /^localhost[:?\d]*(?:[^:?\d]\S*)?$/;
var nonLocalhostDomainRE = /^[^\s.]+\.\S{2,}$/;
function isUrl(s) {
  if (!s) {
    return false;
  }
  if (typeof s !== "string") {
    return false;
  }
  const match = s.match(protocolAndDomainRE);
  if (!match) {
    return false;
  }
  const everythingAfterProtocol = match[1];
  if (!everythingAfterProtocol) {
    return false;
  }
  if (localhostDomainRE.test(everythingAfterProtocol) || nonLocalhostDomainRE.test(everythingAfterProtocol)) {
    return true;
  }
  return false;
}
function buildUrl(baseUrl, defaultPath, urlOrPath) {
  return isUrl(urlOrPath) ? urlOrPath : (0, import_url_join.default)(baseUrl, urlOrPath ?? defaultPath);
}

// src/provider/sequencer.ts
function isEmptyQueryObject(obj) {
  return obj === void 0 || Object.keys(obj).length === 0 || Object.keys(obj).length === 1 && Object.entries(obj).every(([k, v]) => k === "blockIdentifier" && v === null);
}
var defaultOptions2 = {
  network: "SN_GOERLI2" /* SN_GOERLI2 */,
  blockIdentifier: "pending" /* pending */
};
var SequencerProvider = class {
  constructor(optionsOrProvider = defaultOptions2) {
    this.responseParser = new SequencerAPIResponseParser();
    if ("network" in optionsOrProvider) {
      this.baseUrl = SequencerProvider.getNetworkFromName(optionsOrProvider.network);
      this.feederGatewayUrl = buildUrl(this.baseUrl, "feeder_gateway");
      this.gatewayUrl = buildUrl(this.baseUrl, "gateway");
    } else {
      this.baseUrl = optionsOrProvider.baseUrl;
      this.feederGatewayUrl = buildUrl(
        this.baseUrl,
        "feeder_gateway",
        optionsOrProvider.feederGatewayUrl
      );
      this.gatewayUrl = buildUrl(this.baseUrl, "gateway", optionsOrProvider.gatewayUrl);
    }
    this.chainId = optionsOrProvider?.chainId ?? SequencerProvider.getChainIdFromBaseUrl(this.baseUrl);
    this.headers = optionsOrProvider.headers;
    this.blockIdentifier = optionsOrProvider?.blockIdentifier || defaultOptions2.blockIdentifier;
  }
  static getNetworkFromName(name) {
    switch (name) {
      case "SN_MAIN" /* SN_MAIN */:
      case "0x534e5f4d41494e" /* SN_MAIN */:
        return "https://alpha-mainnet.starknet.io" /* SN_MAIN */;
      case "SN_GOERLI" /* SN_GOERLI */:
      case "0x534e5f474f45524c49" /* SN_GOERLI */:
        return "https://alpha4.starknet.io" /* SN_GOERLI */;
      case "SN_GOERLI2" /* SN_GOERLI2 */:
      case "0x534e5f474f45524c4932" /* SN_GOERLI2 */:
        return "https://alpha4-2.starknet.io" /* SN_GOERLI2 */;
      default:
        throw new Error("Could not detect base url from NetworkName");
    }
  }
  static getChainIdFromBaseUrl(baseUrl) {
    try {
      const url = new URL(baseUrl);
      if (url.host.includes("mainnet.starknet.io")) {
        return "0x534e5f4d41494e" /* SN_MAIN */;
      }
      if (url.host.includes("alpha4-2.starknet.io")) {
        return "0x534e5f474f45524c4932" /* SN_GOERLI2 */;
      }
      return "0x534e5f474f45524c49" /* SN_GOERLI */;
    } catch {
      console.error(`Could not parse baseUrl: ${baseUrl}`);
      return "0x534e5f474f45524c49" /* SN_GOERLI */;
    }
  }
  getFetchUrl(endpoint) {
    const gatewayUrlEndpoints = ["add_transaction"];
    return gatewayUrlEndpoints.includes(endpoint) ? this.gatewayUrl : this.feederGatewayUrl;
  }
  getFetchMethod(endpoint) {
    const postMethodEndpoints = [
      "add_transaction",
      "call_contract",
      "estimate_fee",
      "estimate_message_fee",
      "estimate_fee_bulk",
      "simulate_transaction"
    ];
    return postMethodEndpoints.includes(endpoint) ? "POST" : "GET";
  }
  getQueryString(query) {
    if (isEmptyQueryObject(query)) {
      return "";
    }
    const queryString = Object.entries(query).map(([key, value]) => {
      if (key === "blockIdentifier") {
        const block = new Block(value);
        return `${block.queryIdentifier}`;
      }
      return `${key}=${value}`;
    }).join("&");
    return `?${queryString}`;
  }
  getHeaders(method) {
    if (method === "POST") {
      return {
        "Content-Type": "application/json",
        ...this.headers
      };
    }
    return this.headers;
  }
  // typesafe fetch
  async fetchEndpoint(endpoint, ...[query, request]) {
    const baseUrl = this.getFetchUrl(endpoint);
    const method = this.getFetchMethod(endpoint);
    const queryString = this.getQueryString(query);
    const url = (0, import_url_join2.default)(baseUrl, endpoint, queryString);
    return this.fetch(url, {
      method,
      body: request
    });
  }
  async fetch(endpoint, options) {
    const url = buildUrl(this.baseUrl, "", endpoint);
    const method = options?.method ?? "GET";
    const headers = this.getHeaders(method);
    const body = stringify2(options?.body);
    try {
      const response = await fetchPonyfill_default(url, {
        method,
        body,
        headers
      });
      const textResponse = await response.text();
      if (!response.ok) {
        let responseBody;
        try {
          responseBody = parse2(textResponse);
        } catch {
          throw new HttpError(response.statusText, response.status);
        }
        throw new GatewayError(responseBody.message, responseBody.code);
      }
      const parseChoice = options?.parseAlwaysAsBigInt ? parseAlwaysAsBig : parse2;
      return parseChoice(textResponse);
    } catch (error) {
      if (error instanceof Error && !(error instanceof LibraryError))
        throw Error(`Could not ${method} from endpoint \`${url}\`: ${error.message}`);
      throw error;
    }
  }
  async getChainId() {
    return Promise.resolve(this.chainId);
  }
  async callContract({ contractAddress, entrypoint: entryPointSelector, calldata = [] }, blockIdentifier = this.blockIdentifier) {
    return this.fetchEndpoint(
      "call_contract",
      { blockIdentifier },
      {
        // TODO - determine best choice once both are fully supported in devnet
        // signature: [],
        // sender_address: contractAddress,
        contract_address: contractAddress,
        entry_point_selector: getSelectorFromName(entryPointSelector),
        calldata: CallData.compile(calldata)
      }
    ).then(this.responseParser.parseCallContractResponse);
  }
  async getBlock(blockIdentifier = this.blockIdentifier) {
    return this.fetchEndpoint("get_block", { blockIdentifier }).then(
      this.responseParser.parseGetBlockResponse
    );
  }
  async getNonceForAddress(contractAddress, blockIdentifier = this.blockIdentifier) {
    return this.fetchEndpoint("get_nonce", { contractAddress, blockIdentifier });
  }
  async getStorageAt(contractAddress, key, blockIdentifier = this.blockIdentifier) {
    const parsedKey = toBigInt(key).toString(10);
    return this.fetchEndpoint("get_storage_at", {
      blockIdentifier,
      contractAddress,
      key: parsedKey
    });
  }
  async getTransaction(txHash) {
    const txHashHex = toHex(txHash);
    return this.fetchEndpoint("get_transaction", { transactionHash: txHashHex }).then((result) => {
      if (Object.values(result).length === 1)
        throw new LibraryError(result.status);
      return this.responseParser.parseGetTransactionResponse(result);
    });
  }
  async getTransactionReceipt(txHash) {
    const txHashHex = toHex(txHash);
    return this.fetchEndpoint("get_transaction_receipt", { transactionHash: txHashHex }).then(
      this.responseParser.parseGetTransactionReceiptResponse
    );
  }
  async getClassAt(contractAddress, blockIdentifier = this.blockIdentifier) {
    return this.fetchEndpoint("get_full_contract", { blockIdentifier, contractAddress }).then(
      this.responseParser.parseContractClassResponse
    );
  }
  async getClassHashAt(contractAddress, blockIdentifier = this.blockIdentifier) {
    return this.fetchEndpoint("get_class_hash_at", { blockIdentifier, contractAddress });
  }
  async getClassByHash(classHash, blockIdentifier = this.blockIdentifier) {
    return this.fetchEndpoint("get_class_by_hash", { classHash, blockIdentifier }).then(
      this.responseParser.parseContractClassResponse
    );
  }
  async getCompiledClassByClassHash(classHash, blockIdentifier = this.blockIdentifier) {
    return this.fetchEndpoint("get_compiled_class_by_class_hash", { classHash, blockIdentifier });
  }
  async invokeFunction(functionInvocation, details) {
    return this.fetchEndpoint("add_transaction", void 0, {
      type: "INVOKE_FUNCTION" /* INVOKE */,
      sender_address: functionInvocation.contractAddress,
      calldata: CallData.compile(functionInvocation.calldata ?? []),
      signature: signatureToDecimalArray(functionInvocation.signature),
      nonce: toHex(details.nonce),
      max_fee: toHex(details.maxFee || 0),
      version: "0x1"
    }).then(this.responseParser.parseInvokeFunctionResponse);
  }
  async deployAccountContract({ classHash, constructorCalldata, addressSalt, signature }, details) {
    return this.fetchEndpoint("add_transaction", void 0, {
      type: "DEPLOY_ACCOUNT" /* DEPLOY_ACCOUNT */,
      contract_address_salt: addressSalt ?? randomAddress(),
      constructor_calldata: CallData.compile(constructorCalldata ?? []),
      class_hash: toHex(classHash),
      max_fee: toHex(details.maxFee || 0),
      version: toHex(details.version || 0),
      nonce: toHex(details.nonce),
      signature: signatureToDecimalArray(signature)
    }).then(this.responseParser.parseDeployContractResponse);
  }
  async declareContract({ senderAddress, contract, signature, compiledClassHash }, details) {
    if (!isSierra(contract)) {
      return this.fetchEndpoint("add_transaction", void 0, {
        type: "DECLARE" /* DECLARE */,
        contract_class: contract,
        nonce: toHex(details.nonce),
        signature: signatureToDecimalArray(signature),
        sender_address: senderAddress,
        max_fee: toHex(details.maxFee || 0),
        version: toHex(transactionVersion)
      }).then(this.responseParser.parseDeclareContractResponse);
    }
    return this.fetchEndpoint("add_transaction", void 0, {
      type: "DECLARE" /* DECLARE */,
      sender_address: senderAddress,
      compiled_class_hash: compiledClassHash,
      contract_class: contract,
      nonce: toHex(details.nonce),
      signature: signatureToDecimalArray(signature),
      max_fee: toHex(details.maxFee || 0),
      version: toHex(transactionVersion_2)
    }).then(this.responseParser.parseDeclareContractResponse);
  }
  async getEstimateFee(invocation, invocationDetails, blockIdentifier = this.blockIdentifier, skipValidate = false) {
    return this.getInvokeEstimateFee(invocation, invocationDetails, blockIdentifier, skipValidate);
  }
  async getInvokeEstimateFee(invocation, invocationDetails, blockIdentifier = this.blockIdentifier, skipValidate = false) {
    const transaction = this.buildTransaction(
      {
        type: "INVOKE_FUNCTION" /* INVOKE */,
        ...invocation,
        ...invocationDetails
      },
      "fee"
    );
    return this.fetchEndpoint("estimate_fee", { blockIdentifier, skipValidate }, transaction).then(
      this.responseParser.parseFeeEstimateResponse
    );
  }
  async getDeclareEstimateFee(invocation, details, blockIdentifier = this.blockIdentifier, skipValidate = false) {
    const transaction = this.buildTransaction(
      {
        type: "DECLARE" /* DECLARE */,
        ...invocation,
        ...details
      },
      "fee"
    );
    return this.fetchEndpoint("estimate_fee", { blockIdentifier, skipValidate }, transaction).then(
      this.responseParser.parseFeeEstimateResponse
    );
  }
  async getDeployAccountEstimateFee(invocation, details, blockIdentifier = this.blockIdentifier, skipValidate = false) {
    const transaction = this.buildTransaction(
      {
        type: "DEPLOY_ACCOUNT" /* DEPLOY_ACCOUNT */,
        ...invocation,
        ...details
      },
      "fee"
    );
    return this.fetchEndpoint("estimate_fee", { blockIdentifier, skipValidate }, transaction).then(
      this.responseParser.parseFeeEstimateResponse
    );
  }
  async getEstimateFeeBulk(invocations, { blockIdentifier = this.blockIdentifier, skipValidate = false }) {
    const transactions = invocations.map((it) => this.buildTransaction(it, "fee"));
    return this.fetchEndpoint(
      "estimate_fee_bulk",
      { blockIdentifier, skipValidate },
      transactions
    ).then(this.responseParser.parseFeeEstimateBulkResponse);
  }
  async getCode(contractAddress, blockIdentifier = this.blockIdentifier) {
    return this.fetchEndpoint("get_code", { contractAddress, blockIdentifier });
  }
  async waitForTransaction(txHash, options) {
    let res;
    let completed = false;
    let retries = 0;
    const retryInterval = options?.retryInterval ?? 5e3;
    const errorStates = options?.errorStates ?? [
      "REJECTED" /* REJECTED */,
      "NOT_RECEIVED" /* NOT_RECEIVED */,
      "REVERTED" /* REVERTED */
    ];
    const successStates = options?.successStates ?? [
      "SUCCEEDED" /* SUCCEEDED */,
      "ACCEPTED_ON_L1" /* ACCEPTED_ON_L1 */,
      "ACCEPTED_ON_L2" /* ACCEPTED_ON_L2 */
    ];
    while (!completed) {
      await wait(retryInterval);
      res = await this.getTransactionStatus(txHash);
      if ("NOT_RECEIVED" /* NOT_RECEIVED */ === res.finality_status && retries < 3) {
        retries += 1;
      } else if (successStates.includes(res.finality_status) || successStates.includes(res.execution_status)) {
        completed = true;
      } else if (errorStates.includes(res.finality_status) || errorStates.includes(res.execution_status)) {
        let message;
        if (res.tx_failure_reason) {
          message = `${res.tx_status}: ${res.tx_failure_reason.code}
${res.tx_failure_reason.error_message}`;
        } else if (res.tx_revert_reason) {
          message = `${res.tx_status}: ${res.tx_revert_reason}`;
        } else {
          message = res.tx_status;
        }
        const error = new Error(message);
        error.response = res;
        throw error;
      }
    }
    const txReceipt = await this.getTransactionReceipt(txHash);
    return txReceipt;
  }
  /**
   * Gets the status of a transaction.
   * @param txHash BigNumberish
   * @returns GetTransactionStatusResponse - the transaction status object
   */
  async getTransactionStatus(txHash) {
    const txHashHex = toHex(txHash);
    return this.fetchEndpoint("get_transaction_status", { transactionHash: txHashHex });
  }
  /**
   * Gets the smart contract address on the goerli testnet.
   * @returns GetContractAddressesResponse - starknet smart contract addresses
   */
  async getContractAddresses() {
    return this.fetchEndpoint("get_contract_addresses");
  }
  /**
   * Gets the transaction trace from a tx id.
   * @param txHash BigNumberish
   * @returns TransactionTraceResponse - the transaction trace
   */
  async getTransactionTrace(txHash) {
    const txHashHex = toHex(txHash);
    return this.fetchEndpoint("get_transaction_trace", { transactionHash: txHashHex });
  }
  async estimateMessageFee({ from_address, to_address, entry_point_selector, payload }, blockIdentifier = this.blockIdentifier) {
    const validCallL1Handler = {
      from_address: getDecimalString(from_address),
      to_address: getHexString(to_address),
      entry_point_selector: getSelector(entry_point_selector),
      payload: getHexStringArray(payload)
    };
    return this.fetchEndpoint("estimate_message_fee", { blockIdentifier }, validCallL1Handler);
  }
  /**
   * Simulate transaction using Sequencer provider
   * WARNING!: Sequencer will process only first element from invocations array
   *
   * @param invocations Array of invocations, but only first invocation will be processed
   * @param blockIdentifier block identifier, default 'latest'
   * @param skipValidate Skip Account __validate__ method
   * @returns
   */
  async getSimulateTransaction(invocations, {
    blockIdentifier = this.blockIdentifier,
    skipValidate = false,
    skipExecute = false
  }) {
    if (invocations.length > 1) {
      console.warn("Sequencer simulate process only first element from invocations list");
    }
    if (skipExecute) {
      console.warn("Sequencer can't skip account __execute__");
    }
    const transaction = this.buildTransaction(invocations[0]);
    return this.fetchEndpoint(
      "simulate_transaction",
      {
        blockIdentifier,
        skipValidate: skipValidate ?? false
      },
      transaction
    ).then(this.responseParser.parseSimulateTransactionResponse);
  }
  async getStateUpdate(blockIdentifier = this.blockIdentifier) {
    const args = new Block(blockIdentifier).sequencerIdentifier;
    return this.fetchEndpoint("get_state_update", { ...args }).then(
      this.responseParser.parseGetStateUpdateResponse
    );
  }
  // consider adding an optional trace retrieval parameter to the getBlock method
  async getBlockTraces(blockIdentifier = this.blockIdentifier) {
    const args = new Block(blockIdentifier).sequencerIdentifier;
    return this.fetchEndpoint("get_block_traces", { ...args });
  }
  async getStarkName(address, StarknetIdContract2) {
    return getStarkName(this, address, StarknetIdContract2);
  }
  async getAddressFromStarkName(name, StarknetIdContract2) {
    return getAddressFromStarkName(this, name, StarknetIdContract2);
  }
  /**
   * Build Single AccountTransaction from Single AccountInvocation
   * @param invocation AccountInvocationItem
   * @param versionType 'fee' | 'transaction' - used to determine default versions
   * @returns AccountTransactionItem
   */
  buildTransaction(invocation, versionType) {
    const defaultVersions = getVersionsByType(versionType);
    const details = {
      signature: signatureToDecimalArray(invocation.signature),
      nonce: toHex(invocation.nonce)
    };
    if (invocation.type === "INVOKE_FUNCTION" /* INVOKE */) {
      return {
        type: invocation.type,
        sender_address: invocation.contractAddress,
        calldata: CallData.compile(invocation.calldata ?? []),
        version: toHex(invocation.version || defaultVersions.v1),
        ...details
      };
    }
    if (invocation.type === "DECLARE" /* DECLARE */) {
      if (!isSierra(invocation.contract)) {
        return {
          type: invocation.type,
          contract_class: invocation.contract,
          sender_address: invocation.senderAddress,
          version: toHex(invocation.version || defaultVersions.v1),
          // fee from getDeclareEstimateFee use t.v. instead of feet.v.
          ...details
        };
      }
      return {
        type: invocation.type,
        contract_class: invocation.contract,
        compiled_class_hash: invocation.compiledClassHash,
        sender_address: invocation.senderAddress,
        version: toHex(invocation.version || defaultVersions.v2),
        // fee on getDeclareEstimateFee use t.v. instead of feet.v.
        ...details
      };
    }
    if (invocation.type === "DEPLOY_ACCOUNT" /* DEPLOY_ACCOUNT */) {
      return {
        type: invocation.type,
        constructor_calldata: CallData.compile(invocation.constructorCalldata || []),
        class_hash: toHex(invocation.classHash),
        contract_address_salt: toHex(invocation.addressSalt || 0),
        version: toHex(invocation.version || defaultVersions.v1),
        ...details
      };
    }
    throw Error("Sequencer buildTransaction received unknown TransactionType");
  }
};

// src/provider/default.ts
var Provider = class {
  constructor(providerOrOptions) {
    if (providerOrOptions instanceof Provider) {
      this.provider = providerOrOptions.provider;
    } else if (providerOrOptions instanceof RpcProvider || providerOrOptions instanceof SequencerProvider) {
      this.provider = providerOrOptions;
    } else if (providerOrOptions && "rpc" in providerOrOptions) {
      this.provider = new RpcProvider(providerOrOptions.rpc);
    } else if (providerOrOptions && "sequencer" in providerOrOptions) {
      this.provider = new SequencerProvider(providerOrOptions.sequencer);
    } else {
      this.provider = new SequencerProvider();
    }
  }
  async getChainId() {
    return this.provider.getChainId();
  }
  async getBlock(blockIdentifier) {
    return this.provider.getBlock(blockIdentifier);
  }
  async getClassAt(contractAddress, blockIdentifier) {
    return this.provider.getClassAt(contractAddress, blockIdentifier);
  }
  async getClassHashAt(contractAddress, blockIdentifier) {
    return this.provider.getClassHashAt(contractAddress, blockIdentifier);
  }
  getClassByHash(classHash) {
    return this.provider.getClassByHash(classHash);
  }
  async getEstimateFee(invocationWithTxType, invocationDetails, blockIdentifier) {
    return this.provider.getEstimateFee(invocationWithTxType, invocationDetails, blockIdentifier);
  }
  async getInvokeEstimateFee(invocationWithTxType, invocationDetails, blockIdentifier, skipValidate) {
    return this.provider.getInvokeEstimateFee(
      invocationWithTxType,
      invocationDetails,
      blockIdentifier,
      skipValidate
    );
  }
  async getEstimateFeeBulk(invocations, options) {
    return this.provider.getEstimateFeeBulk(invocations, options);
  }
  async getNonceForAddress(contractAddress, blockIdentifier) {
    return this.provider.getNonceForAddress(contractAddress, blockIdentifier);
  }
  async getStorageAt(contractAddress, key, blockIdentifier) {
    return this.provider.getStorageAt(contractAddress, key, blockIdentifier);
  }
  async getTransaction(txHash) {
    return this.provider.getTransaction(txHash);
  }
  async getTransactionReceipt(txHash) {
    return this.provider.getTransactionReceipt(txHash);
  }
  async callContract(request, blockIdentifier) {
    return this.provider.callContract(request, blockIdentifier);
  }
  async invokeFunction(functionInvocation, details) {
    return this.provider.invokeFunction(functionInvocation, details);
  }
  async deployAccountContract(payload, details) {
    return this.provider.deployAccountContract(payload, details);
  }
  async declareContract(transaction, details) {
    return this.provider.declareContract(transaction, details);
  }
  async getDeclareEstimateFee(transaction, details, blockIdentifier, skipValidate) {
    return this.provider.getDeclareEstimateFee(transaction, details, blockIdentifier, skipValidate);
  }
  getDeployAccountEstimateFee(transaction, details, blockIdentifier, skipValidate) {
    return this.provider.getDeployAccountEstimateFee(
      transaction,
      details,
      blockIdentifier,
      skipValidate
    );
  }
  async getCode(contractAddress, blockIdentifier) {
    return this.provider.getCode(contractAddress, blockIdentifier);
  }
  async waitForTransaction(txHash, options) {
    return this.provider.waitForTransaction(txHash, options);
  }
  async getSimulateTransaction(invocations, options) {
    return this.provider.getSimulateTransaction(invocations, options);
  }
  async getStateUpdate(blockIdentifier) {
    return this.provider.getStateUpdate(blockIdentifier);
  }
  async getStarkName(address, StarknetIdContract2) {
    return getStarkName(this, address, StarknetIdContract2);
  }
  async getAddressFromStarkName(name, StarknetIdContract2) {
    return getAddressFromStarkName(this, name, StarknetIdContract2);
  }
};

// src/signer/interface.ts
var SignerInterface = class {
};

// src/utils/transaction.ts
var transaction_exports = {};
__export(transaction_exports, {
  fromCallsToExecuteCalldata: () => fromCallsToExecuteCalldata,
  fromCallsToExecuteCalldataWithNonce: () => fromCallsToExecuteCalldataWithNonce,
  fromCallsToExecuteCalldata_cairo1: () => fromCallsToExecuteCalldata_cairo1,
  getExecuteCalldata: () => getExecuteCalldata,
  transformCallsToMulticallArrays: () => transformCallsToMulticallArrays,
  transformCallsToMulticallArrays_cairo1: () => transformCallsToMulticallArrays_cairo1
});
var transformCallsToMulticallArrays = (calls) => {
  const callArray = [];
  const calldata = [];
  calls.forEach((call) => {
    const data = CallData.compile(call.calldata || []);
    callArray.push({
      to: toBigInt(call.contractAddress).toString(10),
      selector: toBigInt(getSelectorFromName(call.entrypoint)).toString(10),
      data_offset: calldata.length.toString(),
      data_len: data.length.toString()
    });
    calldata.push(...data);
  });
  return {
    callArray,
    calldata: CallData.compile({ calldata })
  };
};
var fromCallsToExecuteCalldata = (calls) => {
  const { callArray, calldata } = transformCallsToMulticallArrays(calls);
  const compiledCalls = CallData.compile({ callArray });
  return [...compiledCalls, ...calldata];
};
var fromCallsToExecuteCalldataWithNonce = (calls, nonce) => {
  return [...fromCallsToExecuteCalldata(calls), toBigInt(nonce).toString()];
};
var transformCallsToMulticallArrays_cairo1 = (calls) => {
  const callArray = calls.map((call) => ({
    to: toBigInt(call.contractAddress).toString(10),
    selector: toBigInt(getSelectorFromName(call.entrypoint)).toString(10),
    calldata: CallData.compile(call.calldata || [])
  }));
  return callArray;
};
var fromCallsToExecuteCalldata_cairo1 = (calls) => {
  const orderCalls = calls.map((call) => ({
    contractAddress: call.contractAddress,
    entrypoint: call.entrypoint,
    calldata: call.calldata
  }));
  return CallData.compile({ orderCalls });
};
var getExecuteCalldata = (calls, cairoVersion = "0") => {
  if (cairoVersion === "1") {
    return fromCallsToExecuteCalldata_cairo1(calls);
  }
  return fromCallsToExecuteCalldata(calls);
};

// src/utils/typedData.ts
var typedData_exports = {};
__export(typedData_exports, {
  encodeData: () => encodeData,
  encodeType: () => encodeType,
  encodeValue: () => encodeValue,
  getDependencies: () => getDependencies,
  getMessageHash: () => getMessageHash,
  getStructHash: () => getStructHash,
  getTypeHash: () => getTypeHash,
  isMerkleTreeType: () => isMerkleTreeType,
  prepareSelector: () => prepareSelector
});

// src/utils/merkle.ts
var merkle_exports = {};
__export(merkle_exports, {
  MerkleTree: () => MerkleTree,
  proofMerklePath: () => proofMerklePath
});
var MerkleTree = class {
  constructor(leafHashes) {
    this.branches = [];
    this.leaves = leafHashes;
    this.root = this.build(leafHashes);
  }
  /**
   * Create Merkle tree
   * @param leaves hex-string array
   * @returns format: hex-string; Merkle tree root
   */
  build(leaves) {
    if (leaves.length === 1) {
      return leaves[0];
    }
    if (leaves.length !== this.leaves.length) {
      this.branches.push(leaves);
    }
    const newLeaves = [];
    for (let i = 0; i < leaves.length; i += 2) {
      if (i + 1 === leaves.length) {
        newLeaves.push(MerkleTree.hash(leaves[i], "0x0"));
      } else {
        newLeaves.push(MerkleTree.hash(leaves[i], leaves[i + 1]));
      }
    }
    return this.build(newLeaves);
  }
  /**
   * Create pedersen hash from a and b
   * @returns format: hex-string
   */
  static hash(a, b) {
    const [aSorted, bSorted] = [toBigInt(a), toBigInt(b)].sort((x, y) => x >= y ? 1 : -1);
    return starkCurve.pedersen(aSorted, bSorted);
  }
  /**
   * Return path to leaf
   * @param leaf hex-string
   * @param branch hex-string array
   * @param hashPath hex-string array
   * @returns format: hex-string array
   */
  getProof(leaf, branch = this.leaves, hashPath = []) {
    const index = branch.indexOf(leaf);
    if (index === -1) {
      throw new Error("leaf not found");
    }
    if (branch.length === 1) {
      return hashPath;
    }
    const isLeft = index % 2 === 0;
    const neededBranch = (isLeft ? branch[index + 1] : branch[index - 1]) ?? "0x0";
    const newHashPath = [...hashPath, neededBranch];
    const currentBranchLevelIndex = this.leaves.length === branch.length ? -1 : this.branches.findIndex((b) => b.length === branch.length);
    const nextBranch = this.branches[currentBranchLevelIndex + 1] ?? [this.root];
    return this.getProof(
      MerkleTree.hash(isLeft ? leaf : neededBranch, isLeft ? neededBranch : leaf),
      nextBranch,
      newHashPath
    );
  }
};
function proofMerklePath(root, leaf, path) {
  if (path.length === 0) {
    return root === leaf;
  }
  const [next, ...rest] = path;
  return proofMerklePath(root, MerkleTree.hash(leaf, next), rest);
}

// src/utils/typedData.ts
function getHex(value) {
  try {
    return toHex(value);
  } catch (e) {
    if (typeof value === "string") {
      return toHex(encodeShortString(value));
    }
    throw new Error(`Invalid BigNumberish: ${value}`);
  }
}
var validateTypedData = (data) => {
  const typedData = data;
  const valid = Boolean(typedData.types && typedData.primaryType && typedData.message);
  return valid;
};
function prepareSelector(selector) {
  return isHex(selector) ? selector : getSelectorFromName(selector);
}
function isMerkleTreeType(type) {
  return type.type === "merkletree";
}
var getDependencies = (types, type, dependencies = []) => {
  if (type[type.length - 1] === "*") {
    type = type.slice(0, -1);
  }
  if (dependencies.includes(type)) {
    return dependencies;
  }
  if (!types[type]) {
    return dependencies;
  }
  return [
    type,
    ...types[type].reduce(
      (previous, t) => [
        ...previous,
        ...getDependencies(types, t.type, previous).filter(
          (dependency) => !previous.includes(dependency)
        )
      ],
      []
    )
  ];
};
function getMerkleTreeType(types, ctx) {
  if (ctx.parent && ctx.key) {
    const parentType = types[ctx.parent];
    const merkleType = parentType.find((t) => t.name === ctx.key);
    const isMerkleTree = isMerkleTreeType(merkleType);
    if (!isMerkleTree) {
      throw new Error(`${ctx.key} is not a merkle tree`);
    }
    if (merkleType.contains.endsWith("*")) {
      throw new Error(`Merkle tree contain property must not be an array but was given ${ctx.key}`);
    }
    return merkleType.contains;
  }
  return "raw";
}
var encodeType = (types, type) => {
  const [primary, ...dependencies] = getDependencies(types, type);
  const newTypes = !primary ? [] : [primary, ...dependencies.sort()];
  return newTypes.map((dependency) => {
    return `${dependency}(${types[dependency].map((t) => `${t.name}:${t.type}`)})`;
  }).join("");
};
var getTypeHash = (types, type) => {
  return getSelectorFromName(encodeType(types, type));
};
var encodeValue = (types, type, data, ctx = {}) => {
  if (types[type]) {
    return [type, getStructHash(types, type, data)];
  }
  if (Object.keys(types).map((x) => `${x}*`).includes(type)) {
    const structHashes = data.map((struct) => {
      return getStructHash(types, type.slice(0, -1), struct);
    });
    return [type, computeHashOnElements(structHashes)];
  }
  if (type === "merkletree") {
    const merkleTreeType = getMerkleTreeType(types, ctx);
    const structHashes = data.map((struct) => {
      return encodeValue(types, merkleTreeType, struct)[1];
    });
    const { root } = new MerkleTree(structHashes);
    return ["felt", root];
  }
  if (type === "felt*") {
    return ["felt*", computeHashOnElements(data)];
  }
  if (type === "selector") {
    return ["felt", prepareSelector(data)];
  }
  return [type, getHex(data)];
};
var encodeData = (types, type, data) => {
  const [returnTypes, values] = types[type].reduce(
    ([ts, vs], field) => {
      if (data[field.name] === void 0 || data[field.name] === null) {
        throw new Error(`Cannot encode data: missing data for '${field.name}'`);
      }
      const value = data[field.name];
      const [t, encodedValue] = encodeValue(types, field.type, value, {
        parent: type,
        key: field.name
      });
      return [
        [...ts, t],
        [...vs, encodedValue]
      ];
    },
    [["felt"], [getTypeHash(types, type)]]
  );
  return [returnTypes, values];
};
var getStructHash = (types, type, data) => {
  return computeHashOnElements(encodeData(types, type, data)[1]);
};
var getMessageHash = (typedData, account) => {
  if (!validateTypedData(typedData)) {
    throw new Error("Typed data does not match JSON schema");
  }
  const message = [
    encodeShortString("StarkNet Message"),
    getStructHash(typedData.types, "StarkNetDomain", typedData.domain),
    account,
    getStructHash(typedData.types, typedData.primaryType, typedData.message)
  ];
  return computeHashOnElements(message);
};

// src/signer/default.ts
var Signer = class {
  constructor(pk = starkCurve.utils.randomPrivateKey()) {
    this.pk = pk instanceof Uint8Array ? buf2hex(pk) : toHex(pk);
  }
  async getPubKey() {
    return starkCurve.getStarkKey(this.pk);
  }
  async signMessage(typedData, accountAddress) {
    const msgHash = getMessageHash(typedData, accountAddress);
    return starkCurve.sign(msgHash, this.pk);
  }
  async signTransaction(transactions, transactionsDetail, abis) {
    if (abis && abis.length !== transactions.length) {
      throw new Error("ABI must be provided for each transaction or no transaction");
    }
    const calldata = getExecuteCalldata(transactions, transactionsDetail.cairoVersion);
    const msgHash = calculateTransactionHash(
      transactionsDetail.walletAddress,
      transactionsDetail.version,
      calldata,
      transactionsDetail.maxFee,
      transactionsDetail.chainId,
      transactionsDetail.nonce
    );
    return starkCurve.sign(msgHash, this.pk);
  }
  async signDeployAccountTransaction({
    classHash,
    contractAddress,
    constructorCalldata,
    addressSalt,
    maxFee,
    version,
    chainId,
    nonce
  }) {
    const msgHash = calculateDeployAccountTransactionHash(
      contractAddress,
      classHash,
      CallData.compile(constructorCalldata),
      addressSalt,
      version,
      maxFee,
      chainId,
      nonce
    );
    return starkCurve.sign(msgHash, this.pk);
  }
  async signDeclareTransaction({
    classHash,
    senderAddress,
    chainId,
    maxFee,
    version,
    nonce,
    compiledClassHash
  }) {
    const msgHash = calculateDeclareTransactionHash(
      classHash,
      senderAddress,
      version,
      maxFee,
      chainId,
      nonce,
      compiledClassHash
    );
    return starkCurve.sign(msgHash, this.pk);
  }
};

// src/utils/events.ts
function parseUDCEvent(txReceipt) {
  if (!txReceipt.events) {
    throw new Error("UDC emited event is empty");
  }
  const event = txReceipt.events.find(
    (it) => cleanHex(it.from_address) === cleanHex(UDC.ADDRESS)
  ) || {
    data: []
  };
  return {
    transaction_hash: txReceipt.transaction_hash,
    contract_address: event.data[0],
    address: event.data[0],
    deployer: event.data[1],
    unique: event.data[2],
    classHash: event.data[3],
    calldata_len: event.data[4],
    calldata: event.data.slice(5, 5 + parseInt(event.data[4], 16)),
    salt: event.data[event.data.length - 1]
  };
}

// src/account/default.ts
var Account = class extends Provider {
  constructor(providerOrOptions, address, pkOrSigner, cairoVersion = "0") {
    super(providerOrOptions);
    this.deploySelf = this.deployAccount;
    this.address = address.toLowerCase();
    this.signer = typeof pkOrSigner === "string" || pkOrSigner instanceof Uint8Array ? new Signer(pkOrSigner) : pkOrSigner;
    this.cairoVersion = cairoVersion.toString();
  }
  async getNonce(blockIdentifier) {
    return super.getNonceForAddress(this.address, blockIdentifier);
  }
  async getNonceSafe(nonce) {
    try {
      return toBigInt(nonce ?? await this.getNonce());
    } catch (error) {
      return 0n;
    }
  }
  async estimateFee(calls, estimateFeeDetails) {
    return this.estimateInvokeFee(calls, estimateFeeDetails);
  }
  async estimateInvokeFee(calls, { nonce: providedNonce, blockIdentifier, skipValidate } = {}) {
    const transactions = Array.isArray(calls) ? calls : [calls];
    const nonce = toBigInt(providedNonce ?? await this.getNonce());
    const version = toBigInt(feeTransactionVersion);
    const chainId = await this.getChainId();
    const signerDetails = {
      walletAddress: this.address,
      nonce,
      maxFee: ZERO,
      version,
      chainId,
      cairoVersion: this.cairoVersion
    };
    const invocation = await this.buildInvocation(transactions, signerDetails);
    const response = await super.getInvokeEstimateFee(
      { ...invocation },
      { version, nonce },
      blockIdentifier,
      skipValidate
    );
    const suggestedMaxFee = estimatedFeeToMaxFee(response.overall_fee);
    return {
      ...response,
      suggestedMaxFee
    };
  }
  async estimateDeclareFee({ contract, classHash: providedClassHash, casm, compiledClassHash }, { blockIdentifier, nonce: providedNonce, skipValidate } = {}) {
    const nonce = toBigInt(providedNonce ?? await this.getNonce());
    const version = !isSierra(contract) ? feeTransactionVersion : feeTransactionVersion_2;
    const chainId = await this.getChainId();
    const declareContractTransaction = await this.buildDeclarePayload(
      { classHash: providedClassHash, contract, casm, compiledClassHash },
      {
        nonce,
        chainId,
        version,
        walletAddress: this.address,
        maxFee: ZERO,
        cairoVersion: this.cairoVersion
      }
    );
    const response = await super.getDeclareEstimateFee(
      declareContractTransaction,
      { version, nonce },
      blockIdentifier,
      skipValidate
    );
    const suggestedMaxFee = estimatedFeeToMaxFee(response.overall_fee);
    return {
      ...response,
      suggestedMaxFee
    };
  }
  async estimateAccountDeployFee({
    classHash,
    addressSalt = 0,
    constructorCalldata = [],
    contractAddress: providedContractAddress
  }, { blockIdentifier, skipValidate } = {}) {
    const version = toBigInt(feeTransactionVersion);
    const nonce = ZERO;
    const chainId = await this.getChainId();
    const payload = await this.buildAccountDeployPayload(
      { classHash, addressSalt, constructorCalldata, contractAddress: providedContractAddress },
      {
        nonce,
        chainId,
        version,
        walletAddress: this.address,
        maxFee: ZERO,
        cairoVersion: this.cairoVersion
      }
    );
    const response = await super.getDeployAccountEstimateFee(
      { ...payload },
      { version, nonce },
      blockIdentifier,
      skipValidate
    );
    const suggestedMaxFee = estimatedFeeToMaxFee(response.overall_fee);
    return {
      ...response,
      suggestedMaxFee
    };
  }
  async estimateDeployFee(payload, transactionsDetail) {
    const calls = this.buildUDCContractPayload(payload);
    return this.estimateInvokeFee(calls, transactionsDetail);
  }
  async estimateFeeBulk(invocations, { nonce, blockIdentifier, skipValidate } = {}) {
    const accountInvocations = await this.accountInvocationsFactory(invocations, {
      versions: [feeTransactionVersion, feeTransactionVersion_2],
      nonce,
      blockIdentifier
    });
    const response = await super.getEstimateFeeBulk(accountInvocations, {
      blockIdentifier,
      skipValidate
    });
    return [].concat(response).map((elem) => {
      const suggestedMaxFee = estimatedFeeToMaxFee(elem.overall_fee);
      return {
        ...elem,
        suggestedMaxFee
      };
    });
  }
  async buildInvocation(call, signerDetails) {
    const calldata = getExecuteCalldata(call, this.cairoVersion);
    const signature = await this.signer.signTransaction(call, signerDetails);
    return {
      contractAddress: this.address,
      calldata,
      signature
    };
  }
  async execute(calls, abis = void 0, transactionsDetail = {}) {
    const transactions = Array.isArray(calls) ? calls : [calls];
    const nonce = toBigInt(transactionsDetail.nonce ?? await this.getNonce());
    const maxFee = 0;
    // transactionsDetail.maxFee ?? await this.getSuggestedMaxFee(
    //   { type: "INVOKE_FUNCTION" /* INVOKE */, payload: calls },
    //   transactionsDetail
    // );
    const version = toBigInt(transactionVersion);
    const chainId = await this.getChainId();
    const signerDetails = {
      walletAddress: this.address,
      nonce,
      maxFee,
      version,
      chainId,
      cairoVersion: this.cairoVersion
    };
    const signature = await this.signer.signTransaction(transactions, signerDetails, abis);
    const calldata = getExecuteCalldata(transactions, this.cairoVersion);
    return this.invokeFunction(
      { contractAddress: this.address, calldata, signature },
      {
        nonce,
        maxFee,
        version
      }
    );
  }
  /**
   * First check if contract is already declared, if not declare it
   * If contract already declared returned transaction_hash is ''.
   * Method will pass even if contract is already declared
   * @param transactionsDetail (optional)
   */
  async declareIfNot(payload, transactionsDetail = {}) {
    const declareContractPayload = extractContractHashes(payload);
    try {
      await this.getClassByHash(declareContractPayload.classHash);
    } catch (error) {
      return this.declare(payload, transactionsDetail);
    }
    return {
      transaction_hash: "",
      class_hash: declareContractPayload.classHash
    };
  }
  async declare(payload, transactionsDetail = {}) {
    const declareContractPayload = extractContractHashes(payload);
    const details = {};
    details.nonce = toBigInt(transactionsDetail.nonce ?? await this.getNonce());
    details.maxFee = transactionsDetail.maxFee ?? await this.getSuggestedMaxFee(
      {
        type: "DECLARE" /* DECLARE */,
        payload: declareContractPayload
      },
      transactionsDetail
    );
    details.version = !isSierra(payload.contract) ? transactionVersion : transactionVersion_2;
    details.chainId = await this.getChainId();
    const declareContractTransaction = await this.buildDeclarePayload(declareContractPayload, {
      ...details,
      walletAddress: this.address,
      cairoVersion: this.cairoVersion
    });
    return this.declareContract(declareContractTransaction, details);
  }
  async deploy(payload, details) {
    const params = [].concat(payload).map((it) => {
      const {
        classHash,
        salt,
        unique = true,
        constructorCalldata = []
      } = it;
      const compiledConstructorCallData = CallData.compile(constructorCalldata);
      const deploySalt = salt ?? randomAddress();
      return {
        call: {
          contractAddress: UDC.ADDRESS,
          entrypoint: UDC.ENTRYPOINT,
          calldata: [
            classHash,
            deploySalt,
            toCairoBool(unique),
            compiledConstructorCallData.length,
            ...compiledConstructorCallData
          ]
        },
        address: calculateContractAddressFromHash(
          unique ? starkCurve.pedersen(this.address, deploySalt) : deploySalt,
          classHash,
          compiledConstructorCallData,
          unique ? UDC.ADDRESS : 0
        )
      };
    });
    const calls = params.map((it) => it.call);
    const addresses = params.map((it) => it.address);
    const invokeResponse = await this.execute(calls, void 0, details);
    return {
      ...invokeResponse,
      contract_address: addresses
    };
  }
  async deployContract(payload, details) {
    const deployTx = await this.deploy(payload, details);
    const txReceipt = await this.waitForTransaction(deployTx.transaction_hash);
    return parseUDCEvent(txReceipt);
  }
  async declareAndDeploy(payload, details) {
    const { constructorCalldata, salt, unique } = payload;
    let declare = await this.declareIfNot(payload, details);
    if (declare.transaction_hash !== "") {
      const tx = await this.waitForTransaction(declare.transaction_hash);
      declare = { ...declare, ...tx };
    }
    const deploy = await this.deployContract(
      { classHash: declare.class_hash, salt, unique, constructorCalldata },
      details
    );
    return { declare: { ...declare }, deploy };
  }
  async deployAccount({
    classHash,
    constructorCalldata = [],
    addressSalt = 0,
    contractAddress: providedContractAddress
  }, transactionsDetail = {}) {
    const version = toBigInt(transactionVersion);
    const nonce = ZERO;
    const chainId = await this.getChainId();
    const compiledCalldata = CallData.compile(constructorCalldata);
    const contractAddress = providedContractAddress ?? calculateContractAddressFromHash(addressSalt, classHash, compiledCalldata, 0);
    const maxFee = transactionsDetail.maxFee ?? await this.getSuggestedMaxFee(
      {
        type: "DEPLOY_ACCOUNT" /* DEPLOY_ACCOUNT */,
        payload: {
          classHash,
          constructorCalldata: compiledCalldata,
          addressSalt,
          contractAddress
        }
      },
      transactionsDetail
    );
    const signature = await this.signer.signDeployAccountTransaction({
      classHash,
      constructorCalldata: compiledCalldata,
      contractAddress,
      addressSalt,
      chainId,
      maxFee,
      version,
      nonce
    });
    return this.deployAccountContract(
      { classHash, addressSalt, constructorCalldata, signature },
      {
        nonce,
        maxFee,
        version
      }
    );
  }
  async signMessage(typedData) {
    return this.signer.signMessage(typedData, this.address);
  }
  async hashMessage(typedData) {
    return getMessageHash(typedData, this.address);
  }
  async verifyMessageHash(hash, signature) {
    try {
      await this.callContract({
        contractAddress: this.address,
        entrypoint: "isValidSignature",
        calldata: CallData.compile({
          hash: toBigInt(hash).toString(),
          signature: formatSignature(signature)
        })
      });
      return true;
    } catch {
      return false;
    }
  }
  async verifyMessage(typedData, signature) {
    const hash = await this.hashMessage(typedData);
    return this.verifyMessageHash(hash, signature);
  }
  async getSuggestedMaxFee({ type, payload }, details) {
    let feeEstimate;
    switch (type) {
      case "INVOKE_FUNCTION" /* INVOKE */:
        feeEstimate = await this.estimateInvokeFee(payload, details);
        break;
      case "DECLARE" /* DECLARE */:
        feeEstimate = await this.estimateDeclareFee(payload, details);
        break;
      case "DEPLOY_ACCOUNT" /* DEPLOY_ACCOUNT */:
        feeEstimate = await this.estimateAccountDeployFee(payload, details);
        break;
      case "DEPLOY" /* DEPLOY */:
        feeEstimate = await this.estimateDeployFee(payload, details);
        break;
      default:
        feeEstimate = { suggestedMaxFee: ZERO, overall_fee: ZERO };
        break;
    }
    return feeEstimate.suggestedMaxFee;
  }
  /**
   * will be renamed to buildDeclareContractTransaction
   */
  async buildDeclarePayload(payload, { nonce, chainId, version, walletAddress, maxFee }) {
    const { classHash, contract, compiledClassHash } = extractContractHashes(payload);
    const compressedCompiledContract = parseContract(contract);
    const signature = await this.signer.signDeclareTransaction({
      classHash,
      compiledClassHash,
      senderAddress: walletAddress,
      chainId,
      maxFee,
      version,
      nonce
    });
    return {
      senderAddress: walletAddress,
      signature,
      contract: compressedCompiledContract,
      compiledClassHash
    };
  }
  async buildAccountDeployPayload({
    classHash,
    addressSalt = 0,
    constructorCalldata = [],
    contractAddress: providedContractAddress
  }, { nonce, chainId, version, maxFee }) {
    const compiledCalldata = CallData.compile(constructorCalldata);
    const contractAddress = providedContractAddress ?? calculateContractAddressFromHash(addressSalt, classHash, compiledCalldata, 0);
    const signature = await this.signer.signDeployAccountTransaction({
      classHash,
      contractAddress,
      chainId,
      maxFee,
      version,
      nonce,
      addressSalt,
      constructorCalldata: compiledCalldata
    });
    return {
      classHash,
      addressSalt,
      constructorCalldata: compiledCalldata,
      signature
    };
  }
  buildUDCContractPayload(payload) {
    const calls = [].concat(payload).map((it) => {
      const {
        classHash,
        salt = "0",
        unique = true,
        constructorCalldata = []
      } = it;
      const compiledConstructorCallData = CallData.compile(constructorCalldata);
      return {
        contractAddress: UDC.ADDRESS,
        entrypoint: UDC.ENTRYPOINT,
        calldata: [
          classHash,
          salt,
          toCairoBool(unique),
          compiledConstructorCallData.length,
          ...compiledConstructorCallData
        ]
      };
    });
    return calls;
  }
  async simulateTransaction(invocations, { nonce, blockIdentifier, skipValidate, skipExecute } = {}) {
    const accountInvocations = await this.accountInvocationsFactory(invocations, {
      versions: [transactionVersion, transactionVersion_2],
      nonce,
      blockIdentifier
    });
    return super.getSimulateTransaction(accountInvocations, {
      blockIdentifier,
      skipValidate,
      skipExecute
    });
  }
  async accountInvocationsFactory(invocations, { versions, nonce, blockIdentifier }) {
    const version = versions[0];
    const safeNonce = await this.getNonceSafe(nonce);
    const chainId = await this.getChainId();
    return Promise.all(
      [].concat(invocations).map(async (transaction, index) => {
        const signerDetails = {
          walletAddress: this.address,
          nonce: toBigInt(Number(safeNonce) + index),
          maxFee: ZERO,
          version,
          chainId,
          cairoVersion: this.cairoVersion
        };
        const txPayload = "payload" in transaction ? transaction.payload : transaction;
        const common = {
          type: transaction.type,
          version,
          nonce: toBigInt(Number(safeNonce) + index),
          blockIdentifier
        };
        if (transaction.type === "INVOKE_FUNCTION" /* INVOKE */) {
          const payload = await this.buildInvocation(
            [].concat(txPayload),
            signerDetails
          );
          return {
            ...common,
            ...payload
          };
        }
        if (transaction.type === "DECLARE" /* DECLARE */) {
          signerDetails.version = !isSierra(txPayload.contract) ? toBigInt(versions[0]) : toBigInt(versions[1]);
          const payload = await this.buildDeclarePayload(txPayload, signerDetails);
          return {
            ...common,
            ...payload,
            version: signerDetails.version
          };
        }
        if (transaction.type === "DEPLOY_ACCOUNT" /* DEPLOY_ACCOUNT */) {
          const payload = await this.buildAccountDeployPayload(txPayload, signerDetails);
          return {
            ...common,
            ...payload
          };
        }
        if (transaction.type === "DEPLOY" /* DEPLOY */) {
          const calls = this.buildUDCContractPayload(txPayload);
          const payload = await this.buildInvocation(calls, signerDetails);
          return {
            ...common,
            ...payload,
            type: "INVOKE_FUNCTION" /* INVOKE */
          };
        }
        throw Error(`accountInvocationsFactory: unsupported transaction type: ${transaction}`);
      })
    );
  }
  async getStarkName(address = this.address, StarknetIdContract2) {
    return super.getStarkName(address, StarknetIdContract2);
  }
};

// src/provider/interface.ts
var ProviderInterface = class {
};

// src/provider/index.ts
var defaultProvider = new Provider();

// src/account/interface.ts
var AccountInterface = class extends ProviderInterface {
};

// src/utils/events/index.ts
var events_exports = {};
__export(events_exports, {
  getAbiEvents: () => getAbiEvents,
  parseEvents: () => parseEvents
});
function getAbiEvents(abi) {
  return abi.filter((abiEntry) => abiEntry.type === "event" && (abiEntry.size || abiEntry.kind !== "enum")).reduce((acc, abiEntry) => {
    const entryName = abiEntry.name.slice(abiEntry.name.lastIndexOf(":") + 1);
    const abiEntryMod = { ...abiEntry };
    abiEntryMod.name = entryName;
    return {
      ...acc,
      [addHexPrefix(starkCurve.keccak(utf8ToArray(entryName)).toString(16))]: abiEntryMod
    };
  }, {});
}
function parseEvents(providerReceivedEvents, abiEvents, abiStructs, abiEnums) {
  const ret = providerReceivedEvents.flat().reduce((acc, recEvent) => {
    const abiEvent = abiEvents[recEvent.keys[0]];
    if (!abiEvent) {
      return acc;
    }
    const parsedEvent = {};
    parsedEvent[abiEvent.name] = {};
    recEvent.keys.shift();
    const keysIter = recEvent.keys[Symbol.iterator]();
    const dataIter = recEvent.data[Symbol.iterator]();
    const abiEventKeys = abiEvent.members?.filter((it) => it.kind === "key") || abiEvent.keys;
    const abiEventData = abiEvent.members?.filter((it) => it.kind === "data") || abiEvent.data;
    abiEventKeys.forEach((key) => {
      parsedEvent[abiEvent.name][key.name] = responseParser(
        keysIter,
        key,
        abiStructs,
        abiEnums,
        parsedEvent[abiEvent.name]
      );
    });
    abiEventData.forEach((data) => {
      parsedEvent[abiEvent.name][data.name] = responseParser(
        dataIter,
        data,
        abiStructs,
        abiEnums,
        parsedEvent[abiEvent.name]
      );
    });
    acc.push(parsedEvent);
    return acc;
  }, []);
  return ret;
}

// src/contract/default.ts
var splitArgsAndOptions = (args) => {
  const options = [
    "blockIdentifier",
    "parseRequest",
    "parseResponse",
    "formatResponse",
    "maxFee",
    "nonce",
    "signature",
    "addressSalt"
  ];
  const lastArg = args[args.length - 1];
  if (typeof lastArg === "object" && options.some((x) => x in lastArg)) {
    return { args, options: args.pop() };
  }
  return { args };
};
function buildCall(contract, functionAbi) {
  return async function(...args) {
    const params = splitArgsAndOptions(args);
    return contract.call(functionAbi.name, params.args, {
      parseRequest: true,
      parseResponse: true,
      ...params.options
    });
  };
}
function buildInvoke(contract, functionAbi) {
  return async function(...args) {
    const params = splitArgsAndOptions(args);
    return contract.invoke(functionAbi.name, params.args, {
      parseRequest: true,
      ...params.options
    });
  };
}
function buildDefault(contract, functionAbi) {
  if (functionAbi.stateMutability === "view" || functionAbi.state_mutability === "view") {
    return buildCall(contract, functionAbi);
  }
  return buildInvoke(contract, functionAbi);
}
function buildPopulate(contract, functionAbi) {
  return function(...args) {
    return contract.populate(functionAbi.name, args);
  };
}
function buildEstimate(contract, functionAbi) {
  return function(...args) {
    return contract.estimate(functionAbi.name, args);
  };
}
function getCalldata(args, callback) {
  if (Array.isArray(args) && "__compiled__" in args)
    return args;
  if (Array.isArray(args) && Array.isArray(args[0]) && "__compiled__" in args[0])
    return args[0];
  return callback();
}
var Contract = class {
  /**
   * Contract class to handle contract methods
   *
   * @param abi - Abi of the contract object
   * @param address (optional) - address to connect to
   * @param providerOrAccount (optional) - Provider or Account to attach to
   */
  constructor(abi, address, providerOrAccount = defaultProvider) {
    this.address = address && address.toLowerCase();
    this.providerOrAccount = providerOrAccount;
    this.callData = new CallData(abi);
    this.structs = CallData.getAbiStruct(abi);
    this.events = getAbiEvents(abi);
    const parser = createAbiParser(abi);
    this.abi = parser.getLegacyFormat();
    const options = { enumerable: true, value: {}, writable: false };
    Object.defineProperties(this, {
      functions: { enumerable: true, value: {}, writable: false },
      callStatic: { enumerable: true, value: {}, writable: false },
      populateTransaction: { enumerable: true, value: {}, writable: false },
      estimateFee: { enumerable: true, value: {}, writable: false }
    });
    this.abi.forEach((abiElement) => {
      if (abiElement.type !== "function")
        return;
      const signature = abiElement.name;
      if (!this[signature]) {
        Object.defineProperty(this, signature, {
          ...options,
          value: buildDefault(this, abiElement)
        });
      }
      if (!this.functions[signature]) {
        Object.defineProperty(this.functions, signature, {
          ...options,
          value: buildDefault(this, abiElement)
        });
      }
      if (!this.callStatic[signature]) {
        Object.defineProperty(this.callStatic, signature, {
          ...options,
          value: buildCall(this, abiElement)
        });
      }
      if (!this.populateTransaction[signature]) {
        Object.defineProperty(this.populateTransaction, signature, {
          ...options,
          value: buildPopulate(this, abiElement)
        });
      }
      if (!this.estimateFee[signature]) {
        Object.defineProperty(this.estimateFee, signature, {
          ...options,
          value: buildEstimate(this, abiElement)
        });
      }
    });
  }
  attach(address) {
    this.address = address;
  }
  connect(providerOrAccount) {
    this.providerOrAccount = providerOrAccount;
  }
  async deployed() {
    if (this.deployTransactionHash) {
      await this.providerOrAccount.waitForTransaction(this.deployTransactionHash);
      this.deployTransactionHash = void 0;
    }
    return this;
  }
  async call(method, args = [], {
    parseRequest = true,
    parseResponse = true,
    formatResponse = void 0,
    blockIdentifier = void 0
  } = {}) {
    assert(this.address !== null, "contract is not connected to an address");
    const calldata = getCalldata(args, () => {
      if (parseRequest) {
        this.callData.validate("CALL" /* CALL */, method, args);
        return this.callData.compile(method, args);
      }
      console.warn("Call skipped parsing but provided rawArgs, possible malfunction request");
      return args;
    });
    return this.providerOrAccount.callContract(
      {
        contractAddress: this.address,
        calldata,
        entrypoint: method
      },
      blockIdentifier
    ).then((x) => {
      if (!parseResponse) {
        return x.result;
      }
      if (formatResponse) {
        return this.callData.format(method, x.result, formatResponse);
      }
      return this.callData.parse(method, x.result);
    });
  }
  invoke(method, args = [], { parseRequest = true, maxFee, nonce, signature } = {}) {
    assert(this.address !== null, "contract is not connected to an address");
    const calldata = getCalldata(args, () => {
      if (parseRequest) {
        this.callData.validate("INVOKE" /* INVOKE */, method, args);
        return this.callData.compile(method, args);
      }
      console.warn("Invoke skipped parsing but provided rawArgs, possible malfunction request");
      return args;
    });
    const invocation = {
      contractAddress: this.address,
      calldata,
      entrypoint: method
    };
    if ("execute" in this.providerOrAccount) {
      return this.providerOrAccount.execute(invocation, void 0, {
        maxFee,
        nonce
      });
    }
    if (!nonce)
      throw new Error(`Nonce is required when invoking a function without an account`);
    console.warn(`Invoking ${method} without an account. This will not work on a public node.`);
    return this.providerOrAccount.invokeFunction(
      {
        ...invocation,
        signature
      },
      {
        nonce
      }
    );
  }
  async estimate(method, args = []) {
    assert(this.address !== null, "contract is not connected to an address");
    if (!getCalldata(args, () => false)) {
      this.callData.validate("INVOKE" /* INVOKE */, method, args);
    }
    const invocation = this.populate(method, args);
    if ("estimateInvokeFee" in this.providerOrAccount) {
      return this.providerOrAccount.estimateInvokeFee(invocation);
    }
    throw Error("Contract must be connected to the account contract to estimate");
  }
  populate(method, args = []) {
    const calldata = getCalldata(args, () => this.callData.compile(method, args));
    return {
      contractAddress: this.address,
      entrypoint: method,
      calldata
    };
  }
  parseEvents(receipt) {
    return parseEvents(
      receipt.events?.filter(
        (event) => cleanHex(event.from_address) === cleanHex(this.address),
        []
      ) || [],
      this.events,
      this.structs,
      CallData.getAbiEnum(this.abi)
    );
  }
  isCairo1() {
    return cairo_exports.isCairo1Abi(this.abi);
  }
  typed(tAbi) {
    return this;
  }
};

// src/contract/interface.ts
var ContractInterface = class {
};

// src/contract/contractFactory.ts
var ContractFactory = class {
  /**
   * @param params CFParams
   *  - compiledContract: CompiledContract;
   *  - account: AccountInterface;
   *  - casm?: CairoAssembly;
   *  - classHash?: string;
   *  - compiledClassHash?: string;
   *  - abi?: Abi;
   */
  constructor(params) {
    this.compiledContract = params.compiledContract;
    this.account = params.account;
    this.casm = params.casm;
    this.abi = params.abi ?? params.compiledContract.abi;
    this.classHash = params.classHash;
    this.compiledClassHash = params.compiledClassHash;
    this.CallData = new CallData(this.abi);
  }
  /**
   * Deploys contract and returns new instance of the Contract
   *
   * If contract is not declared it will first declare it, and then deploy
   */
  async deploy(...args) {
    const { args: param, options = { parseRequest: true } } = splitArgsAndOptions(args);
    const constructorCalldata = getCalldata(param, () => {
      if (options.parseRequest) {
        this.CallData.validate("DEPLOY" /* DEPLOY */, "constructor", param);
        return this.CallData.compile("constructor", param);
      }
      console.warn("Call skipped parsing but provided rawArgs, possible malfunction request");
      return param;
    });
    const {
      deploy: { contract_address, transaction_hash }
    } = await this.account.declareAndDeploy({
      contract: this.compiledContract,
      casm: this.casm,
      classHash: this.classHash,
      compiledClassHash: this.compiledClassHash,
      constructorCalldata,
      salt: options.addressSalt
    });
    assert(Boolean(contract_address), "Deployment of the contract failed");
    const contractInstance = new Contract(
      this.compiledContract.abi,
      contract_address,
      this.account
    );
    contractInstance.deployTransactionHash = transaction_hash;
    return contractInstance;
  }
  /**
   * Attaches to new Account
   *
   * @param account - new Account to attach to
   */
  connect(account) {
    this.account = account;
    return this;
  }
  /**
   * Attaches current abi and account to the new address
   */
  attach(address) {
    return new Contract(this.abi, address, this.account);
  }
  // ethers.js' getDeployTransaction cant be supported as it requires the account or signer to return a signed transaction which is not possible with the current implementation
};

// src/utils/address.ts
var import_utils4 = require("@noble/curves/abstract/utils");
function addAddressPadding(address) {
  return addHexPrefix(removeHexPrefix(toHex(address)).padStart(64, "0"));
}
function validateAndParseAddress(address) {
  assertInRange(address, ZERO, MASK_251, "Starknet Address");
  const result = addAddressPadding(address);
  if (!result.match(/^(0x)?[0-9a-fA-F]{64}$/)) {
    throw new Error("Invalid Address Format");
  }
  return result;
}
function getChecksumAddress(address) {
  const chars = removeHexPrefix(validateAndParseAddress(address)).toLowerCase().split("");
  const hex = removeHexPrefix(keccakBn(address));
  const hashed = (0, import_utils4.hexToBytes)(hex.padStart(64, "0"));
  for (let i = 0; i < chars.length; i += 2) {
    if (hashed[i >> 1] >> 4 >= 8) {
      chars[i] = chars[i].toUpperCase();
    }
    if ((hashed[i >> 1] & 15) >= 8) {
      chars[i + 1] = chars[i + 1].toUpperCase();
    }
  }
  return addHexPrefix(chars.join(""));
}
function validateChecksumAddress(address) {
  return getChecksumAddress(address) === address;
}

// src/index.ts
var number = num_exports;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Account,
  AccountInterface,
  BlockStatus,
  BlockTag,
  CairoCustomEnum,
  CairoOption,
  CairoOptionVariant,
  CairoResult,
  CairoResultVariant,
  CallData,
  Contract,
  ContractFactory,
  ContractInterface,
  CustomError,
  EntryPointType,
  GatewayError,
  HttpError,
  LibraryError,
  Litteral,
  Provider,
  ProviderInterface,
  RPC,
  RpcProvider,
  SIMULATION_FLAG,
  Sequencer,
  SequencerProvider,
  Signer,
  SignerInterface,
  TransactionExecutionStatus,
  TransactionFinalityStatus,
  TransactionStatus,
  TransactionType,
  Uint,
  ValidateType,
  addAddressPadding,
  buildUrl,
  cairo,
  constants,
  contractClassResponseToLegacyCompiledContract,
  defaultProvider,
  ec,
  encode,
  events,
  extractContractHashes,
  fixProto,
  fixStack,
  getCalldata,
  getChecksumAddress,
  hash,
  isSierra,
  isUrl,
  json,
  merkle,
  num,
  number,
  parseUDCEvent,
  provider,
  selector,
  shortString,
  splitArgsAndOptions,
  stark,
  starknetId,
  transaction,
  typedData,
  types,
  uint256,
  validateAndParseAddress,
  validateChecksumAddress
});
//# sourceMappingURL=index.js.map