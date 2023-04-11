import { Icon, IconProps } from "..";

export const Krokodil = (props: IconProps) => {
  return (
    <Icon {...props}>
      <>
        <rect
          x="2"
          y="2.5"
          width="20"
          height="20"
          rx="1"
          fill="url(#krokodil)"
        />
        <defs>
          <pattern
            id="krokodil"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use xlinkHref="#image0_1_284" transform="scale(0.0625)" />
          </pattern>
          <image
            id="image0_1_284"
            width="16"
            height="16"
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAAAVUlEQVQ4EWNgGAVYQ+D4iTP/QRgmic6HiYNoJmQO1dhftbT+gzDMQHQ+TBxEU+wCFmTT4GwdHQjz2jUIjc6HK6SZCzQ1kewAMtH5SLIUhwGSWSOWCQDNtRtFkYE7aQAAAABJRU5ErkJggg=="
          />
        </defs>
      </>
    </Icon>
  );
};
