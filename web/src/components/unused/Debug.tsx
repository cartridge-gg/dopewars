import { useGameStore, useRouterContext } from "@/dojo/hooks";
import { IsMobile } from "@/utils/ui";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";

import { JsonView, darkStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

const Debug = () => {

  const { game } = useGameStore();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement|null>(null);
  
  return (
    <>
      <Button ref={btnRef} onClick={onOpen}>
        Debug
      </Button>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
        {/* <DrawerOverlay /> */}
        <DrawerContent >
          <DrawerCloseButton zIndex={99}/>
          {/* <DrawerHeader>State</DrawerHeader> */}

          <DrawerBody fontFamily="consolas" fontSize="12px" p={0}>
            <JsonView
              data={game as Object}
              style={darkStyles}
              shouldExpandNode={(level) => {
                return level <= 1;
              }} /*shouldExpandNode={allExpanded}*/
            />
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Debug;
