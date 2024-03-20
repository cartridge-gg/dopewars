import { BurnerManager } from "@dojoengine/create-burner"
import { WalletEvents } from "get-starknet-core"
import { katanaIcon } from "./icons"

const VERSION = "0.0.1"
export const userEventHandlers: WalletEvents[] = []

// window.ethereum like

export class DojoBurnerStarknetWindowObject {
    id = "dojoburner"
    name = "Dojo Burner"
    icon = katanaIcon
    account = undefined
    provider = undefined
    selectedAddress = undefined
    chainId = undefined
    isConnected = false
    version = VERSION
    //
    burnerManager: BurnerManager = undefined

    constructor() {}

    setBurnerManager(burnerManager: BurnerManager){
        this.burnerManager = burnerManager

        this.provider = this.burnerManager.provider
        this.account = this.burnerManager.masterAccount

        this.selectedAddress = this.account.address
        this.chainId = "KATANA"//network.chainId
        this.isConnected = true
    }

    async request(call) {
        console.log("request", call)
    }

    async enable({ starknetVersion = "v5" } = {}) {
        console.log("enable")

        if(!this.account) return
        
        this.isConnected = true

        return [this.account.address]
    }

    async isPreauthorized() {
        return true
    }

    on = (event, handleEvent) => {
        console.log("on", event)
 
    }

    off = (event, handleEvent) => {
        console.log("off", event)

    }
}


export const createStarknetWindowObject = () => {
    return new DojoBurnerStarknetWindowObject()
}





//v0
// export class DojoBurnerStarknetWindowObject {
//     id = "dojoburner"
//     name = "Dojo Burner"
//     icon = katanaIcon
//     account = undefined
//     provider = undefined
//     selectedAddress = undefined
//     chainId = undefined
//     isConnected = false
//     version = VERSION
//     //
//     burnerManager:BurnerManager = undefined

//     constructor(burnerManager: BurnerManager) {
//         this.burnerManager = burnerManager

//         this.provider = this.burnerManager.provider
//         this.account = this.burnerManager.masterAccount

//         this.selectedAddress = this.account.address
//         this.chainId = "KATANA"//network.chainId
//         this.isConnected = true
//     }

//     async request(call) {
//         console.log("request", call)

//         // if (
//         //     call.type === "wallet_watchAsset" &&
//         //     "type" in call.params &&
//         //     call.params.type === "ERC20"
//         // ) {
//         //     return await handleAddTokenRequest(call.params)
//         // } else if (call.type === "wallet_addStarknetChain" && "id" in call.params) {
//         //     return await handleAddNetworkRequest(call.params)
//         // } else if (
//         //     call.type === "wallet_switchStarknetChain" &&
//         //     "chainId" in call.params
//         // ) {
//         //     return await handleSwitchNetworkRequest(call.params)
//         // } else if (
//         //     // Currently not part of the spec
//         //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         //     // @ts-expect-error
//         //     call.type === "wallet_deploymentData"
//         // ) {
//         //     console.warn("Using non-standard wallet_deploymentData")
//         //     return (await handleDeploymentData()) as any
//         // }
//         // throw Error("Not implemented")
//     }

//     async enable({ starknetVersion = "v5" } = {}) {

//         console.log("enable")

//         // const walletAccountP = Promise.race([
//         //     waitForMessage("CONNECT_DAPP_RES", 10 * 60 * 1000),
//         //     waitForMessage("REJECT_PREAUTHORIZATION", 10 * 60 * 1000).then(
//         //         () => "USER_ABORTED" as const,
//         //     ),
//         // ])
//         // sendMessage({
//         //     type: "CONNECT_DAPP",
//         // })
//         // const walletAccount = await walletAccountP

//         // if (!walletAccount) {
//         //     throw Error("No wallet account (should not be possible)")
//         // }
//         // if (walletAccount === "USER_ABORTED") {
//         //     throw Error("User aborted")
//         // }

//         // const { starknet } = window
//         // if (!starknet) {
//         //     throw Error("No starknet object detected")
//         // }

//         // const { address, network } = walletAccount

//         // if (starknetVersion === "v5") {
//         //     ; (starknet as any).starknetJsVersion = "v5"
//         //     const provider = new ArgentXProvider(network)
//         //     starknet.provider = provider
//         //     starknet.account = new ArgentXAccount(address, provider)
//         // } else if (starknetVersion === "v4") {
//         //     ; (starknet as any).starknetJsVersion = "v4"
//         //     const provider = new ArgentXProviderV4(network)
//         //     starknet.provider = provider
//         //     starknet.account = new ArgentXAccount4(address, provider)
//         // } else {
//         //     // Ideally this should never happen, but if dApp uses get-starknet with starknetVersion = v3,
//         //     // we want to throw an error instead of silently falling back to v4.
//         //     throw new Error(`Unsupported starknet.js version: ${starknetVersion}`)
//         // }

//         const { starknet } = window
//         if (!starknet) {
//             throw Error("No starknet object detected")
//         }

       

//         // window.starknet = this;
//         //window.starknet_dojoburner = this;

//         return [this.account.address]
//     }

//     async isPreauthorized() {
//         return true
//         //return getIsPreauthorized()
//     }

//     on = (event, handleEvent) => {
//         console.log("on", event)
//         // if (event === "accountsChanged") {
//         //     userEventHandlers.push({
//         //         type: event,
//         //         handler: handleEvent as AccountChangeEventHandler,
//         //     })
//         // } else if (event === "networkChanged") {
//         //     userEventHandlers.push({
//         //         type: event,
//         //         handler: handleEvent as NetworkChangeEventHandler,
//         //     })
//         // } else {
//         //     assertNever(event)
//         //     throw new Error(`Unknwown event: ${event}`)
//         // }
//     }

//     off = (event, handleEvent) => {
//         console.log("off", event)

//         // if (event !== "accountsChanged" && event !== "networkChanged") {
//         //     assertNever(event)
//         //     throw new Error(`Unknwown event: ${event}`)
//         // }

//         // const eventIndex = userEventHandlers.findIndex(
//         //     (userEvent) =>
//         //         userEvent.type === event && userEvent.handler === handleEvent,
//         // )

//         // if (eventIndex >= 0) {
//         //     userEventHandlers.splice(eventIndex, 1)
//         // }
//     }
// }


// export const createStarknetWindowObject = (burnerManager: BurnerManager) => {
//     return new DojoBurnerStarknetWindowObject(burnerManager)
// }