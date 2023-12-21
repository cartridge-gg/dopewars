import { setupNetwork } from "./setupNetwork";
import manifest from "../../../manifest.json";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

/**
 * Sets up the necessary components and network utilities.
 *
 * @returns An object containing network configurations, client components, and system calls.
 */
export async function setup() {
    // Initialize the network configuration.
    const network = await setupNetwork(manifest);

    return {
        network,
    };
}

