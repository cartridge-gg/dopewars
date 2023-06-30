// This icon is used by ...

// no space allowed in svg content !!!
const BorderImagePixelated = ({ color }: { color: string }) => {
  return `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='17' fill='${encodeURIComponent(
    color,
  )}'><path d='M8 8.5V16.5H10.0075V14.5025H12.005V12.505H14.0025V10.5075H16V8.5H8Z' /><path d='M8 8.5L16 8.5V6.49251L14.0025 6.49251V4.49501L12.005 4.49501V2.4975L10.0075 2.4975V0.5L8 0.5L8 8.5Z' /><path d='M8 8.5L8 0.5L5.99251 0.5V2.4975L3.99501 2.4975L3.99501 4.49501H1.9975L1.9975 6.49251H1.755e-07L0 8.5L8 8.5Z' /><path d='M8 8.5L1.755e-07 8.5L0 10.5075L1.9975 10.5075L1.9975 12.505H3.99501V14.5025L5.99251 14.5025V16.5H8L8 8.5Z'/></svg>`;
};

export default BorderImagePixelated;
