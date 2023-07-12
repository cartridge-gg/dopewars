import {
  Divider,
  HStack,
  StyleProps,
  Text,
  VStack,
  Box,
} from "@chakra-ui/react";
import { Bag, IconProps } from "./icons";
import { Acid, Cocaine, Heroin, Ludes, Speed, Weed } from "./icons/drugs";
import { DrugProps } from "@/hooks/ui";
import { Component } from "react";
import React from "react";

// TODO: will implement
const Inventory = () => {
  return <></>;
};
export default Inventory;
// const getItem = (inventory: InventoryType, drug: Drugs, icon: React.FC) => {
//   const quantity = inventory.drugs[drug].quantity;

//   return (
//     <HStack title={drug}>
//       {icon({
//         boxSize: "24px",
//         color: quantity > 0 ? "neon.100" : "neon.500",
//       })}
//       {quantity > 0 && <Text>{quantity}</Text>}
//     </HStack>
//   );
// };

// export const Inventory = ({ ...props }: StyleProps) => {
//   const inventory = useGameStore((s) => s.inventory);

//   return (
//     inventory && (
//       <HStack {...props}>
//         <Bag boxSize="36px" />
//         <HStack
//           bgColor="neon.700"
//           h="full"
//           px="30px"
//           py="6px"
//           backgroundImage="linear-gradient(to left, #172217 0%, transparent 10%), linear-gradient(to right, #172217 0%, transparent 10%)"
//         >
//           {getItem(inventory, Drugs.Ludes, Ludes)}
//           <Divider orientation="vertical" borderColor="neon.600" h="50%" />
//           {getItem(inventory, Drugs.Speed, Speed)}
//           <Divider orientation="vertical" borderColor="neon.600" h="50%" />
//           {getItem(inventory, Drugs.Weed, Weed)}
//           <Divider orientation="vertical" borderColor="neon.600" h="50%" />
//           {getItem(inventory, Drugs.Acid, Acid)}
//           <Divider orientation="vertical" borderColor="neon.600" h="50%" />
//           {getItem(inventory, Drugs.Heroin, Heroin)}
//           <Divider orientation="vertical" borderColor="neon.600" h="50%" />
//           {getItem(inventory, Drugs.Cocaine, Cocaine)}
//         </HStack>
//       </HStack>
//     )
//   );
// };
