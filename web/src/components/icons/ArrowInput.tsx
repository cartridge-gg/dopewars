import { Icon, IconProps } from ".";
import { Box } from "@chakra-ui/react";

type RotateType = {
  [key: string]: string;
};

const rotate: RotateType = {
  up: "rotate(0deg)",
  down: "rotate(180deg)",
  right: "rotate(90deg)",
  left: "rotate(270deg)",
};

export interface ArrowInputProps {
  direction?: string;
  disabled?: boolean;
}

export const ArrowInput = ({
  direction,
  disabled,
  ...props
}: ArrowInputProps & IconProps) => {
  return (
    <Icon
      transform={rotate[direction || "up"]}
      role="group"
      pointerEvents={disabled ? "none" : "auto"}
      {...props}
    >
      <>
        <Box
          as="path"
          d="M12.4681 0.516602V3.51535H6.47065V6.5141H3.47189V12.5116H0.473145V24.5216H3.47189V30.5191H6.47065V33.5178H12.4681V36.5166H24.4781V33.5178H30.4756V30.5191H33.4744V24.5216H36.4731V12.5116H33.4744V6.5141H30.4756V3.51535H24.4781V0.516602H12.4681Z"
          fill={disabled ? "neon.700" : "neon.600"}
          _groupHover={{
            fill: "neon.500",
          }}
        />
        <Box
          as="path"
          d="M9.47668 22.1602H12.058V19.5916H14.6266V17.0231H17.1951V14.4546H19.7508V17.0231H22.3193V19.5916H24.8878V22.1602H27.4692V19.5788H24.9007V17.0103H22.3321V14.4417H19.7636V11.8732H17.1823V14.4417H14.6137V17.0103H12.0452V19.5788H9.47668V22.1602Z"
          fill={disabled ? "neon.500" : "neon.200"}
        />
      </>
    </Icon>
  );
};
