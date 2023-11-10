import { useBreakpointValue } from "@chakra-ui/react";

export const IsMobile = () => useBreakpointValue([true, false]);

type Point = {
  x: number;
  y: number;
};
// from  https://pixelcorners.lukeb.co.uk/
export function generatePixelBorderPath(radius = 4, pixelSize = 4) {
  const points = generatePoints(radius, pixelSize);
  const flipped = flipCoords(points);

  return generatePath(flipped);
}

function generateInnerPath(
  radius: number,
  pixelSize: number,
  offset: number,
  reverse = false,
) {
  const points = generatePoints(radius, pixelSize);
  const inset =
    offset < radius
      ? insetCoords(points, pixelSize, offset)
      : generatePoints(2, pixelSize, offset);
  const flipped = flipCoords(inset);
  const corners = addCorners(flipped);

  return generatePath(corners, reverse);
}

function generatePath(coords: Point[], reverse = false) {
  const mirroredCoords = mirrorCoords(coords);

  return (reverse ? mirroredCoords : mirroredCoords.reverse())
    .map((point) => {
      return `${point.x} ${point.y}`;
    })
    .join(",\n    ");
}

function generatePoints(radius: number, pixelSize: number, offset = 0) {
  const coords = [];

  const lastCoords = {
    x: -1,
    y: -1,
  };

  for (let i = 270; i > 225; i--) {
    const x =
      Math.floor(radius * Math.sin((2 * Math.PI * i) / 360) + radius + 0.5) *
      pixelSize;
    const y =
      Math.floor(radius * Math.cos((2 * Math.PI * i) / 360) + radius + 0.5) *
      pixelSize;

    if (x !== lastCoords.x || y !== lastCoords.y) {
      lastCoords.x = x;
      lastCoords.y = y;

      coords.push({
        x: x + offset * pixelSize,
        y: y + offset * pixelSize,
      });
    }
  }

  const mergedCoords = mergeCoords(coords);
  const corners = addCorners(mergedCoords);

  return corners;
}

function flipCoords(coords: Point[]) {
  return [
    ...coords,
    ...coords.map(({ x, y }) => ({ x: y, y: x })).reverse(),
  ].filter(({ x, y }, i, arr) => {
    return !i || arr[i - 1].x !== x || arr[i - 1].y !== y;
  });
}

function insetCoords(coords: Point[], pixelSize: number, offset: number) {
  return coords
    .map(({ x, y }) => ({
      x: x + pixelSize * offset,
      y: y + pixelSize * Math.floor(offset / 2),
    }))
    .reduce((ret: Point[], item) => {
      if (ret.length > 0 && ret[ret.length - 1].x === ret[ret.length - 1].y) {
        return ret;
      }

      ret.push(item);

      return ret;
    }, []);
}

function mergeCoords(coords: Point[]) {
  return coords.reduce((result: Point[], point: Point, index: number) => {
    if (
      index !== coords.length - 1 &&
      point.x === 0 &&
      coords[index + 1].x === 0
    ) {
      return result;
    }

    if (index !== 0 && point.y === 0 && coords[index - 1].y === 0) {
      return result;
    }

    if (
      index !== 0 &&
      index !== coords.length - 1 &&
      point.x === coords[index - 1].x &&
      point.x === coords[index + 1].x
    ) {
      return result;
    }

    result.push(point);
    return result;
  }, []);
}

function addCorners(coords: Point[]) {
  return coords.reduce((result: Point[], point: Point, i: number) => {
    result.push(point);

    if (
      coords.length > 1 &&
      i < coords.length - 1 &&
      coords[i + 1].x !== point.x &&
      coords[i + 1].y !== point.y
    ) {
      result.push({
        x: coords[i + 1].x,
        y: point.y,
      });
    }

    return result;
  }, []);
}

function mirrorCoords(coords: Point[], offset = 0) {
  return [
    ...coords.map(({ x, y }) => ({
      x: offset ? `${x + offset}px` : `${x}px`,
      y: offset ? `${y + offset}px` : `${y}px`,
    })),
    ...coords.map(({ x, y }) => ({
      x: edgeCoord(y, offset),
      y: offset ? `${x + offset}px` : `${x}px`,
    })),
    ...coords.map(({ x, y }) => ({
      x: edgeCoord(x, offset),
      y: edgeCoord(y, offset),
    })),
    ...coords.map(({ x, y }) => ({
      x: offset ? `${y + offset}px` : `${y}px`,
      y: edgeCoord(x, offset),
    })),
  ];
}

function edgeCoord(n: number, offset: number) {
  if (offset) {
    return n === 0
      ? `calc(100% - ${offset}px)`
      : `calc(100% - ${offset + n}px)`;
  }

  return n === 0 ? "100%" : `calc(100% - ${n}px)`;
}

export function formatQuantity(quantity: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(quantity);
}

export function formatCash(cash: number): string {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cash);
}


export function formatCashHeader(cash: number): string {
  if (cash < 10_000) {
    return Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(cash);
  }
  if (cash < 1_000_000) {
    return `${Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 1,
    }).format(cash / 1_000)}k`;
  }
  else if (cash < 1_000_000_000) {
    return `${Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 1,
    }).format(cash / 1_000_000)}M`;
  }
  return "ElonMusk"

}
