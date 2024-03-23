import { useDojoContext } from "@/dojo/hooks";
import { Button, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { Wallet } from "../icons/archive";
import { BurnerManagerUi } from "./ui/BurnerManagerUi";

export const Burners = () => {
  const { burnerManager } = useDojoContext();

  if (!burnerManager) return null;
  return (
    <Menu>
      <MenuButton as={Button} variant="pixelated" h="48px" /*rightIcon={<Arrow direction='down' />}*/>
        <Wallet />
      </MenuButton>
      <MenuList>
        <BurnerManagerUi burnerManager={burnerManager} />
      </MenuList>
    </Menu>
  );
};
