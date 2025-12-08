import { Entities, EnumValue, Query, Ty } from "@dojoengine/torii-client";
import { BigNumberish, CairoCustomEnum, CairoOption, CairoOptionVariant } from "starknet";

export function parseValue(value: Ty): any {
  switch (value.type) {
    case "primitive":
      return value.value;
    case "struct":
      return parseStruct(value.value as Record<string, Ty> | Map<string, Ty>);
    case "enum":
      //  debugger; //dats shit
      // if ((value.value as EnumValue).option === "Some") {
      //   return parseValue((value.value as EnumValue).value);
      // } else {
      //   undefined;
      //   // (value.value as EnumValue).option;
      // }

      if ("Some" === (value.value as EnumValue).option) {
        return new CairoOption(CairoOptionVariant.Some, parseValue((value.value as EnumValue).value));
      }
      if ("None" === (value.value as EnumValue).option) {
        return new CairoOption(CairoOptionVariant.None);
      }

      // Handling simple enum as default case
      // Handling CairoCustomEnum for more complex types
      return parseCustomEnum(value);
      return;
    case "array":
      return (value.value as Ty[]).map(parseValue);
    default:
      return value.value;
  }
}

function parseCustomEnum(value: Ty): CairoCustomEnum | string {
  // // enum is a simple enum
  // if ((value.value as EnumValue).value.type === "tuple") {
  //   // we keep retrocompatibility
  //   return (value.value as EnumValue).option;
  // }

  return new CairoCustomEnum({
    [(value.value as EnumValue).option]: parseValue((value.value as EnumValue).value),
  });
}

export function parseStruct(struct: Record<string, Ty> | Map<string, Ty>): any {
  const entries = struct instanceof Map ? Array.from(struct.entries()) : Object.entries(struct);
  return Object.fromEntries(entries.map(([key, value]) => [key, parseValue(value)]));
}

export function toToriiTokenId(value: BigNumberish) {
  return BigInt(value).toString(16).padStart(64, "0");
}

//
//
//

export function parseModels(entities: Entities, modelName: string) {
  const models = entities.items.map((i) => i.models);
  const parsed = Object.keys(models).flatMap((key: string) =>
    // @ts-ignore
    models[key as keyof typeof models][modelName] ? [parseStruct(models[key as keyof typeof models][modelName])] : [],
  );
  return parsed;
}

export function queryAllModels(models: string[], limit = 10_000): Query {
  return {
    world_addresses: [],
    clause: undefined,
    pagination: {
      limit: 10_000,
      cursor: undefined,
      direction: "Forward",
      order_by: [],
    },
    no_hashed_keys: true,
    models,
    historical: false,
  };
}
