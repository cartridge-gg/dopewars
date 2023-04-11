import { ReactNode } from "react";
import { Acid } from "./Acid";
import { Adderall } from "./Adderall";
import { Cocaine } from "./Cocaine";
import { Coke } from "./Coke";
import { Crack } from "./Crack";
import { Heroin } from "./Heroin";
import { Krokodil } from "./Krokodil";
import { Lsd } from "./Lsd";
import { Ludes } from "./Ludes";
import { Molly } from "./Molly";
import { Oxycontin } from "./Oxycontin";
import { Pcp } from "./Pcp";
import { Shroom } from "./Shroom";
import { Soma } from "./Soma";
import { Speed } from "./Speed";
import { Weed } from "./Weed";
import { Xanax } from "./Xanax";
import { Zoloft } from "./Zoloft";

export interface DrugProps {
  name: string;
  icon: ReactNode;
}

export const DrugList: DrugProps[] = [
  { name: "Acid", icon: <Acid /> },
  { name: "Adderall", icon: <Adderall /> },
  { name: "Cocaine", icon: <Cocaine /> },
  { name: "Coke", icon: <Coke /> },
  { name: "Crack", icon: <Crack /> },
  { name: "Heroin", icon: <Heroin /> },
  { name: "Krokodil", icon: <Krokodil /> },
  { name: "Lsd", icon: <Lsd /> },
  { name: "Ludes", icon: <Ludes /> },
  { name: "Molly", icon: <Molly /> },
  { name: "Oxycontin", icon: <Oxycontin /> },
  { name: "Pcp", icon: <Pcp /> },
  { name: "Shroom", icon: <Shroom /> },
  { name: "Soma", icon: <Soma /> },
  { name: "Speed", icon: <Speed /> },
  { name: "Weed", icon: <Weed /> },
  { name: "Xanax", icon: <Xanax /> },
  { name: "Zoloft", icon: <Zoloft /> },
];
