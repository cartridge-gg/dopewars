import { createStarknetWindowObject } from "./starknetWindowObject"

const attach = () => {
    const starknetWindowObject = createStarknetWindowObject()
    const name = 'starknet_dojoburner'
    //['starknet_dojoburner'].forEach((name) => {
    // we need 2 different try catch blocks because we want to execute both even if one of them fails
    try { delete (window as any)[name] } catch (e) { /* ignore */ }
    try {
        // set read only property to window
        Object.defineProperty(window, name, {
            value: starknetWindowObject,
            writable: true,
            //writable: false,
        })
    } catch { /* ignore*/ }
    try { (window as any)[name] = starknetWindowObject } catch {  /* ignore*/ }
    // })
}

const attachHandler = () => {
    attach()
    setTimeout(() => { attach() }, 100)//?
}


export const initializeInPage = () => {
    // inject script
    attachHandler();

    window.addEventListener("load", () => attachHandler())
    document.addEventListener("DOMContentLoaded", () => attachHandler())
    document.addEventListener("readystatechange", () => attachHandler())

    window.addEventListener(
        "message",
        async ({ data }: MessageEvent<any>) => {
            console.log("message", data)
            const { starknet } = window
            if (!starknet) {
                return
            }

            if (
                (starknet.account && data.type === "CONNECT_ACCOUNT_RES") ||
                data.type === "APPROVE_REQUEST_SWITCH_CUSTOM_NETWORK"
            ) {
                // const account =
                //   data.type === "CONNECT_ACCOUNT_RES"
                //     ? data.data
                //     : data.data.selectedAccount

                // const isPreauthorized = await getIsPreauthorized()
                // if (!isPreauthorized) {
                //   // disconnect so the user can see they are no longer connected
                //   // TODO: better UX would be to also re-connect when user selects pre-authorized account
                //   await disconnectAccount()
                // } else {
                //   const walletAccountP = waitForMessage(
                //     "CONNECT_DAPP_RES",
                //     10 * 60 * 1000,
                //   )
                //   sendMessage({
                //     type: "CONNECT_DAPP",
                //   })
                //   const walletAccount = await walletAccountP

                //   if (!walletAccount) {
                //     return disconnectAccount()
                //   }

                //   if (
                //     account &&
                //     (account.address !== starknet.selectedAddress ||
                //       account.network.chainId !== starknet.chainId)
                //   ) {
                //     const { address, network } = account

                //     starknet.selectedAddress = address
                //     starknet.chainId = network.chainId
                //     starknet.provider = getProvider(network)
                //     starknet.account = new ArgentXAccount(address, starknet.provider)
                //     for (const userEvent of userEventHandlers) {
                //       if (userEvent.type === "accountsChanged") {
                //         userEvent.handler([address])
                //       } else if (userEvent.type === "networkChanged") {
                //         userEvent.handler(network.chainId)
                //       } else {
                //         assertNever(userEvent)
                //       }
                //     }
                //   }
                // }
            } else if (data.type === "DISCONNECT_ACCOUNT") {
                // starknet.selectedAddress = undefined
                // starknet.account = undefined
                // starknet.isConnected = false
                // for (const userEvent of userEventHandlers) {
                //   if (userEvent.type === "accountsChanged") {
                //     userEvent.handler([])
                //   } else if (userEvent.type === "networkChanged") {
                //     userEvent.handler(undefined)
                //   } else {
                //     assertNever(userEvent)
                //   }
                // }
            }
        },
    )

}