import { Icon, IconProps } from ".";

type RotateType = {
  [key: string]: string;
};

const rotate: RotateType = {
  up: "rotate(90deg)",
  down: "rotate(270deg)",
  right: "rotate(180deg)",
  left: "rotate(0deg)",
};

type StyleType = "line" | "outline" | "pixel";

export interface ArrowProps {
  direction?: string;
  style?: StyleType;
}

export const Arrow = ({
  direction,
  style,
  ...props
}: ArrowProps & IconProps) => {
  let path;
  switch (style) {
    case "pixel":
      path = (
        <path d="M20.7265 23.9998L20.7265 12L18.9088 12V14.0002L17.0911 14.0002L17.0911 16.0003H15.2734L15.2734 20.0006H17.0911L17.0911 21.9998H18.9088L18.9088 24L20.7265 23.9998Z" />
      );
      break;
    case "outline":
      path = (
        <>
          <path d="M16.8891 10.2226H14.6673V12.4444H16.8891V10.2226Z" />
          <path d="M25.7774 12.4449V23.5555H19.1107V25.7773H27.9995V10.2218L19.1107 10.2218V12.4437L25.7774 12.4449Z" />
          <path d="M16.8891 10.2226L19.1117 10.223V8L16.8887 8L16.8891 10.2226Z" />
          <path d="M8.00049 16.8882L8.00049 19.1112H10.2235V16.8882H8.00049Z" />
          <path d="M14.6673 12.4444L12.4452 12.4446V14.6665H14.6671L14.6673 12.4444Z" />
          <path d="M16.8887 28H19.1117V25.777H16.8887V28Z" />
          <path d="M14.6673 23.5548V25.7767L16.8887 25.777L16.8891 23.5548H14.6673Z" />
          <path d="M12.4452 21.3334V23.5553L14.6673 23.5548L14.6671 21.3334H12.4452Z" />
          <path d="M12.4452 14.6665L10.2238 14.6666L10.2235 16.8882L12.4457 16.8885L12.4452 14.6665Z" />
          <path d="M10.2235 19.1112L10.2232 21.3332L12.4452 21.3334L12.445 19.1114L10.2235 19.1112Z" />
        </>
      );
      break;
    case "line":
    default:
      path = (
        <path d="M9.91758 18.9131L9 17.9996L9.91354 17.086L15.7343 11.2652L16.6519 10.3477L18.479 12.1788L17.5655 13.0923L13.9517 16.7061H25.7065H27V19.2931H25.7065H13.9558L17.5695 22.9068L18.479 23.8204L16.6519 25.6515L15.7384 24.738L9.91758 18.9172V18.9131Z" />
      );
      break;
  }
  return (
    <Icon transform={rotate[direction || "left"]} {...props}>
      {path}
    </Icon>
  );
};
