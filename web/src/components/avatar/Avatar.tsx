import {
  Icon as ChakraIcon,
  IconProps as ChakraIconProps,
  ThemingProps,
} from "@chakra-ui/react";
import React from "react";
import { AvatarName, avatars } from "./avatars";

export interface AvatarProps extends ChakraIconProps, ThemingProps {
  color?: "green" | "yellow";
  hasCrown?: boolean;
  name: AvatarName;
}

export interface AvatarPathProps {
  color: "green" | "yellow";
  hasCrown?: boolean;
}

export const Avatar = ({
  color = "green",
  hasCrown,
  name,
  ...props
}: AvatarProps) => {
  return (
    <ChakraIcon viewBox="0 0 60 60" fill="none" {...props}>
      {React.createElement(avatars[name] || avatars.PersonA, {
        color,
        hasCrown,
      })}
    </ChakraIcon>
  );
};
