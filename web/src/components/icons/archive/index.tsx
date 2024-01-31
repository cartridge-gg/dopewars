import {
  Icon as ChakraIcon,
  IconProps as ChakraIconProps,
  ThemingProps,
} from "@chakra-ui/react";
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
export * from "../Cigarette";
export * from "../branding/Cartridge";
export * from "./Argent";
export * from "./Arrow"; // up, down, right, left variant
export * from "./Avatar";
export * from "./Calendar";
export * from "./Cart";
export * from "./Chat";
export * from "./Check";
export * from "./City";
export * from "./Clock";
export * from "./Connect";
export * from "./Disconnect";
export * from "./Road";
export * from "./Sparkle"; // has mirrored variant
export * from "./User";
export * from "./Users";
export * from "./Wallet";

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
