const PixelatedBorderImage = ({
  color,
}: {
  color: string;
}) => {
  return `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='${encodeURIComponent(
    color,
  )}' ><path d='M0 0H16V10.0075H14.0025V12.005H12.005V14.0025H10.0075V16H5.99252V14.0025H3.995V12.005H1.9975V10.0075H0V0Z' /></svg>`;
};

export default PixelatedBorderImage;

