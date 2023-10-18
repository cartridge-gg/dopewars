import { useState, useEffect } from "react";
import { useDojoContext } from "./useDojoContext";
import { ItemTextEnum, ShopItemInfo } from "../types";
import { shortString } from "starknet";
import { getShopItem } from "../helpers";

export const useAvailableShopItems = (gameId: string) => {
    const {
        account,
        setup: {
            network: { provider, call },
        },
    } = useDojoContext();

    const [availableShopItems, setAvailableShopItems] = useState<ShopItemInfo[]>([]);

    useEffect(() => {
        const update = async () => {
            try {
                const items = await call(
                    account,
                    "shop",
                    "available_items",
                    [Number(gameId), account.address],
                ) as any[];

                const shopItems = items.map(i => {
                    const itemInfos = getShopItem(shortString.decodeShortString(i.item_type) as ItemTextEnum, Number(i.level));
                    return {
                        id:i.item_id,
                        type: itemInfos.type,
                        name: shortString.decodeShortString(i.name),
                        level: Number(i.level),
                        cost: Number(i.cost),
                        value: Number(i.cost),
                        icon: itemInfos.icon,
                        desc: itemInfos.desc
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
    }, [gameId, account, call])

    return { availableShopItems }

}



