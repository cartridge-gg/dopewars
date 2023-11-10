import { StyleProps, HStack, Text, keyframes } from "@chakra-ui/react";
import { DynamicHeart } from "../icons";
import colors from "@/theme/colors";

export const blinkAnim = keyframes`  
  0% {opacity: 1;}   
  80% {opacity:1;}   
  81% {opacity: 0;}   
  100% {opacity: 0;}   
`;

const HealthIndicator = ({ health, ...props }: { health: number } & StyleProps) => {
  const healthColor =
    health > 59 ? colors.neon["400"].toString() : health > 29 ? colors.yellow["400"].toString() : colors.red.toString();
  return (
    <HStack color={healthColor} animation={health <= 20 ? `${blinkAnim} infinite 1.4s linear` : "none"} {...props}>
      <DynamicHeart health={health} color={healthColor} /> <Text>{health}</Text>
    </HStack>
  );
};

export default HealthIndicator;
