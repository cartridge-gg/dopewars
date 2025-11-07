import colors from "@/theme/colors";
import { HStack, StyleProps, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { DynamicHeart } from "../icons";

export const blinkAnim = keyframes`  
  0% {opacity: 1;}   
  80% {opacity:1;}   
  81% {opacity: 0;}   
  100% {opacity: 0;}   
`;

export const HealthIndicator = ({
  health,
  maxHealth,
  ...props
}: { health: number; maxHealth: number } & StyleProps) => {
  const healthColor = getHealthColor(health, maxHealth);
  return (
    <HStack color={healthColor} animation={getHealthAnimation(health, maxHealth)} {...props}>
      <DynamicHeart health={health} maxHealth={maxHealth} color={healthColor} /> <Text>{health}</Text>
    </HStack>
  );
};

const getHealthAnimation = (health: number, maxHealth: number) => {
  const healthPercentage = (health / maxHealth) * 100;
  return healthPercentage <= 20 ? `${blinkAnim} infinite 1.4s linear` : "none";
};

function getHealthColor(health: number, maxHealth: number) {
  const healthPercentage = (health / maxHealth) * 100;
  let healthColor;

  if (healthPercentage > 59) {
    healthColor = colors.neon["400"].toString();
  } else if (healthPercentage > 29) {
    healthColor = colors.yellow["400"].toString();
  } else {
    healthColor = colors.red.toString();
  }

  return healthColor;
}

export default HealthIndicator;
