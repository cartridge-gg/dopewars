import { Box } from "@chakra-ui/react";
import { Cigarette } from "../icons";
import { Avatar } from "../avatar/Avatar";

export const genders = {
  0: { name: "Male", icon: <Avatar name="PersonE" /> },
  1: { name: "Female", icon: <Avatar name="PersonQ" /> },
};

export function GenderSelector({
  selectedId,
  setSelectedId,
}: {
  selectedId: number;
  setSelectedId: (e: number) => void;
}) {
  const selected = genders[selectedId as keyof typeof genders] || genders[0];
  return (
    <Box cursor="pointer" bg="#666" p={1} onClick={() => setSelectedId((selectedId + 1) % Object.keys(genders).length)}>
      {selected.icon && selected.icon}
    </Box>
  );
}
