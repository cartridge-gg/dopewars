import { Layer } from "@/dope/components";
import { ComponentValueEvent } from "@/dope/store";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Button } from "../common/Button";

export function ComponentValuesSelector({
  componentValues,
  setSelectedComponentValue,
  selectedComponentValueId,
  index = 0,
}: {
  componentValues: ComponentValueEvent[];
  setSelectedComponentValue: (e: ComponentValueEvent) => void;
  selectedComponentValueId?: number;
  index?: number;
}) {
  if (!componentValues) {
    // console.warn("warning: no componentValues :(")
    return null;
  }

  const selectedComponentValue = componentValues.find((i) => i.id === (selectedComponentValueId || 0));

  if (!selectedComponentValue) {
    // console.warn("warning: no selectedComponentValue :(")
    return null;
  }
  return (
    <Popover className="relative">
      <PopoverButton className="bg-[#666] box-content w-6 h-6 p-1 cursor-pointer">
        {!selectedComponentValue?.resources && <>{selectedComponentValue?.value}</>}
        {selectedComponentValue?.resources && (
          <Layer rects={selectedComponentValue.resources[index]} width="24px" height="24px" crop={true} />
        )}
      </PopoverButton>
      <PopoverPanel
        anchor="right"
        className="w-[230px] flex flex-wrap gap-2 p-2 bg-gray-900 border border-neon-500 shadow-lg"
      >
        {componentValues &&
          componentValues.map((t: ComponentValueEvent) => {
            return (
              <Button
                key={t.id}
                className="px-0 py-0 rounded-none w-[48px] h-[48px] bg-[#666] hover:bg-[#777] !border-none"
                onClick={() => {
                  setSelectedComponentValue(t);
                }}
              >
                {!t.resources && t.value}
                {t.resources && <Layer rects={t.resources[index]} width="48px" height="48px" crop={true} />}
              </Button>
            );
          })}
      </PopoverPanel>
    </Popover>
  );
}
