import { useAccount, useConnect } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { ControllerConnector } from "@cartridge/connector";

export const useControllerUsername = (address: string) => {
  const { connector } = useConnect();

  const [username, setUsername] = useState("");
  const [isController, setIsController] = useState(false);

  const refetch = async () => {
    const username = await (connector as unknown as ControllerConnector).username();
    setUsername(username || "");
  };
  useEffect(() => {
    if (connector?.id.includes("controller")) {
      setIsController(true);
      refetch();
    } else {
      setIsController(false);
      setUsername("");
    }
  }, [connector, address]);

  return { username, isController, refetch };
};
