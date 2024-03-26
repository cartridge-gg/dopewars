import { useDojoContext } from "@/dojo/hooks";
import { Button, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { useAccount, useConnect } from "@starknet-react/core";
import { Wallet } from "../icons/archive";
import { PredeployedManagerUi } from "./ui/PredeployedManagerUi";

export const Predeployed = () => {
  const { predeployedManager } = useDojoContext();
  const { connector, isConnected } = useConnect();
  const { account } = useAccount();

  if (!predeployedManager) return null;
  if (!account) return null;
  if (!connector) return null;
  if (connector?.id !== "dojopredeployed") return null;
  return (
    <Menu>
      <MenuButton as={Button} variant="pixelated" h="48px" /*rightIcon={<Arrow direction='down' />}*/>
        <Wallet />
      </MenuButton>
      <MenuList>
        <PredeployedManagerUi predeployedManager={predeployedManager} />
      </MenuList>
    </Menu>
  );
};
