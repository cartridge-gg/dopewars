import { Home } from './../../components/icons/Home';
import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DrugConfigFull, LocationConfigFull } from "../stores/config";
import { TradeDirection } from "../types";
import { useConfigStore } from "./useConfigStore";
import { selector } from "starknet";

type RouterContext = {
  router: NextRouter;
  gameId: string | undefined;
  playerId: string | undefined;
  seasonId: number | undefined;
  location: LocationConfigFull | undefined;
  drugSlug: string | undefined;
  // drug: DrugConfigFull | undefined,
  tradeDirection: TradeDirection | undefined;
  isAdmin: boolean;
  isRyoDotGame: boolean;
  isLocalhost: boolean;
};

const password = BigInt("0x03fbe61f91d65aebd1b8e36ad746ea25f8a5e728ab30700acb0f940d05bfcf79");
const restrictedPages = ["/admin", "/devtools"];

export const useRouterContext = (): RouterContext => {
  const router = useRouter();
  const configStore = useConfigStore();

  const [context, setContext] = useState<RouterContext>({
    router,
    gameId: undefined,
    playerId: undefined,
    seasonId: undefined,
    location: undefined,
    // drug: undefined,
    drugSlug: undefined,
    tradeDirection: undefined,
    isAdmin: false,
    isRyoDotGame: false,
    isLocalhost: false,
  });

  useEffect(() => {
    if (!router || !router.isReady || !configStore || !configStore.config) return;

    const gameId = router.query.gameId ? (router.query.gameId as string) : undefined;
    const playerId = router.query.playerId ? (router.query.playerId as string) : undefined;
    const seasonId = router.query.seasonId ? Number(router.query.seasonId) : undefined;
    const location = router.query.locationSlug
      ? configStore.getLocation(router.query.locationSlug as string)
      : undefined;
    // const drug = router.query.drugSlug ? configStore.getDrug(router.query.drugSlug as string) : undefined;
    const drugSlug = router.query.drugSlug ? (router.query.drugSlug as string) : undefined;

    const tradeDirection = router.query.tradeDirection
      ? (router.query.tradeDirection as string) === "buy"
        ? TradeDirection.Buy
        : TradeDirection.Sell
      : undefined;

    const isLocalhost = window.location.host.startsWith("localhost")
    const isRyoDotGame = window.location.host === "ryo.game";

    const pass = router.query.admin
      ? selector.starknetKeccak(router.query.admin as string)
      : BigInt(localStorage.getItem("adminToken") || 0);

    const isAdmin = password === pass;

    if (isAdmin) {
      localStorage.setItem("adminToken", pass.toString());
    } else {
      localStorage.removeItem("adminToken");
    }

    if (restrictedPages.includes(router.pathname) && !isAdmin) {
      router.replace("/");
    }

    const ctx = {
      router,
      gameId,
      playerId,
      seasonId,
      location,
      // drug,
      drugSlug,
      tradeDirection,
      isAdmin,
      isRyoDotGame,
      isLocalhost
    };

    setContext(ctx);
  }, [router, router.isReady, configStore, configStore.config]);

  return context;
};
