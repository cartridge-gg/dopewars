import { useCallback, useEffect, useState } from "react";
import {
  Account,
  CallData,
  ec,
  hash,
  RpcProvider,
  stark,
  TransactionStatus,
} from "starknet";
import Storage from "@/utils/storage";
import { ETH_CONTRACT_ADDRESS } from "@/constants";

const PREFUND_AMOUNT = "0x8AC7230489E80000"; // 10ETH

const provider = new RpcProvider({
  nodeUrl: process.env.NEXT_PUBLIC_RPC_ENDPOINT!,
});

const admin = new Account(
  provider,
  process.env.NEXT_PUBLIC_ADMIN_ADDRESS!,
  process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY!,
);

type BurnerStorage = {
  [address: string]: {
    privateKey: string;
    publicKey: string;
    deployTx: string;
    active: boolean;
  };
};

export const useBurner = () => {
  const [account, setAccount] = useState<Account>();
  const [isDeploying, setIsDeploying] = useState(false);

  // init
  useEffect(() => {
    const storage: BurnerStorage = Storage.get("burners");
    if (storage) {
      // check one to see if exists, perhaps appchain restarted
      const firstAddr = Object.keys(storage)[0];
      admin.getTransactionReceipt(storage[firstAddr].deployTx).catch(() => {
        setAccount(undefined);
        Storage.remove("burners");
        throw new Error("burners not deployed, chain may have restarted");
      });

      // set active account
      for (let address in storage) {
        if (storage[address].active) {
          const burner = new Account(
            provider,
            address,
            storage[address].privateKey,
          );
          setAccount(burner);
          return;
        }
      }
    }
  }, []);

  const list = useCallback(() => {
    let storage = Storage.get("burners") || {};
    return Object.keys(storage).map((address) => {
      return {
        address,
        active: storage[address].active,
      };
    });
  }, []);

  const select = useCallback((address: string) => {
    let storage = Storage.get("burners") || {};
    if (!storage[address]) {
      throw new Error("burner not found");
    }

    for (let addr in storage) {
      storage[addr].active = false;
    }
    storage[address].active = true;

    Storage.set("burners", storage);
    const burner = new Account(provider, address, storage[address].privateKey);
    setAccount(burner);
  }, []);

  const create = useCallback(async () => {
    setIsDeploying(true);
    const privateKey = stark.randomAddress();
    const publicKey = ec.starkCurve.getStarkKey(privateKey);
    const address = hash.calculateContractAddressFromHash(
      publicKey,
      process.env.NEXT_PUBLIC_ACCOUNT_CLASS_HASH!,
      CallData.compile({ publicKey }),
      0,
    );

    await prefundAccount(address, admin);

    // deploy burner
    const burner = new Account(provider, address, privateKey);
    const { transaction_hash: deployTx } = await burner.deployAccount({
      classHash: process.env.NEXT_PUBLIC_ACCOUNT_CLASS_HASH!,
      constructorCalldata: CallData.compile({ publicKey }),
      addressSalt: publicKey,
    });

    // save burner
    let storage = Storage.get("burners") || {};
    for (let address in storage) {
      storage[address].active = false;
    }
    storage[address] = {
      privateKey,
      publicKey,
      deployTx,
      active: true,
    };

    setAccount(burner);
    setIsDeploying(false);
    Storage.set("burners", storage);
    console.log("burner created: ", address);

    return address;
  }, []);

  return {
    list,
    select,
    create,
    account,
    isDeploying,
  };
};

const prefundAccount = async (address: string, account: Account) => {
  const { transaction_hash } = await account.execute({
    contractAddress: ETH_CONTRACT_ADDRESS,
    entrypoint: "transfer",
    calldata: CallData.compile([address, PREFUND_AMOUNT, "0x0"]),
  });

  return await account.waitForTransaction(transaction_hash, {
    retryInterval: 1000,
    successStates: [TransactionStatus.ACCEPTED_ON_L2],
  });
};
