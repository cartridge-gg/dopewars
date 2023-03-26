import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

export const Bell = (props: SvgProps) => (
  <Svg width={24} height={24} fill="currentColor" {...props}>
    <Path d="M10.75 6H10v1.5h1.25v1.04A7 7 0 0 0 5 15.5h14a7 7 0 0 0-6.25-6.96V7.5H14V6h-3.25Zm-6 10.5H4V18h16v-1.5H4.75Z" />
  </Svg>
);
