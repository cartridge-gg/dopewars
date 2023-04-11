import { Icon, IconProps } from "..";

export const Soma = (props: IconProps) => {
  return (
    <Icon {...props}>
      <>
        <rect x="2" y="2.5" width="20" height="20" rx="1" fill="url(#soma)" />
        <defs>
          <pattern
            id="soma"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use xlinkHref="#image0_1_296" transform="scale(0.0625)" />
          </pattern>
          <image
            id="image0_1_296"
            width="16"
            height="16"
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAAAOUlEQVQ4EWNgGAWDMAT+QwGxTmMiViEudSzoEr8foor8evD/P0iEVR4izggEyCoodgGyYaPsgQoBAOlpDd3aLGZuAAAAAElFTkSuQmCC"
          />
        </defs>
      </>
    </Icon>
  );
};
