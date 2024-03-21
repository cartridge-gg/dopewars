import { IconProps } from "@chakra-ui/react";
import { Dragon, DragonIcon } from "./Dragon";
import { Monkey, MonkeyIcon } from "./Monkey";
import { Rabbit, RabbitIcon } from "./Rabbit";

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

const hustlersIcons = {
  [Hustlers.Dragon]: DragonIcon,
  [Hustlers.Monkey]: MonkeyIcon,
  [Hustlers.Rabbit]: RabbitIcon,
};

export const HustlerIcon = ({ hustler, ...rest }: HustlerProps & IconProps) => {
  const SelectedHustlerIcon = hustlersIcons[hustler];
  return <SelectedHustlerIcon {...rest} />;
};

