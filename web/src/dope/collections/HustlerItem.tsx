import { useState } from "react";
import { ParsedToken } from "@/dope/hooks";
import CardAnim from "./CardAnim";
import Link from "next/link";
import { Cigarette } from "@/components/icons";
import { Box } from "@chakra-ui/react";
import { ControllerConnector } from "@cartridge/connector";
import { useDojoContext } from "@/dojo/hooks";
import { useConnect } from "@starknet-react/core";
import { Cartridge } from "@/components/icons/branding/Cartridge";

export default function HustlerItem({ token }: { token: ParsedToken }) {
  const id = BigInt(token.token_id || "0");
  const { connector } = useConnect();
  const {
    contracts: { getDojoContract },
  } = useDojoContext();

  const [details, setDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const hustlersAddress = getDojoContract("dope-DopeHustlers").address!;
  const onOpenController = (e: any) => {
    e.preventDefault();
    (connector as unknown as ControllerConnector).controller.openProfileTo(
      `inventory/collection/${hustlersAddress}/token/0x${token.token_id.toString(16).padStart(64, "0")}`,
    );
  };
  return (
    <Box display="flex" flexDirection="column">
      <Box position="relative">
        <Link href={`/dope/editor/${id}`}>
          {/* @ts-ignore  */}
          <CardAnim onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <>
              {token.metadata && token.metadata.image !== "" ? (
            
                <img className="aspect-square w-full mb-1" src={token.metadata.image} loading="lazy" draggable="false" />
              ) : (
                <img className="aspect-square w-full mb-1" src="/public/images/dope-smiley.svg" draggable="false"/>
              )}

              {/* {details && (
                <Box
                  className="absolute bottom-0 w-full flex flex-col gap-1 text-xs p-3 bg-[#000000cc]"
                  position="absolute"
                  bottom={0}
                  w="full"
                  display="flex"
                  flexDirection="column"
                  p={3}
                >
                  {token.metadata.attributes?.map((attribute, idx) => {
                    return (
                      <div key={idx} className="flex flex-row">
                        <div className="min-w-[60px]">{attribute.trait_type.toUpperCase()}</div>
                        <div className="break-normal">{attribute.value}</div>
                      </div>
                    );
                  })}
                </Box>
              )} */}
              {isHovered && (
                <Box position="absolute" right={1} top={1} cursor="pointer" onClick={onOpenController}   bg="#33333366">
                  <Cartridge />
                </Box>
              )}
            </>
          </CardAnim>
        </Link>
      </Box>
      {/* <Box className="flex flex-row justify-between" display="flex" flexDirection="row" justifyContent="space-between">
        <Link href={`/dope/editor/${id}`}>Hustler #{id.toString()}</Link>

        <div>
          <div className="cursor-pointer" onMouseEnter={() => setDetails(true)} onMouseLeave={() => setDetails(false)}>
            <Cigarette />
          </div>
        </div>
      </Box> */}
    </Box>
  );
}
