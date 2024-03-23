// import { BurnerManager, katanaIcon } from "@dojoengine/create-burner";
// import { IStarknetWindowObject } from "get-starknet-core";
// import { AccountInterface, RpcProvider } from "starknet";

// const VERSION = "0.0.1";

// export class xxxxxxxxxxxxDojoBurnerStarknetWindowObject implements IStarknetWindowObject {
//     id = "dojoburner";
//     name = "Dojo Burner";
//     icon = katanaIcon;
//     account?: AccountInterface = undefined;
//     provider?: RpcProvider = undefined;
//     selectedAddress?: string = undefined;
//     chainId?: string = undefined;
//     isConnected = false;
//     version = VERSION;
//     //
//     burnerManager: BurnerManager | null = null;

//     constructor() {}

//     setBurnerManager(burnerManager: BurnerManager) {
//         this.burnerManager = burnerManager;

//         this.chainId = this.burnerManager.chainId;
//         this.provider = this.burnerManager.provider;

//         const activeAccount = this.burnerManager.getActiveAccount();

//         this.account = activeAccount ? activeAccount : undefined;
//         this.selectedAddress = this.account?.address;
//     }

//     ///@ts-ignore
//     async request(call: any) {
//         //console.log("request", call);
//     }

//     ///@ts-ignore
//     async enable({ starknetVersion = "v5" } = {}) {
//         //console.log("enable");

//         // retrieve active account
//         const activeAccount = this.burnerManager?.getActiveAccount();
//         this.account = activeAccount ? activeAccount : undefined;

//         if (!this.account) {
//             this.account = await this.burnerManager?.create();
//         }
//         if (!this.account) {
//             this.isConnected = false;
//             return [];
//         }

//         this.isConnected = true;

//         return [this.account.address];
//     }

//     async isPreauthorized() {
//         return true;
//     }

//     ///@ts-ignore
//     on = (event: any, handleEvent: any) => {
//         //console.log("on", event);
//     };

//     ///@ts-ignore
//     off = (event: any, handleEvent: any) => {
//         //console.log("off", event);
//     };
// }

// // https://github.com/argentlabs/argent-x/blob/9e4907dc2630ea5c452d7e40a55739b5797544b6/packages/extension/src/inpage/index.ts#L30

// const starknetWindowObjectKey = "starknet_dojoburner";

// const attach = () => {
//     const starknetWindowObject = new DojoBurnerStarknetWindowObject();
//     // we need 2 different try catch blocks because we want to execute both even if one of them fails
//     try {
//         delete (window as any)[starknetWindowObjectKey];
//     } catch (e) {
//         /* ignore */
//     }
//     try {
//         // set read only property to window
//         Object.defineProperty(window, starknetWindowObjectKey, {
//             value: starknetWindowObject,
//             writable: true,
//             //writable: false,
//         });
//     } catch {
//         /* ignore*/
//     }
//     try {
//         (window as any)[starknetWindowObjectKey] = starknetWindowObject;
//     } catch {
//         /* ignore*/
//     }
// };

// const attachHandler = () => {
//     attach();
//     setTimeout(() => {
//         attach();
//     }, 100);
// };

// export const initializeInPage = () => {
//     attachHandler();

//     window.addEventListener("load", () => attachHandler());
//     document.addEventListener("DOMContentLoaded", () => attachHandler());
//     document.addEventListener("readystatechange", () => attachHandler());
// };

// export const cleanInPage = () => {
//     window.removeEventListener("load", () => attachHandler());
//     document.removeEventListener("DOMContentLoaded", () => attachHandler());
//     document.removeEventListener("readystatechange", () => attachHandler());
// };







////////////////////////////////////////////////////////////////////////////////////////////////////////



// import { BurnerManager } from "@dojoengine/create-burner"
// import { IStarknetWindowObject } from "get-starknet-core"
// import { AccountInterface, RpcProvider } from "starknet"
// import { katanaIcon } from "./icons"

// const VERSION = "0.0.1"

// export class DojoBurnerStarknetWindowObject implements IStarknetWindowObject {
//     id = "dojoburner"
//     name = "Dojo Burner"
//     icon = katanaIcon
//     account?: AccountInterface = undefined
//     provider?: RpcProvider = undefined
//     selectedAddress?: string = undefined
//     chainId?: string = undefined
//     isConnected = false
//     version = VERSION
//     //
//     burnerManager: BurnerManager | null = null

//     constructor() { }

//     setBurnerManager(burnerManager: BurnerManager) {
//         this.burnerManager = burnerManager

//         this.chainId = this.burnerManager.chainId
//         this.provider = this.burnerManager.provider

//         const activeAccount = this.burnerManager.getActiveAccount()
        
//         this.account = activeAccount ? activeAccount : undefined
//         this.selectedAddress = this.account?.address
//     }

//     ///@ts-ignore
//     async request(call: any) {
//         console.log("request", call)
//     }

//     ///@ts-ignore
//     async enable({ starknetVersion = "v5" } = {}) {
//         console.log("enable")

//         // retrieve active account
//         const activeAccount = this.burnerManager.getActiveAccount()
//         this.account = activeAccount ? activeAccount : undefined

//         if (!this.account) {
//             this.account = await this.burnerManager?.create();
//         }
//         if (!this.account) {
//             this.isConnected = false
//             return []
//         }

//         this.isConnected = true

//         return [this.account.address]
//     }

//     async isPreauthorized() {
//         return true
//     }

//     ///@ts-ignore
//     on = (event: any, handleEvent: any) => {
//         console.log("on", event)
//     }

//     ///@ts-ignore
//     off = (event: any, handleEvent: any) => {
//         console.log("off", event)
//     }


//     static
// }


// export const createStarknetWindowObject = () => {
//     return new DojoBurnerStarknetWindowObject()
// }


// const starknetWindowObjectKey = 'starknet_dojoburner'

// const attach = () => {
//     const starknetWindowObject = createStarknetWindowObject()
//     // we need 2 different try catch blocks because we want to execute both even if one of them fails
//     try { delete (window as any)[starknetWindowObjectKey] } catch (e) { /* ignore */ }
//     try {
//         // set read only property to window
//         Object.defineProperty(window, starknetWindowObjectKey, {
//             value: starknetWindowObject,
//             writable: true,
//             //writable: false,
//         })
//     } catch { /* ignore*/ }
//     try { (window as any)[starknetWindowObjectKey] = starknetWindowObject } catch {  /* ignore*/ }
// }

// const attachHandler = () => {
//     attach()
//     setTimeout(() => { attach() }, 100)
// }

// export const initializeInPage = () => {
//     // inject script
//     attachHandler();

//     window.addEventListener("load", () => attachHandler())
//     document.addEventListener("DOMContentLoaded", () => attachHandler())
//     document.addEventListener("readystatechange", () => attachHandler())

// }