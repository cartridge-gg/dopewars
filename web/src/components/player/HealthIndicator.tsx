import { HStack, Text, keyframes } from "@chakra-ui/react";
import { Heart } from "../icons";

export const blinkAnim = keyframes`  
  0% {opacity: 1;}   
  80% {opacity:1;}   
  81% {opacity: 0;}   
  100% {opacity: 0;}   
`;

const HealthIndicator = ({ health, ...props }: { health: number }) => {
  return (
    <HStack
      color={health > 59 ? "neon.400" : health > 29 ? "yellow.400" : "red"}
      animation={health <= 20 && `${blinkAnim} infinite 1.4s linear`}
      {...props}
    >
      <Heart /> <Text>{health}</Text>
    </HStack>
  );
};

export default HealthIndicator;
