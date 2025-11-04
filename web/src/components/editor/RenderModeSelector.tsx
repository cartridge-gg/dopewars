// import { CarIcon, PersonStandingIcon, ScanFaceIcon } from "lucide-react";

import { Box } from "@chakra-ui/react";
import { Car, Cigarette, User } from "../icons";

export const renderModes = {
  0: { name: "Default", icon: User },
  1: { name: "Full", icon: Car },
  2: { name: "Portrait", icon: Cigarette },
};

export function RenderModeSelector({
  selectedId,
  setSelectedId,
}: {
  selectedId: number;
  setSelectedId: (e: number) => void;
}) {
  const selected = renderModes[selectedId as keyof typeof renderModes];
  return (
    <Box
      cursor="pointer"
      bg="#666"
      p={1}
      onClick={() => setSelectedId((selectedId + 1) % Object.keys(renderModes).length)}
    >
      {selected.icon && <selected.icon />}
    </Box>
  );
}
