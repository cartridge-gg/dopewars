import { Icon, IconProps } from "..";

export const Acid = (props: IconProps) => {
  return (
    <Icon {...props}>
      <>
        <rect
          x="2"
          y="2.5"
          width="20"
          height="20"
          rx="1"
          fill="url(#pattern0)"
        />
        <defs>
          <pattern
            id="pattern0"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use xlinkHref="#image0_1_272" transform="scale(0.0625)" />
          </pattern>
          <image
            id="image0_1_272"
            width="16"
            height="16"
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAAAU0lEQVQ4EWNgGAUDHwKMyE749zHsP4h/scMDLGzYngSWP185DyyuX7EDLM7EvwqujwksQgHBgqwXZjPMJoZ2iCyMD5NnYFgF10axC+AmjTIGMAQAbvISOw3gelsAAAAASUVORK5CYII="
          />
        </defs>
      </>
    </Icon>
  );
};
