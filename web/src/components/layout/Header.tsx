import { HeaderButton, MediaPlayer } from "@/components/layout";
import { useDojoContext, useGameStore, useRouterContext } from "@/dojo/hooks";
import { initSoundStore } from "@/hooks/sound";
import { headerStyle } from "@/utils/borderStyles";
import { IsMobile, formatCashHeader } from "@/utils/ui";
import { cn } from "@/utils/cn";
import { useAccount } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import { ClaimReward } from "../pages/home";
import { ProfileLink } from "../pages/profile/Profile";
import { CashIndicator, DayIndicator, HealthIndicator } from "../player";
import { ConnectButton } from "../wallet/ConnectButton";

import DrawerMenu from "./DrawerMenu";
import { Cigarette } from "../icons";
import { ControllerConnector } from "@cartridge/connector";

export const Header = observer(() => {
  const isMobile = IsMobile();

  const { router, gameId } = useRouterContext();
  const { account, connector } = useAccount();
  const {
    uiStore,
    chains: { selectedChain },
  } = useDojoContext();
  const { game, gameConfig } = useGameStore();

  const { isMainnet, isSepolia } = useMemo(() => {
    return {
      isMainnet: selectedChain.chainConfig.network === "mainnet",
      isSepolia: selectedChain.chainConfig.network === "sepolia",
    };
  }, [selectedChain]);

  useEffect(() => {
    const init = async () => {
      await initSoundStore();
    };
    init();
  }, []);

  return (
    <div
      className={cn(
        "flex items-start w-full px-2.5 gap-2.5 z-50",
        isMobile ? "py-0 text-sm" : "py-4 text-base"
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        {!gameId && <ClaimReward />}
        {!gameId && router.route === "/" && account && (
          <HeaderButton
            className={cn(
              "flex flex-row items-center justify-center mr-6 py-2 text-sm",
              isMobile ? "h-10" : "h-12"
            )}
            onClick={() => {
              if (isMainnet || isSepolia) {
                const controllerConnector = connector as unknown as ControllerConnector;
                if (isSepolia) {
                  controllerConnector.controller.openStarterPack("dopewars-claim-sepolia");
                }
                if (isMainnet) {
                  controllerConnector.controller.openStarterPack("dopewars-claim-mainnet");
                }
              } else {
                router.push("/claim");
              }
            }}
          >
            <Cigarette className="mr-2" /> MIGRATION
          </HeaderButton>
        )}
      </div>

      {game && (
        <div
          className={cn(
            "flex items-center justify-center cursor-help",
            isMobile ? "flex-auto w-full" : "flex-1 w-auto"
          )}
          onClick={() => {
            uiStore.openSeasonDetails();
          }}
        >
          <div
            className={cn(
              "flex items-center justify-center bg-neon-700",
              isMobile ? "h-10 w-full px-5 gap-2.5" : "h-12 w-auto px-5 gap-7"
            )}
            style={headerStyle(isMobile)}
          >
            <div className="flex items-center justify-center gap-2.5 w-full">
              <div className="flex items-center gap-2">
                <CashIndicator cash={formatCashHeader(game.player.cash)} />
                <div className="w-px h-3 bg-neon-600" />
                <HealthIndicator health={game.player.health} maxHealth={gameConfig?.health} />
                <div className="w-px h-3 bg-neon-600" />
                <DayIndicator day={game.player.turn} max={gameConfig?.max_turns} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center flex-1 justify-end gap-2">
        {!isMobile && <ConnectButton />}
        {!isMobile && account && game && <ProfileLink />}

        {/* trick to allow autoplay.. */}
        <div className="hidden">
          <MediaPlayer />
        </div>

        <DrawerMenu />
      </div>
    </div>
  );
});
