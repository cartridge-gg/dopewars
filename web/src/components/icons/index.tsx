import { Icon as ChakraIcon, IconProps as ChakraIconProps, ThemingProps } from "@chakra-ui/react";
import React from "react";

export interface IconProps extends ChakraIconProps, ThemingProps {
  size?: string;
}

export const Icon = ({ children, ...rest }: { children: React.ReactElement<SVGPathElement> } & IconProps) => {
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
export * from "./BorderImage";
export * from "./Car";
export * from "./Cart";
export * from "./Chat";
export * from "./Cigarette";
export * from "./Clock";
export * from "./Close";
export * from "./Cops";
export * from "./DollarBag";
export * from "./Dots";
export * from "./DynamicHeart";
export * from "./Event";
export * from "./ExternalLink";
export * from "./Fist";
export * from "./Flipflop";
export * from "./Gang";
export * from "./Gem";
export * from "./Heart";
export * from "./Home";
export * from "./Infos";
export * from "./Link";
export * from "./Music";
export * from "./Paper";
export * from "./Pawnshop";
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
export * from "./Weigth";
export * from "./Katana";
export * from "./Refresh";
export * from "./Laundromat";
export * from "./DynamicReputation";
export * from "./WalletModal";

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
