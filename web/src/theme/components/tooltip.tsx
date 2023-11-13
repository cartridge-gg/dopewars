import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

// define the base component styles
const baseStyle = {
  bgColor: "neon.800",
  color: "yellow.400",
  border: "solid 1px"
}

// export the component theme
export const Tooltip = defineStyleConfig({ baseStyle })