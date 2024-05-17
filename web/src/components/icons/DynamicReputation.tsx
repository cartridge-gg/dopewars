import { background } from "@chakra-ui/react";
import { Icon, IconProps } from ".";

export const DynamicReputation = (props: IconProps & { value: number; max: number; color: string }) => {
  // Assuming the SVG viewBox is 20 units wide, scale the health to fit this range.
  const { value, max, color, ...rest } = props;
  const width = (((value * 22) / max) * 100) / 24;
  const gradientId = `rep-gradient-${value}`;

  return (
    <Icon viewBox="0 0 24 24" {...rest}>
      <>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset={`${width}%`} stopColor={color} />
            <stop offset={`${width}%`} stopColor="transparent" />
          </linearGradient>
        </defs>
        <mask id="rep-mask">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11 3V4H10V6H9V8H8V9H3V10H2V11H3V12H4V13H5V14H6V16H5V19H4V22H7V21H9V20H11V19H13V20H15V21H17V22H20V19H19V16H18V14H19V13H20V12H21V11H22V10H21V9H16V8H15V6H14V4H13V3H11Z"
            fill="white"
          />
        </mask>

        <path
          d="M11 3V4H10V6H9V8H8V9H3V10H2V11H3V12H4V13H5V14H6V16H5V19H4V22H7V21H9V20H11V19H13V20H15V21H17V22H20V19H19V16H18V14H19V13H20V12H21V11H22V10H21V9H16V8H15V6H14V4H13V3H11Z"
          fill="none"
          strokeWidth={1}
          stroke={color}
        />
        <path
          d="M11 3V4H10V6H9V8H8V9H3V10H2V11H3V12H4V13H5V14H6V16H5V19H4V22H7V21H9V20H11V19H13V20H15V21H17V22H20V19H19V16H18V14H19V13H20V12H21V11H22V10H21V9H16V8H15V6H14V4H13V3H11Z"
          fill={`url(#${gradientId})`}
          mask="url(#rep-mask)"
        />
      </>
    </Icon>
  );
};
