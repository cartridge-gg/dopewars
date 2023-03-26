import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

export const Avatar = (props: SvgProps) => (
  <Svg width={24} height={24} fill="currentColor" {...props}>
    <Path d="M6.6 6.6h1.8v1.8H6.6V6.6ZM8.4 6.6h1.8v1.8H8.4V6.6ZM8.4 4.8h1.8v1.8H8.4V4.8Z" />
    <Path d="M10.2 6.6H12v1.8h-1.8V6.6ZM12 6.6h1.8v1.8H12V6.6ZM8.4 13.8h1.8v1.8H8.4v-1.8ZM13.8 13.8h1.8v1.8h-1.8v-1.8ZM4.8 12h1.8v1.8H4.8V12ZM17.4 13.8h1.8v1.8h-1.8v-1.8ZM17.4 12h1.8v1.8h-1.8V12ZM4.8 13.8h1.8v1.8H4.8v-1.8ZM10.2 17.4H12v1.8h-1.8v-1.8Z" />
    <Path d="M10.2 15.6H12v1.8h-1.8v-1.8ZM12 17.4h1.8v1.8H12v-1.8ZM12 15.6h1.8v1.8H12v-1.8ZM10.2 10.2H12V12h-1.8v-1.8ZM12 10.2h1.8V12H12v-1.8ZM13.8 6.6h1.8v1.8h-1.8V6.6ZM13.8 4.8h1.8v1.8h-1.8V4.8Z" />
    <Path d="M8.4 8.4h1.8v1.8H8.4V8.4ZM13.8 8.4h1.8v1.8h-1.8V8.4ZM15.6 6.6h1.8v1.8h-1.8V6.6Z" />
  </Svg>
);
