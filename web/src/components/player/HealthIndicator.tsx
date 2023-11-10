import { StyleProps, HStack, Text, keyframes } from "@chakra-ui/react";
import { DynamicHeart } from "../icons";

export const blinkAnim = keyframes`  
  0% {opacity: 1;}   
  80% {opacity:1;}   
  81% {opacity: 0;}   
  100% {opacity: 0;}   
`;

const HealthIndicator = ({ health, ...props }: { health: number } & StyleProps) => {
  health = 40;
  const healthColor = health > 59 ? "neon.400" : health > 29 ? "yellow.400" : "red";
  return (
    <HStack
      color={healthColor}
      animation={health <= 20 ? `${blinkAnim} infinite 1.4s linear` : "none"}
      {...props}
    >
      <DynamicHeart health={health} /> <Text>{health}</Text>
    </HStack>
  );
};

export default HealthIndicator;

