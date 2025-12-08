import { Rect } from "../helpers";

export function Layer({
  rects,
  crop = false,
  width = "100%",
  height = "100%",
  pixelSize = 5,
  imageWidth = 64,
  imageHeight = 64,
  glow = 0,
}: // bgColor = "transparent"

{
  rects?: Rect[];
  crop?: boolean;
  width?: string;
  height?: string;
  pixelSize?: number;
  imageWidth?: number;
  imageHeight?: number;
  glow?: number;
  // bgColor?: string;
}) {
  if (!rects || rects.length === 0) {
    return <svg width={width} height={height}></svg>;
  }

  let viewBox = `0 0 ${imageWidth * pixelSize} ${imageHeight * pixelSize}`;
  if (crop) {
    const minX = rects.sort((a, b) => a.x - b.x)[0].x;
    const tempX = rects.sort((a, b) => a.x + a.width - (b.x + b.width))[rects.length - 1];
    const maxX = tempX.x + tempX.width;

    const minY = rects.sort((a, b) => a.y - b.y)[0].y;
    const tempY = rects.sort((a, b) => a.y + 1 - (b.y + 1))[rects.length - 1];
    const maxY = tempY.y + 1;

    viewBox = `${minX * pixelSize - pixelSize} ${minY * pixelSize - pixelSize} ${
      (maxX - minX) * pixelSize + pixelSize
    } ${(maxY - minY) * pixelSize + pixelSize}`;
  }

  let random = Math.ceil(Math.random() * 999_999_999);

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      shapeRendering="crispEdges"
      // style={{backgroundColor: bgColor}}
    >
      {/* <filter
          id={`glow`}
          color-interpolation-filters="linearRGB"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
        >
          <feComponentTransfer x="0%" y="0%" width="100%" height="100%" in="colormatrix1" result="componentTransfer">
            <feFuncR type="discrete" tableValues="0 1" />
            <feFuncG type="discrete" tableValues="0 1" />
            <feFuncB type="discrete" tableValues="0 1" />
            <feFuncA type="discrete" tableValues="0 1" />
          </feComponentTransfer>
          <feGaussianBlur
            stdDeviation={`${glow > 0 ? glow : 10} ${glow > 0 ? glow : 10}`}
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="componentTransfer"
            edgeMode="none"
            result="blur"
          />
          <feColorMatrix
            type="matrix"
            values=".5 0 0 0.1 0
                  0 .5 0 0.92 0
                  0 0 .5 0.51 0
                  0 0 0 .45 0"
            // values=".5 0 0 0.06 0
            //         0 .5 0 0.92 0
            //         0 0 .5 0.51 0
            //         0 0 0 .35 0"

            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="blur"
            result="colormatrix1"
          />
          <feMerge x="0%" y="0%" width="100%" height="100%" result="merge1">
            <feMergeNode in="colormatrix1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter> */}

      <g
      // style={{ filter: glow > 0 ? `url(#glow)` : "" }}
      >
        {rects.map((r) => {
          const x = r.x * pixelSize;
          const y = r.y * pixelSize;
          const w = r.width * pixelSize;
          const h = pixelSize;
          const color = r.color;
          return <rect key={x * 1000 + y} x={x} y={y} width={w} height={h} fill={color} />;
        })}
      </g>
    </svg>
  );
}
