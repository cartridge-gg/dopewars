import { useDojoContext } from "@/dojo/hooks";
import { Button, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { useAccount, useConnect } from "@starknet-react/core";
import { Wallet } from "../icons/archive";
import { BurnerManagerUi } from "./ui/BurnerManagerUi";

export const Burners = () => {
  const { burnerManager } = useDojoContext();
  const { connector } = useConnect();
  const { account } = useAccount();

  if (!burnerManager) return null;
  if (!account) return null;
  if (!connector) return null;
  if (connector?.id !== "dojoburner") return null;
  return (
    <Menu>
      <MenuButton as={Button} variant="pixelated" h="40px" /*rightIcon={<Arrow direction='down' />}*/>
        <Wallet />
      </MenuButton>
      <MenuList>
        <BurnerManagerUi burnerManager={burnerManager} />
      </MenuList>
    </Menu>
  );
};
