import { tableAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys)

const baseStyle = definePartsStyle({
  // define the part you're going to style
  th:{
    borderBottom: "solid 1px",  
    borderBottomColor:"neon.600"
  },
  td: {
    borderBottom: "solid 1px",  
    borderBottomColor:"neon.600"
  },
})

export const Table = defineMultiStyleConfig({ baseStyle })


