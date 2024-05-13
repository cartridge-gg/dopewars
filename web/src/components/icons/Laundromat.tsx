import { keyframes } from "@emotion/react";
import { Icon, IconProps } from ".";
import { Box } from "@chakra-ui/react";

const rotateAnim = keyframes`  
  0% {transform: rotate(0);}
  100% {transform: rotate(360deg);}
`;

export const LaundromatIcon = ({ isWashing, ...props }: IconProps & { isWashing: boolean }) => {
  return (
    <Box position="relative">
      <Icon viewBox="0 0 64 64" width="64px" height="64px" {...props}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.3335 10.6667V53.3334H51.7335V10.6667H13.3335ZM43.2002 40.5334H38.9335V44.8001H26.1335V40.5334H21.8668V27.7334H26.1335V23.4667H38.9335V27.7334H43.2002V40.5334ZM38.9335 19.2001V14.9334H47.4668V19.2001H38.9335ZM30.4002 19.2001H26.1335V14.9334H30.4002V19.2001ZM17.6002 19.2001H21.8668V14.9334H17.6002V19.2001Z"
          fill="currentColor"
        />
      </Icon>
      {isWashing && (
        <Icon
          position="absolute"
          top="22"
          left="22"
          viewBox="0 0 24 24"
          width="24px"
          height="24px"
          transformOrigin="center"
          animation={`${rotateAnim} infinite 0.8s linear`}
        >
          <>
            <path d="M9.43688 6.76258H8.91668V7.28278H8.39648V8.84857H8.91668V9.88897H9.44208V9.36877H9.96228V8.84857H10.4825V7.80297H9.96228V6.24238H9.43688V6.76258Z" />
            <path d="M5.27529 8.84857V8.32317H6.84109V8.84337H7.88148V9.88897H7.36129V11.9646H7.88148V12.4848H8.40168V13.005H8.92188V13.5252H9.44208V14.0454H10.4825V14.5656H13.0783V14.0454H13.5985V13.5252H14.1187V13.005H14.6389V11.4444H15.1591V10.9294H14.6389V10.404H17.2451V10.9294H16.7249V11.4496H16.2047V12.49H15.6845V13.5304H15.1643V14.0506H14.6441V14.5708H14.1239V15.091H13.6037V15.6112H9.43688V15.091H8.39648V14.5708H7.87628V14.0506H7.35608V13.5304H6.83589V12.49H6.31569V9.88897H5.79549V8.84857H5.27529Z" />
            <path d="M12.5581 7.28278H13.0783V6.76258H13.6037V8.32317H14.1239V8.84857H13.6037V9.88897H13.0835V10.4092H12.5581V9.88897H12.0379V7.80297H12.5581V7.28278Z" />
          </>
        </Icon>
      )}
    </Box>
  );
};
