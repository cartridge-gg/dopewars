import { Box, Popover, PopoverBody, PopoverContent, PopoverTrigger } from "@chakra-ui/react";
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
    <Popover placement="right">
      <PopoverTrigger>
        <Box
          w="24px"
          h="24px"
          p={1}
          borderWidth="2px"
          borderColor="neon.500"
          style={{ background: colors[selectedColor] }}
        ></Box>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody w="auto" display="flex" flexWrap="wrap" gap={2} p={3}>
          {colors.map((color, index) => {
            return (
              <Button
                key={color}
                onClick={() => setSelectedColor(index)}
                w="24px"
                h="24px"
                minW="24px"
                p={0}
                m={0}
                border="solid 1px !important"
                borderColor="neon.500"
                borderRadius={0}
                style={{ background: color }}
              >
                <></>
              </Button>
            );
          })}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
