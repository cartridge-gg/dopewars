import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Button } from "../common/Button";

export function ColorPicker({
  colors,
  selectedColor,
  setSelectedColor,
}: {
  colors: string[];
  selectedColor: number;
  setSelectedColor: (e: number) => void;
}) {
  return (
    <Popover className="relative">
      <PopoverButton
        className="w-6 h-6 p-1 border-2 border-neon-500"
        style={{ background: colors[selectedColor] }}
      />
      <PopoverPanel
        anchor="right"
        className="flex flex-wrap gap-2 p-3 w-auto bg-gray-900 border border-neon-500 shadow-lg"
      >
        {colors.map((color, index) => {
          return (
            <Button
              key={color}
              onClick={() => setSelectedColor(index)}
              className="!w-6 !h-6 !min-w-6 !p-0 !m-0 !border !border-neon-500 !rounded-none"
              style={{ background: color }}
            >
              <></>
            </Button>
          );
        })}
      </PopoverPanel>
    </Popover>
  );
}
