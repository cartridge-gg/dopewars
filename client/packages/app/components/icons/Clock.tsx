import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

export const Clock = (props: SvgProps) => (
  <Svg width={24} height={24} fill="currentColor" {...props}>
    <Path d="M18.5 12a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0ZM4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0Zm7.25-4.25v4.65l.334.222 3 2 .625.415.832-1.246-.625-.416L12.75 11.6V7h-1.5v.75Z" />
  </Svg>
);
