// This icon is used by button and card layerstyle only
const PressableBorderImage = ({
  color,
  isPressed,
}: {
  color: string;
  isPressed: boolean;
}) => {
  const path = isPressed
    ? "<path d='M2,2h2v2H2V2ZM4,0h2V2h-2V0Zm6,4h2v2h-2v-2ZM0,4H2v2H0v-2ZM6,0h2V2h-2V0Zm2,2h2v2h-2V2Zm0,6h2v2h-2v-2Zm-2,2h2v2h-2v-2ZM0,6H2v2H0v-2Zm10,0h2v2h-2v-2Zm-6,4h2v2h-2v-2Zm-2-2h2v2H2v-2Z'/>"
    : "<path d='M2,2h2v2H2V2ZM4,0h2V2h-2V0Zm6,4h2v2h-2v-2ZM0,4H2v2H0v-2ZM6,0h2V2h-2V0Zm2,2h2v2h-2V2Zm0,6h2v2h-2v-2Zm-2,2h2v2h-2v-2ZM0,6H2v2H0v-2Zm10,0h2v2h-2v-2Zm-6,4h2v2h-2v-2Zm-2-2h2v2H2v-2Zm6-2h2v2h-2v-2Zm-2,2h2v2h-2v-2Zm2-4h2v2h-2v-2Zm-4,4h2v2h-2v-2Zm2-2h2v2h-2v-2Z'/>";

  return `<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='${encodeURIComponent(
    color,
  )}' >${path}</svg>`;
};

export default PressableBorderImage;
