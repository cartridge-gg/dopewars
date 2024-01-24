import { IconProps } from "@chakra-ui/react";
import { Rabbit } from "./Rabbit";
import { Dragon } from "./Dragon";
import { Monkey } from "./Monkey";

interface HustlerProps {
  hustler: "dragon" | "monkey" | "rabbit";
}

export const Hustler = ({ hustler, ...rest }: HustlerProps & IconProps) => {
  const hustlers = {
    dragon: Dragon,
    monkey: Monkey,
    rabbit: Rabbit,
  };
  const Hustler = hustlers[hustler];

  return <Hustler {...rest} />;
};
