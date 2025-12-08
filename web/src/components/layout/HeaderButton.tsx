import { cn } from "@/utils/cn";
import { headerStyle, headerButtonHoverStyle } from "@/utils/borderStyles";
import { useIsMobile } from "@/hooks/useResponsive";
import { ButtonHTMLAttributes, forwardRef, ReactNode, useState } from "react";

interface HeaderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: "pixelated";
  h?: string | string[];
  mr?: number;
  py?: number;
  display?: string;
  flexDirection?: "row" | "column";
  alignItems?: string;
  justifyContent?: string;
  fontSize?: string;
}

export const HeaderButton = forwardRef<HTMLButtonElement, HeaderButtonProps>(
  ({ children, className, style, ...props }, ref) => {
    const isMobile = useIsMobile();
    const [isHovered, setIsHovered] = useState(false);

    const baseStyle = headerStyle(isMobile);
    const hoverStyle = isHovered ? headerButtonHoverStyle(isMobile) : {};

    return (
      <button
        ref={ref}
        className={cn(
          isMobile ? "p-1.5 h-10" : "px-3 py-1.5 h-12",
          "cursor-pointer",
          className
        )}
        style={{
          ...baseStyle,
          ...hoverStyle,
          ...style,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

HeaderButton.displayName = "HeaderButton";
