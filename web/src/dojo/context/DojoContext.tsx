import { BurnerAccount, BurnerManager, useBurnerManager } from "@dojoengine/create-burner";
import { ReactNode, createContext, useContext, useMemo } from "react";
import { Account, Contract, RpcProvider, TypedContractV2 } from "starknet";
import { SetupResult } from "../setup/setup";
import { useConfigStore, ConfigStore } from "@/hooks/config";
import { getContractByName } from "@dojoengine/core";
import { configAbi } from "./configAbi";

interface DojoContextType extends SetupResult {
  masterAccount: Account;
  account: Account | null;
  burner: BurnerAccount;
  //   playerStore: PlayerStore;
  //   configStore: ConfigStore;
}

export const DojoContext = createContext<DojoContextType | null>(null);

export const DojoProvider = ({ children, value }: { children: ReactNode; value: SetupResult }) => {
  const currentValue = useContext(DojoContext);
  if (currentValue) throw new Error("DojoProvider can only be used once");

  const {
    config: { rpcUrl, masterAddress, masterPrivateKey, accountClassHash, manifest },
  } = value;

  const rpcProvider = useMemo(
    () =>
      new RpcProvider({
        nodeUrl: rpcUrl,
      }),
    [rpcUrl],
  );

  const masterAccount = useMemo(
    () => new Account(rpcProvider, masterAddress, masterPrivateKey, "1"),
    [rpcProvider, masterAddress, masterPrivateKey],
  );

  const { create, list, get, account, select, isDeploying, clear, copyToClipboard, applyFromClipboard } =
    useBurnerManager({
      burnerManager: new BurnerManager({
        masterAccount,
        accountClassHash,
        rpcProvider,
      }),
    });

  // const load = async () => {
  //   const contractInfos = manifest.contracts.find((i) => i.name === "rollyourown::config::config::config")!;
  //   const contract = new Contract(
  //     configAbi,
  //     contractInfos.address,
  //     rpcProvider,
  //   ).typedv2(configAbi);
  //   // const contractTyped = contract
  //   const res = await contract.get_config()
  //   // value.dojoProvider.callContract("config", "get_config", []).then((res) => {

  //   console.log(res);
  // };
  // load();

  return (
    <DojoContext.Provider
      value={{
        ...value,
        masterAccount,
        burner: {
          create,
          list,
          get,
          select,
          clear,
          account: account ? account : masterAccount,
          isDeploying,
          copyToClipboard,
          applyFromClipboard,
        },
        account,
      }}
    >
      {children}
    </DojoContext.Provider>
  );
};
