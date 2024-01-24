import { IconProps } from "@chakra-ui/react";
import { Rabbit } from "./Rabbit";
import { Dragon } from "./Dragon";
import { Monkey } from "./Monkey";

export type Hustler = "dragon" | "monkey" | "rabbit";

interface HustlerProps {
  hustler: Hustler;
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
