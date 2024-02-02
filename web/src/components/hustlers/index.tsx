import { IconProps } from "@chakra-ui/react";
import { Dragon } from "./Dragon";
import { Monkey } from "./Monkey";
import { Rabbit } from "./Rabbit";

export enum Hustlers {
  Dragon = 0,
  Monkey = 1,
  Rabbit = 2,
}

interface HustlerProps {
  hustler: Hustlers;
}

const hustlers = {
  [Hustlers.Dragon]: Dragon,
  [Hustlers.Monkey]: Monkey,
  [Hustlers.Rabbit]: Rabbit,
};

export const hustlersCount = 3;

export const Hustler = ({ hustler, ...rest }: HustlerProps & IconProps) => {
  const SelectedHustler = hustlers[hustler];
  return <SelectedHustler {...rest} />;
};
