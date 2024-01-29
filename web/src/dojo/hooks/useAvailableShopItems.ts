import { useEffect, useState } from "react";
import { shortString } from "starknet";
import { getShopItem } from "../helpers";
import { ItemTextEnum, ShopItemInfo } from "../types";
import { useDojoContext } from "./useDojoContext";

export const useAvailableShopItems = (gameId: string) => {
    const {
        account,
        dojoProvider,
    } = useDojoContext();

    const [availableShopItems, setAvailableShopItems] = useState<ShopItemInfo[]>([]);

    useEffect(() => {
        const update = async () => {
            try {
                const items = await dojoProvider.callContract(
                    "rollyourown::systems::shop::shop",
                    "available_items",
                    [Number(gameId), account!.address],
                ) as any[];

                const shopItems = items.map(i => {
                    const itemInfos = getShopItem(shortString.decodeShortString(i.item_type) as ItemTextEnum, Number(i.level));
                    return {
                        id: i.item_id,
                        type: itemInfos.type,
                        typeText: itemInfos.id,
                       // name: shortString.decodeShortString(i.name),
                        level: Number(i.level),
                        cost: Number(i.cost),
                        value: Number(i.value),
                        icon: itemInfos.icon,
                    } as ShopItemInfo
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



