export type Rect = {
  x: number;
  y: number;
  width: number;
  color: string;
};

export const decodeAsset = (encoded: string[], palette: string[]) => {
  const rects: Rect[] = [];

  const fields = encoded.map((i) => BigInt(i));

  for (let field of fields) {
    const fieldObj = { value: field };
    while (fieldObj.value > 0) {
      let extracted = consumeBytes(fieldObj, 5n);
      const extractedObj = { value: extracted };

      let x = consumeBytes(extractedObj, 1n);
      let y = consumeBytes(extractedObj, 1n);
      let width = consumeBytes(extractedObj, 1n);
      let colorIndex = consumeBytes(extractedObj, 2n);
      rects.push({
        x: Number(x),
        y: Number(y),
        width: Number(width),
        color: `#${palette[Number(colorIndex)]}`,
      });
    }
  }

  return {
    rects,
  };
};

export const consumeBytes = (value: { value: bigint }, len: bigint) => {
  if (value.value > 0) {
    let two_pow = 2n ** (len * 8n);
    let extracted = value.value % two_pow;
    value.value = value.value / two_pow;
    return extracted;
  } else {
    return 0n;
  }
};
