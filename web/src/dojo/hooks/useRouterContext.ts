
import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DrugConfigFull, LocationConfigFull } from "../stores/config";
import { TradeDirection } from "../types";
import { useConfigStore } from "./useConfigStore";


type RouterContext = {
  router: NextRouter
  gameId: string | undefined,
  playerId: string | undefined,
  location: LocationConfigFull | undefined,
  drug: DrugConfigFull | undefined,
  tradeDirection: TradeDirection | undefined,
  isAdmin: boolean,
  isRyoDotGame: boolean,
}

export const useRouterContext = (): RouterContext => {
  const router = useRouter()
  const configStore = useConfigStore()

  const [context, setContext] = useState<RouterContext>({
    router,
    gameId: undefined,
    playerId: undefined,
    location: undefined,
    drug: undefined,
    tradeDirection: undefined,
    isAdmin: false,
    isRyoDotGame: false
  });

  useEffect(() => {
    if (!router.isReady || !configStore || !configStore.config) return

    const gameId = router.query.gameId ? router.query.gameId as string : undefined;
    const playerId = router.query.playerId ? router.query.playerId as string : undefined;
    const location = router.query.locationSlug ? configStore.getLocation(router.query.locationSlug as string) : undefined;
    const drug = router.query.drugSlug ? configStore.getDrug(router.query.drugSlug as string) : undefined;
    const tradeDirection = router.query.tradeDirection ?
      (router.query.tradeDirection as string) === "buy" ? TradeDirection.Buy : TradeDirection.Sell
      : undefined;

    const isAdmin = router.pathname.startsWith('/admin')
    const isRyoDotGame = window.location.host === "ryo.game"

    const ctx = {
      router,
      gameId,
      playerId,
      location,
      drug,
      tradeDirection,
      isAdmin,
      isRyoDotGame
    }

    setContext(ctx)

  }, [router, router.isReady, configStore, configStore.config])


  return context

}



