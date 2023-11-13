import { background } from "@chakra-ui/react";
import { Icon, IconProps } from ".";

export const DynamicHeart = (props: IconProps & { health: number; maxHealth: number; color: string }) => {
  // Assuming the SVG viewBox is 24 units wide, scale the health to fit this range.
  const healthWidth = ((props.health * 4) / props.maxHealth) * 24;
  const gradientId = `health-gradient-${props.health}`;

  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset={`${healthWidth}%`} stopColor={props.color} />
            <stop offset={`${healthWidth}%`} stopColor="transparent" />
          </linearGradient>
        </defs>
        <mask id="heart-mask">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.66556 5.83337V7.16604H5.33278V8.49871H4V12.5034H5.33278V13.836H6.66556V15.1687H7.99833V16.5014H9.33111V17.834H10.6639V19.1667H13.3361V17.834H14.6689V16.5014H16.0017V15.1687H17.3344V13.836H18.6672V12.5034H20V8.49871H18.6672V7.16604H17.3344V5.83337H13.3294V7.16604H10.6706V5.83337H6.66556Z"
            fill="white"
          />
        </mask>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.66556 5.83337V7.16604H5.33278V8.49871H4V12.5034H5.33278V13.836H6.66556V15.1687H7.99833V16.5014H9.33111V17.834H10.6639V19.1667H13.3361V17.834H14.6689V16.5014H16.0017V15.1687H17.3344V13.836H18.6672V12.5034H20V8.49871H18.6672V7.16604H17.3344V5.83337H13.3294V7.16604H10.6706V5.83337H6.66556ZM5.33944 12.4967H6.67222V13.8294H8.005V15.162H9.33778V16.4947H10.6706V17.8274H13.3294V16.4947H14.6622V15.162H15.995V13.8294H17.3278V12.4967H18.6606V8.50537H17.3278V7.1727H13.3361V8.50537H10.6639V7.1727H6.67222V8.50537H5.33944V12.4967Z"
          fill={props.color}
        />
        <path
          d="M6.66556 5.83337V7.16604H5.33278V8.49871H4V12.5034H5.33278V13.836H6.66556V15.1687H7.99833V16.5014H9.33111V17.834H10.6639V19.1667H13.3361V17.834H14.6689V16.5014H16.0017V15.1687H17.3344V13.836H18.6672V12.5034H20V8.49871H18.6672V7.16604H17.3344V5.83337H13.3294V7.16604H10.6706V5.83337H6.66556ZM5.33944 12.4967H6.67222V13.8294H8.005V15.162H9.33778V16.4947H10.6706V17.8274H13.3294V16.4947H14.6622V15.162H15.995V13.8294H17.3278V12.4967H18.6606V8.50537H17.3278V7.1727H13.3361V8.50537H10.6639V7.1727H6.67222V8.50537H5.33944V12.4967Z"
          fill={`url(#${gradientId})`}
          mask="url(#heart-mask)"
        />
      </>
    </Icon>
  );
};
