import { useEffect, useState } from "react";
import { ItemConfigFull } from "../stores/config";
import { useConfigStore } from "./useConfigStore";
import { useDojoContext } from "./useDojoContext";
import { useRouterContext } from "./useRouterContext";

export const useAvailableShopItems = () => {
    const { gameId } = useRouterContext()
    const {
        account,
        dojoProvider,
    } = useDojoContext();
    const configStore = useConfigStore()

    const [availableShopItems, setAvailableShopItems] = useState<ItemConfigFull[]>([]);

    useEffect(() => {
        const update = async () => {
            try {
                const items = await dojoProvider.callContract(
                    "rollyourown::systems::shop::shop",
                    "available_items",
                    [Number(gameId), account!.address],
                ) as any[];

                const shopItems = items.map(i => {
                    const itemConfig = configStore.getItemByIds(Number(i.slot_id), Number(i.level_id))!
                    return itemConfig
                })

                setAvailableShopItems(shopItems)

            }
            catch (e) {
                console.log(e)
                // shop is closed
                setAvailableShopItems([])
            }
        }

        if (gameId) {
            update();
        }
    }, [gameId, account, dojoProvider])

    return { availableShopItems }

}



