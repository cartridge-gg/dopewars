import { menuAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

const baseStyle = definePartsStyle({
  button: {
    // this will style the MenuButton component
  },
  list: {
    // this will style the MenuList component
  },
  item: {
    // this will style the MenuItem and MenuItemOption components
    _hover: {
      bg: "neon.600",
    },
    _focus: {
      bg: "transparent",
    },
  },
  groupTitle: {
    // this will style the text defined by the title prop
    // in the MenuGroup and MenuOptionGroup components
  },
  command: {
    // this will style the text defined by the command
    // prop in the MenuItem and MenuItemOption components
  },
  divider: {
    // this will style the MenuDivider component
  },
});
// export the base styles in the component theme
export const Menu = defineMultiStyleConfig({ baseStyle });
