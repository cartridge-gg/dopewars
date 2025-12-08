import { cn } from "@/utils/cn";
import { useState } from "react";
import { ArrowInput } from "../icons";

interface InputNumberProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (_: number) => void;
  className?: string;
}

export const InputNumber = ({ min = 0, max, step = 1, value, onChange, className }: InputNumberProps) => {
  const [isFlashed, setIsFlashed] = useState(false);

  const onClick = (newValue: number) => {
    setIsFlashed(true);
    onChange(newValue);
    setTimeout(() => {
      setIsFlashed(false);
    }, 200);
  };

  return (
    <div className={cn("flex items-center w-full", className)}>
      <span
        className={cn(
          isFlashed ? "text-neon-900 bg-neon-200" : "text-neon-200 bg-transparent"
        )}
      >
        {value}
      </span>
      <div className="flex-1" />
      <ArrowInput
        size="md"
        cursor="pointer"
        disabled={max && value >= max ? true : false}
        onClick={() => onClick(value + step)}
      />
      <ArrowInput
        size="md"
        direction="down"
        cursor="pointer"
        disabled={value <= min ? true : false}
        onClick={() => onClick(value - step)}
      />
    </div>
  );
};
