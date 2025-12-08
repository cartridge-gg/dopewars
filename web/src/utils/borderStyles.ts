import { BorderImage } from "@/components/icons";
import BorderImagePixelated from "@/components/icons/BorderImagePixelated";
import PixelatedBorderImage from "@/components/icons/PixelatedBorderImage";
import PressableBorderImage from "@/components/icons/PressableBorderImage";
import colors from "@/theme/colors";
import { generatePixelBorderPath } from "./ui";
import { CSSProperties } from "react";

// Color constants for easy reference
export const COLORS = {
  neon200: "#11ED83",
  neon300: "#16C973",
  neon400: "#11ED83",
  neon500: "#157342",
  neon600: "#1F422A",
  neon700: "#202F20",
  neon800: "#1C291C",
  neon900: "#172217",
  yellow400: "#FBCB4A",
  red: "#FB744A",
};

/**
 * Card border style - used for cards with SVG border image
 * This matches the Chakra cardStyle from theme/styles.ts
 */
export const cardBorderStyle: CSSProperties = {
  position: "relative",
  color: COLORS.neon200,
  backgroundColor: "transparent",
  borderStyle: "solid",
  borderImageSlice: 6,
  borderImageWidth: "6px",
  borderImageSource: `url("data:image/svg+xml,${BorderImage({
    color: colors.neon["600"].toString(),
  })}")`,
};

/**
 * Button border style - used for primary/selectable buttons
 */
export const buttonBorderStyle = (
  color: string = COLORS.neon200,
  isPressed: boolean = false
): CSSProperties => ({
  borderStyle: "solid",
  borderWidth: "2px",
  borderImageSlice: 4,
  borderImageWidth: "4px",
  borderImageSource: `url("data:image/svg+xml,${PressableBorderImage({
    color,
    isPressed,
  })}")`,
});

/**
 * Pixelated card style with clipPath - no border image
 */
export const pixelatedCardStyle = (
  backgroundColor: string = COLORS.neon700,
  radius: number = 4,
  pixelSize: number = 4
): CSSProperties => ({
  width: "100%",
  backgroundColor,
  borderWidth: 0,
  borderRadius: 0,
  borderImageSource: "none",
  clipPath: `polygon(${generatePixelBorderPath(radius, pixelSize)})`,
});

/**
 * Pixelated card style with outset border
 */
export const pixelatedCardOutsetStyle = (
  color: string = COLORS.neon700,
  borderImageWidth: number = 8
): CSSProperties => ({
  width: "100%",
  backgroundColor: color,
  borderWidth: 0,
  borderRadius: 0,
  borderImageWidth: `${borderImageWidth}px`,
  borderImageOutset: `${borderImageWidth}px`,
  borderImageSlice: 7,
  borderImageSource: `url("data:image/svg+xml,${BorderImagePixelated({
    color,
  })}")`,
});

/**
 * Header style with pixelated border
 */
export const headerStyle = (isMobile: boolean): CSSProperties => ({
  border: 0,
  backgroundColor: COLORS.neon700,
  borderStyle: "solid",
  borderImageSlice: 8,
  borderImageWidth: "12px",
  borderRadius: isMobile ? "16px" : "0",
  borderImageSource: isMobile
    ? `url("data:image/svg+xml,${PixelatedBorderImage({
        color: colors.neon["700"].toString(),
      })}")`
    : "none",
  clipPath: isMobile ? "none" : `polygon(${generatePixelBorderPath()})`,
});

/**
 * Header button style with hover state
 */
export const headerButtonStyle = (isMobile: boolean): CSSProperties => ({
  ...headerStyle(isMobile),
});

/**
 * Header button hover style
 */
export const headerButtonHoverStyle = (isMobile: boolean): CSSProperties => ({
  backgroundColor: COLORS.neon600,
  borderImageSource: isMobile
    ? `url("data:image/svg+xml,${PixelatedBorderImage({
        color: colors.neon["600"].toString(),
      })}")`
    : "none",
});
