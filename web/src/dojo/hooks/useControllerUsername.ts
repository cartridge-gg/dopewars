import { useAccount, useConnect } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { ControllerConnector } from "@cartridge/connector";

export const useControllerUsername = () => {
  const { connector } = useConnect();

  const [username, setUsername] = useState("");
  const [isController, setIsController] = useState(false);

  useEffect(() => {
    const init = async () => {
      const username = await (connector as unknown as ControllerConnector).username();
      setUsername(username || "");
    };
    if (connector?.id.includes("controller")) {
      setIsController(true);
      init();
    } else {
      setIsController(false);
      setUsername("");
    }
  }, [connector]);

  return { username, isController };
};
