import { Rect } from "../helpers";

export function Layer({
  rects,
  crop = false,
  width = "100%",
  height = "100%",
  pixelSize = 5,
  imageWidth = 64,
  imageHeight = 64,
}: // bgColor = "transparent"
{
  rects?: Rect[];
  crop?: boolean;
  width?: string;
  height?: string;
  pixelSize?: number;
  imageWidth?: number;
  imageHeight?: number;
  // bgColor?: string;
}) {
  if (!rects || rects.length === 0) {
    return <svg width={width} height={height}></svg>;
  }

  let viewBox = `0 0 ${imageWidth * pixelSize} ${imageHeight * pixelSize}`;
  if (crop) {
    const minX = rects.sort((a, b) => a.x - b.x)[0].x;
    const tempX = rects.sort((a, b) => a.x + a.width - (b.x + b.width))[
      rects.length - 1
    ];
    const maxX = tempX.x + tempX.width;

    const minY = rects.sort((a, b) => a.y - b.y)[0].y;
    const tempY = rects.sort((a, b) => a.y + 1 - (b.y + 1))[rects.length - 1];
    const maxY = tempY.y + 1;

    viewBox = `${minX * pixelSize - pixelSize} ${
      minY * pixelSize - pixelSize
    } ${(maxX - minX) * pixelSize + pixelSize} ${
      (maxY - minY) * pixelSize + pixelSize
    }`;
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      shapeRendering="crispEdges"
      // style={{backgroundColor: bgColor}}
    >
      <g>
        {rects.map((r) => {
          const x = r.x * pixelSize;
          const y = r.y * pixelSize;
          const w = r.width * pixelSize;
          const h = pixelSize;
          const color = r.color;
          return (
            <rect
              key={x * 1000 + y}
              x={x}
              y={y}
              width={w}
              height={h}
              fill={color}
            />
          );
        })}
      </g>
    </svg>
  );
}
