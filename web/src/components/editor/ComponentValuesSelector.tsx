import { Layer } from "@/dope/components";
import { ComponentValueEvent } from "@/dope/store";
import { Box, Popover, PopoverBody, PopoverContent, PopoverTrigger } from "@chakra-ui/react";
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
    <Popover placement="right">
      <PopoverTrigger>
        <Box bg="#666" boxSizing="content-box" w="24px" h="24px" p={1} cursor="pointer">
          {!selectedComponentValue?.resources && <>{selectedComponentValue?.value}</>}
          {selectedComponentValue?.resources && (
            <Layer rects={selectedComponentValue.resources[index]} width="24px" height="24px" crop={true} />
          )}
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody w="230px" display="flex" flexWrap="wrap" gap={2} p={2}>
          {componentValues &&
            componentValues.map((t: ComponentValueEvent) => {
              return (
                <Button
                  key={t.id}
                  px={0}
                  py={0}
                  w="48px"
                  h="48px"
                  border="none"
                  bg="#666"
                  borderRadius="0"
                  // className="px-O py-0 rounded-none w-[48px] h-[48px] bg-[#666] hover:bg-[#777]"
                  onClick={() => {
                    setSelectedComponentValue(t);
                  }}
                >
                  {!t.resources && t.value}
                  {t.resources && <Layer rects={t.resources[index]} width="48px" height="48px" crop={true} />}
                </Button>
              );
            })}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
