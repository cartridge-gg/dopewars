import CartridgeConnector from "@cartridge/connector";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";

export const useControllerUsername = () => {
  const { connector } = useAccount();

  const [username, setUsername] = useState("");
  const [isController, setIsController] = useState(false);

  useEffect(() => {
    const init = async () => {
      const username = await (connector as unknown as CartridgeConnector).username();
      setUsername(username || "");
    };
    if (connector?.id.includes("cartridge")) {
        setIsController(true)
      init();
    }else {
        setIsController(false)
        setUsername("")
    }
  }, [connector]);

  return { username, isController };
};
