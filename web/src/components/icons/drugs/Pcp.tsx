import { Icon, IconProps } from "..";

export const Pcp = (props: IconProps) => {
  return (
    <Icon {...props}>
      <>
        <rect x="2" y="2.5" width="20" height="20" rx="1" fill="url(#pcp)" />
        <defs>
          <pattern
            id="pcp"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use xlinkHref="#image0_1_290" transform="scale(0.0625)" />
          </pattern>
          <image
            id="image0_1_290"
            width="16"
            height="16"
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAAANklEQVQ4EWNgGAWDMAT+r8/8D8K4nIYuz4RLIcni/18DbQZimEZ0m9DlYeqo5wKYiaP0AIQAAAANH9HukMrfAAAAAElFTkSuQmCC"
          />
        </defs>
      </>
    </Icon>
  );
};
