// Mock for @/dope/components - renders placeholder boxes instead of hustler previews
import React from "react";
import { Box } from "@chakra-ui/react";

const Placeholder = (props: any) => (
  <Box
    bg="neon.900"
    border="1px solid"
    borderColor="neon.700"
    {...props}
  />
);

export const HustlerPreview = (props: any) => <Placeholder w="100%" h="100%" {...props} />;
export const HustlerPreviewFromLoot = (props: any) => <Placeholder w="100%" h="100%" {...props} />;
export const HustlerPreviewFromHustler = (props: any) => <Placeholder w="100%" h="100%" {...props} />;
export const HustlerBody = (props: any) => <Placeholder {...props} />;
export const HustlerEquipment = (props: any) => <Placeholder {...props} />;
export const Layer = (props: any) => <Placeholder {...props} />;
export const defaultHustlerMetadata = {};
