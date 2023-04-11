import { Icon, IconProps } from "..";

export const Zoloft = (props: IconProps) => {
  return (
    <Icon {...props}>
      <>
        <rect x="2" y="2.5" width="20" height="20" rx="1" fill="url(#zoloft)" />
        <defs>
          <pattern
            id="zoloft"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use xlinkHref="#image0_1_280" transform="scale(0.0625)" />
          </pattern>
          <image
            id="image0_1_280"
            width="16"
            height="16"
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAAAQElEQVQ4EWNgGAVDKATub3jxH4TRncyELkAqnxFdw68H/8G2PL3wEiylGCABVgMTZ1NgRNFDsQvQHTDKH4gQAAB+LRHypZzcgQAAAABJRU5ErkJggg=="
          />
        </defs>
      </>
    </Icon>
  );
};
