import { Sounds, playSound } from "@/hooks/sound";
import { cn } from "@/utils/cn";
import { generatePixelBorderPath } from "@/utils/ui";
import PressableBorderImage from "@/components/icons/PressableBorderImage";
import { ButtonHTMLAttributes, forwardRef, ReactNode, useState } from "react";
import { SmallLoader } from "../layout/Loader";

// Color values from theme
const colors = {
  neon200: "#11ED83",
  neon300: "#16C973",
  neon700: "#202F20",
  neon600: "#1F422A",
  neon900: "#172217",
  yellow400: "#FBCB4A",
};

type ButtonVariant = "primary" | "selectable" | "pixelated" | "default";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  hoverSound?: Sounds;
  clickSound?: Sounds;
  isLoading?: boolean;
  isDisabled?: boolean;
  isActive?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      hoverSound,
      clickSound = Sounds.HoverClick,
      isLoading,
      isDisabled,
      isActive: isActiveProp,
      className,
      onClick,
      style,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    // Use prop value if provided, otherwise use internal state
    const isActive = isActiveProp !== undefined ? isActiveProp : isPressed;

    // Get border image based on variant and state
    const getBorderImageSource = () => {
      if (variant === "pixelated" || variant === "default") return "none";

      if (variant === "selectable") {
        if (isActive) {
          return `url("data:image/svg+xml,${PressableBorderImage({
            color: colors.yellow400,
            isPressed: true,
          })}")`;
        }
        if (isHovered) {
          return `url("data:image/svg+xml,${PressableBorderImage({
            color: colors.neon300,
            isPressed: false,
          })}")`;
        }
        return `url("data:image/svg+xml,${PressableBorderImage({
          color: colors.neon200,
          isPressed: false,
        })}")`;
      }

      // primary variant
      if (isActive) {
        return `url("data:image/svg+xml,${PressableBorderImage({
          color: colors.neon300,
          isPressed: true,
        })}")`;
      }
      if (isHovered) {
        return `url("data:image/svg+xml,${PressableBorderImage({
          color: colors.neon300,
          isPressed: false,
        })}")`;
      }
      return `url("data:image/svg+xml,${PressableBorderImage({
        color: colors.neon200,
        isPressed: false,
      })}")`;
    };

    // Get text color based on variant and state
    const getTextColorClass = () => {
      if (variant === "selectable" && isActive) {
        return "text-yellow-400";
      }
      if (isHovered) {
        return "text-neon-300";
      }
      return "text-neon-200";
    };

    // Common styles for all buttons
    const baseClasses = cn(
      "relative font-normal uppercase px-10 gap-2.5 bg-neon-900 transition-none",
      "disabled:pointer-events-none disabled:opacity-50",
      getTextColorClass()
    );

    // Variant-specific classes
    const variantClasses = cn(
      variant === "pixelated" && "border-0 bg-neon-700 leading-none hover:bg-neon-600",
      (variant === "primary" || variant === "selectable") && "border-solid border-2"
    );

    // Dynamic styles that can't be expressed in Tailwind
    const dynamicStyles: React.CSSProperties = {
      ...style,
    };

    if (variant === "primary" || variant === "selectable") {
      dynamicStyles.borderImageSlice = 4;
      dynamicStyles.borderImageWidth = "4px";
      dynamicStyles.borderImageSource = getBorderImageSource();
    }

    if (variant === "pixelated") {
      dynamicStyles.clipPath = `polygon(${generatePixelBorderPath()})`;
    }

    // Active state offset (2D press effect)
    if (isActive && variant !== "pixelated") {
      dynamicStyles.top = "2px";
      dynamicStyles.left = "2px";
    }

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses, className)}
        style={dynamicStyles}
        disabled={isDisabled || isLoading}
        onMouseEnter={() => {
          setIsHovered(true);
          hoverSound && playSound(hoverSound, 0.3);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onClick={(e) => {
          clickSound && playSound(clickSound, 0.3);
          onClick?.(e);
        }}
        {...props}
      >
        <span className="w-full text-center">
          {isLoading ? <SmallLoader /> : children}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";
