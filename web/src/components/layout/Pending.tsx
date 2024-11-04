import { useSystems } from "@/dojo/hooks";
import { Box } from "@chakra-ui/react";
import { blinkAnim } from "../player";

export const Pending = () => {
  const { isPending } = useSystems();
  if (!isPending) return null;
  return (
    <>
      <Box
        animation={`${blinkAnim} infinite 0.5s linear`}
        position="fixed"
        top="0"
        left="0"
        width="10px"
        height="10px"
        bg="neon.200"
      ></Box>
    </>
  );
};
