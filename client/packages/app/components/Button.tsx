import { Pressable } from "react-native";
import { styled } from "nativewind";
import { Text } from "app/components";
import React from "react";

const StyledButton = styled(
  Pressable,
  `flex-row h-10 gap-0.5 justify-center items-center rounded-md px-2 py-1 border-2`,
);

const variantStyles = {
  primary: {
    button: "bg-gray-100",
    text: "text-black",
    color: "black",
  },
  secondary: {
    button: "bg-blue-500",
    text: "text-white",
    color: "white",
  },
};

export interface ButtonProps {
  title: string;
  icon: React.ReactNode;
  variant: "primary" | "secondary";
  className: string;
  onPress: () => void;
}

export const Button = ({
  title,
  icon,
  variant = "primary",
  className,
  onPress,
}: Partial<ButtonProps>) => {
  const styledIcon =
    icon &&
    React.cloneElement(icon as React.ReactElement, {
      style: { color: variantStyles[variant].color },
    });

  return (
    <StyledButton
      onPress={onPress}
      className={`${variantStyles[variant].button} ${className}`}
    >
      {styledIcon}
      <Text
        style={{
          fontFamily: "ChicagoFLF",
        }}
        className={variantStyles[variant].text}
      >
        {title}
      </Text>
    </StyledButton>
  );
};
