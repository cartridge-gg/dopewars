import { Box } from "@chakra-ui/react";
import React, { ReactNode, useState } from "react";

// https://codepen.io/markmiro/pen/wbqMPa

const initialData = { x: 0, y: 0, z: 0, a: "0deg", bgx: "50%", bgy: "-20%" };

export default function CardAnim({ children, ...props }: { children: ReactNode }) {
  const [data, setData] = useState(initialData);
  const [isHovered, setIsHovered] = useState(false);

  const onMouseMove = (e: React.MouseEvent) => {
    //@ts-ignore
    const bounds = e.target?.getBoundingClientRect();

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const leftX = mouseX - bounds.x;
    const topY = mouseY - bounds.y;
    const center = {
      x: leftX - bounds.width / 2,
      y: topY - bounds.height / 2,
    };
    const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

    setData({
      x: center.y / 100,
      y: -center.x / 100,
      z: 0,
      a: `${Math.log(distance) * 2}deg`,
      bgx: `${center.x * 2 + bounds.width / 2}px`,
      bgy: `${center.y * 2 + bounds.height / 2}px`,
    });
  };
  const onMouseEnter = () => {
    setIsHovered(true);
  };
  const onMouseLeave = () => {
    setIsHovered(false);
    setData(initialData);
  };

  return (
    <Box
      position="relative"
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        transition: "all 0.1s",
        transform: `rotate3d(${data.x},${data.y},${data.z},${data.a}) ${isHovered ? "scale(1.03)" : ""}`,
        boxShadow: isHovered ? "0 5px 10px 5px #33333322" : "0 1px 5px #33333311",
      }}
      {...props}
    >
      {children}
      <Box
        position="absolute"
        w="full"
        h="full"
        left={0}
        top={0}
        pointerEvents="none"
        style={{
          transition: "0.5s",
          backgroundImage: isHovered ? `radial-gradient(circle at ${data.bgx} ${data.bgy}, #ffffff22, #0000000f)` : "",
        }}
      ></Box>
    </Box>
  );
}
