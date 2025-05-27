import { ParsedToken } from "@/dope/hooks";
import CardAnim from "./CardAnim";
import { Box } from "@chakra-ui/react";

export default function GearItem({ token, balance }: { token: ParsedToken; balance?: number }) {
  const id = BigInt(token.token_id || "0");
  const slot = token.metadata?.attributes?.find((i: any) => i.trait_type === "Slot");

  return (
    <Box position="relative">
      <CardAnim>
        <Box position="relative">
          {token.metadata && token.metadata.image !== "" ? (
            <img className="aspect-square w-full mb-1" src={token.metadata.image} loading="lazy" />
          ) : (
            <img className="aspect-square w-full mb-1" src="/public/images/dope-smiley.svg" />
          )}
        </Box>
        <Box position="absolute" top={1} right={1} bg="#66666666" p={1} >
          x{balance}
        </Box>
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
