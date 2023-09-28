import {
  StyleProps,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Menu,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { Dots, User, Roll } from "./icons";
import HeaderButton from "@/components/HeaderButton";
import MediaPlayer from "./MediaPlayer";
import { useRouter } from "next/router";
import { useDojo } from "@/dojo2/DojoContext";
import { formatAddress } from "@/utils/contract";

const MobileMenu = ({ ...props }: StyleProps /*& ButtonProps*/) => {
  const router = useRouter();
    const { account } = useDojo();
  return (
    <>
      <Popover placement="bottom-end">
        <PopoverTrigger>
          <HeaderButton w="48px">
            <Dots />
          </HeaderButton>
        </PopoverTrigger>
        <PopoverContent bg="neon.700" borderRadius={0} borderColor="neon.600">
          <PopoverBody p={0}>
            <Menu>
              <MenuItem _hover={{ bg: "transarent" }}>
                <MediaPlayer />
              </MenuItem>
              {/* <MenuItem icon={<Roll />} onClick={() => {}}>
                CREDITS
              </MenuItem> */}
              <MenuItem icon={<User />}>
                <>{account && formatAddress(account.address.toUpperCase())}</>
              </MenuItem>
            </Menu>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default MobileMenu;

{
  /* <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader>Confirmation!</PopoverHeader> */
}
