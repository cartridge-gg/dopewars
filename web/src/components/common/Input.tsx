import { cn } from "@/utils/cn";
import { InputHTMLAttributes, useCallback, useEffect, useRef, useState } from "react";
import { cardBorderStyle } from "@/utils/borderStyles";

// @ts-ignore
import useCaretPosition from "use-caret-position";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "primary";
}

export const Input = ({ className, variant = "primary", onKeyDown, onFocus: onFocusProp, onBlur: onBlurProp, ...props }: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { x, y, getPosition } = useCaretPosition(inputRef);

  const updateCaretPosition = useCallback(() => {
    setTimeout(() => {
      getPosition(inputRef);
    }, 10);
  }, [getPosition]);

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    updateCaretPosition();
    setIsFocused(true);
    onFocusProp?.(e);
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    updateCaretPosition();
    setIsFocused(false);
    onBlurProp?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    updateCaretPosition();
    onKeyDown?.(e);
  };

  useEffect(() => {
    const onScroll = () => {
      updateCaretPosition();
    };

    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll);
  }, [updateCaretPosition]);

  useEffect(() => {
    setTimeout(() => {
      updateCaretPosition();
    }, 100);
  }, [updateCaretPosition]);

  // Input field styles combining Tailwind classes with border image inline styles
  const inputStyle: React.CSSProperties = {
    ...cardBorderStyle,
    backgroundColor: "transparent",
    caretColor: "transparent",
  };

  return (
    <div className="relative w-full m-0">
      <input
        ref={inputRef}
        className={cn(
          "w-full border-0 rounded-xl overflow-hidden",
          "focus:bg-neon-700",
          "placeholder:text-neon-500",
          "text-neon-200 font-body",
          "outline-none",
          className
        )}
        style={inputStyle}
        onClick={updateCaretPosition}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
      />
      {isFocused && (
        <div
          className="fixed w-2.5 z-[99] -ml-px rounded-sm overflow-visible bg-neon-200 animate-blink"
          style={{
            height: "1.2em",
            left: `${x}px`,
            top: `${y}px`,
            marginTop: "9px",
            transition: "none",
          }}
        />
      )}
    </div>
  );
};
