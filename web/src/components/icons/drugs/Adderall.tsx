import { Icon, IconProps } from "..";

export const Adderall = (props: IconProps) => {
  return (
    <Icon {...props}>
      <>
        <rect
          x="2"
          y="2.5"
          width="20"
          height="20"
          rx="1"
          fill="url(#adderall)"
        />
        <defs>
          <pattern
            id="adderall"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use xlinkHref="#image0_1_302" transform="scale(0.0625)" />
          </pattern>
          <image
            id="image0_1_302"
            width="16"
            height="16"
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAAAP0lEQVQ4EWNgGAWDMAQ+rGD4D8LEOo2JWIW41LFgSFjuhQo5g+kPD/dCXHMcwheIYGBE1kOxC5ANG2UPVAgAAKKeC3CF/rpxAAAAAElFTkSuQmCC"
          />
        </defs>
      </>
    </Icon>
  );
};
