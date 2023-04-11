import { Icon, IconProps } from "..";

export const Ludes = (props: IconProps) => {
  return (
    <Icon {...props}>
      <>
        <rect x="2" y="2.5" width="20" height="20" rx="1" fill="url(#ludes)" />
        <defs>
          <pattern
            id="ludes"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use xlinkHref="#image0_1_270" transform="scale(0.0625)" />
          </pattern>
          <image
            id="image0_1_270"
            width="16"
            height="16"
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAAAI0lEQVQ4EWNgGAXDLQR+/PzxH4Rh/iLEB6ljgikepUd0CAAAoAoXc+dqwX0AAAAASUVORK5CYII="
          />
        </defs>
      </>
    </Icon>
  );
};
