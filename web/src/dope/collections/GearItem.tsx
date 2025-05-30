import { ParsedToken } from "@/dope/hooks";
import CardAnim from "./CardAnim";
import { Box } from "@chakra-ui/react";
import { useConnect } from "@starknet-react/core";
import { useDojoContext } from "@/dojo/hooks";
import { useState } from "react";
import { ControllerConnector } from "@cartridge/connector";
import { Cartridge } from "@/components/icons/branding/Cartridge";

export default function GearItem({ token, balance }: { token: ParsedToken; balance?: number }) {
  const id = BigInt(token.token_id || "0");
  const slot = token.metadata?.attributes?.find((i: any) => i.trait_type === "Slot");

  const { connector } = useConnect();
  const {
    contracts: { getDojoContract },
  } = useDojoContext();

  const [details, setDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const gearAddress = getDojoContract("dope-DopeGear").address!;
  const onOpenController = (e: any) => {
    e.preventDefault();
    (connector as unknown as ControllerConnector).controller.openProfileTo(
      `inventory/collectible/${gearAddress}/token/0x${token.token_id.toString(16).padStart(64, "0")}`,
    );
  };

  return (
    <Box position="relative">
      {/* @ts-ignore */}
      <CardAnim onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <Box position="relative">
          {token.metadata && token.metadata.image !== "" ? (
            <img className="aspect-square w-full mb-1" src={token.metadata.image} loading="lazy" />
          ) : (
            <img className="aspect-square w-full mb-1" src="/public/images/dope-smiley.svg" />
          )}
        </Box>
        <Box position="absolute" bottom={1} right={1} bg="#66666666" p={1}>
          x{balance}
        </Box>

        {isHovered && (
          <Box position="absolute" right={1} top={1} cursor="pointer" onClick={onOpenController} bg="#33333366">
            <Cartridge />
          </Box>
        )}
      </CardAnim>

      <Box className="flex flex-row gap-1 items-center justify-between">
        <div className="text-xs">#{id.toString()}</div>
        <div>
          {token.name} {token.symbol}
        </div>
        {/* <div className="uppercase">
          {slot && (
            <Box position="absolute" top={1} right={1}>
              {slot.value}
            </Box>
          )}
        </div> */}
      </Box>
    </Box>
  );
}
