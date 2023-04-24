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

export const Arrow = ({
  direction,
  ...props
}: { direction?: string } & IconProps) => {
  return (
    <Icon transform={rotate[direction || "left"]} {...props}>
      <path d="M4.81563 12.812L4 11.9999L4.81204 11.1879L9.98608 6.01387L10.8017 5.19824L12.4258 6.82591L11.6137 7.63795L8.40153 10.8502H18.8502H20V13.1497H18.8502H8.40512L11.6173 16.362L12.4258 17.174L10.8017 18.8017L9.98967 17.9896L4.81563 12.8156V12.812Z" />
    </Icon>
  );
};
