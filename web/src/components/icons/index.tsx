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
    <ChakraIcon viewBox="0 0 36 36" fill="currentColor" {...rest}>
      {children}
    </ChakraIcon>
  );
};

export * from "./Alert";
export * from "./Arrest";
export * from "./Arrow";
export * from "./ArrowEnclosed";
export * from "./ArrowInput";
export * from "./Bag";
export * from "./Car";
export * from "./Cart";
export * from "./Chat";
export * from "./Clock";
export * from "./Close";
export * from "./DollarBag";
export * from "./Dots";
export * from "./DynamicHeart";
export * from "./Event";
export * from "./ExternalLink";
export * from "./Fist";
export * from "./Flipflop";
export * from "./Gem";
export * from "./Heart";
export * from "./Home";
export * from "./Link";
export * from "./Music";
export * from "./Pistol";
export * from "./Roll";
export * from "./SendMessage";
export * from "./Siren";
export * from "./Skull";
export * from "./Sound";
export * from "./Sparkles";
export * from "./Trophy";
export * from "./Truck";
export * from "./Twitter";
export * from "./User";
export * from "./Warning";


// Template for adding new icons. When copying svg from figma, viewBox is assumed
// to be 36x36, otherwise override within individual icons.
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
