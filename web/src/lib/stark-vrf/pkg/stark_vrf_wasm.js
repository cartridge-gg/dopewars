import * as wasm from "./stark_vrf_wasm_bg.wasm";
import { __wbg_set_wasm } from "./stark_vrf_wasm_bg.js";
__wbg_set_wasm(wasm);
export * from "./stark_vrf_wasm_bg.js";
