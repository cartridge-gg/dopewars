import {
  Icon as ChakraIcon,
  IconProps as ChakraIconProps,
} from "@chakra-ui/react";
import { ThemingProps } from "@chakra-ui/styled-system";
import React from "react";

export interface IconProps extends ChakraIconProps, ThemingProps {}

export const Icon = ({
  children,
  ...rest
}: { children: React.ReactElement<SVGPathElement> } & IconProps) => {
  return (
    <ChakraIcon viewBox="0 0 24 24" fill="currentColor" {...rest}>
      {children}
    </ChakraIcon>
  );
};

// icons from old design
export * from "./City";
export * from "./Chat";
export * from "./Cart";
export * from "./Road";
export * from "./User";
export * from "./Check";
export * from "./Users";
export * from "./Clock";
export * from "./Arrow"; // up, down, right, left variant
export * from "./Wallet";
export * from "./Argent";
export * from "./Avatar";
export * from "./Connect";
export * from "./Sparkle"; // has mirrored variant
export * from "./Calendar";
export * from "./Cigarette";
export * from "../branding/Cartridge";
export * from "./Disconnect";

// Template for adding new icons. When copying svg from figma, make sure to
// select parent bounding box so dimension is 24x24
//
// import { Icon, IconProps } from ".";
//
// export const IconName = (props: IconProps) => {
//   return (
//     <Icon {...props}>
//       <path />
//     </Icon>
//   );
// };
