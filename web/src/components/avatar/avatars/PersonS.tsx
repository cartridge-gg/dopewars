import { AvatarPathProps } from "../Avatar";

export const PersonS = ({ color, hasCrown }: AvatarPathProps) => {
  let path;
  switch (color) {
    // Green color
    case "green":
      path = hasCrown ? (
        <g>
          <path d="M35 10V15H30V20H25V30H20V35H25V45H20V40H15V20H20V15H25V10H35Z" fill="#114329" />
          <path d="M25 35V30H30V35H25Z" fill="#114329" />
          <path d="M45 30V35H40V40H35V30H45Z" fill="#114329" />
          <path d="M35 55V60H45V55H35Z" fill="#114329" />
          <path d="M25 55H15V60H25V55Z" fill="#114329" />
          <path d="M30 25H35V40H30V45H25V35H30V25Z" fill="#0FD976" />
          <path d="M25 35H20V30H25V35Z" fill="#0FD976" />
          <path d="M40 45V50H30V45H40Z" fill="#0FD976" />
          <path d="M40 45V35H45V45H40Z" fill="#0FD976" />
          <path d="M45 25H40V30H45V25Z" fill="#0FD976" />
          <path d="M45 10V20H50V35H45V25H40V30H35V25H30V30H25V20H30V15H35V10H45Z" fill="#00743E" />
          <path d="M30 40H40V45H30V40Z" fill="#00743E" />
          <path d="M30 45V50H35V60H25V45H30Z" fill="#00743E" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15 5H50V25H15V5ZM44.9914 10.0075H40.0029V15.005H34.9943V10.0075H30.0057V15.005H24.9971V10.0075H20.0086V19.9925H44.9914V10.0075Z"
            fill="#172217"
          />
          <path
            d="M25.0136 9.99756H20.0063V20.0026H45.0027V9.99756H39.9954V14.9951H35.0081V9.99756H30.0009V14.9951H25.0136V9.99756Z"
            fill="#11ED83"
          />
        </g>
      ) : (
        <>
          <g clipPath="url(#clip0_620_2308)">
            <path d="M35 10V15H30V20H25V30H20V35H25V45H20V40H15V20H20V15H25V10H35Z" fill="#114329" />
            <path d="M25 35V30H30V35H25Z" fill="#114329" />
            <path d="M45 30V35H40V40H35V30H45Z" fill="#114329" />
            <path d="M35 55V60H45V55H35Z" fill="#114329" />
            <path d="M25 55H15V60H25V55Z" fill="#114329" />
            <path d="M30 25H35V40H30V45H25V35H30V25Z" fill="#0FD976" />
            <path d="M25 35H20V30H25V35Z" fill="#0FD976" />
            <path d="M40 45V50H30V45H40Z" fill="#0FD976" />
            <path d="M40 45V35H45V45H40Z" fill="#0FD976" />
            <path d="M45 25H40V30H45V25Z" fill="#0FD976" />
            <path d="M45 10V20H50V35H45V25H40V30H35V25H30V30H25V20H30V15H35V10H45Z" fill="#00743E" />
            <path d="M30 40H40V45H30V40Z" fill="#00743E" />
            <path d="M30 45V50H35V60H25V45H30Z" fill="#00743E" />
          </g>
          <defs>
            <clipPath id="clip0_620_2308">
              <rect width="60" height="60" fill="white" />
            </clipPath>
          </defs>
        </>
      );
      break;
    // Yellow color
    case "yellow":
      path = hasCrown ? (
        <g>
          <path d="M35 10V15H30V20H25V30H20V35H25V45H20V40H15V20H20V15H25V10H35Z" fill="#5E4E26" />
          <path d="M25 35V30H30V35H25Z" fill="#5E4E26" />
          <path d="M45 30V35H40V40H35V30H45Z" fill="#5E4E26" />
          <path d="M35 55V60H45V55H35Z" fill="#5E4E26" />
          <path d="M25 55H15V60H25V55Z" fill="#5E4E26" />
          <path d="M30 25H35V40H30V45H25V35H30V25Z" fill="#FDE092" />
          <path d="M25 35H20V30H25V35Z" fill="#FDE092" />
          <path d="M40 45V50H30V45H40Z" fill="#FDE092" />
          <path d="M40 45V35H45V45H40Z" fill="#FDE092" />
          <path d="M45 25H40V30H45V25Z" fill="#FDE092" />
          <path d="M45 10V20H50V35H45V25H40V30H35V25H30V30H25V20H30V15H35V10H45Z" fill="#A78C44" />
          <path d="M30 40H40V45H30V40Z" fill="#A78C44" />
          <path d="M30 45V50H35V60H25V45H30Z" fill="#A78C44" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15 5H50V25H15V5ZM44.9914 10.0075H40.0029V15.005H34.9943V10.0075H30.0057V15.005H24.9971V10.0075H20.0086V19.9925H44.9914V10.0075Z"
            fill="#172217"
          />
          <path
            d="M25.0136 9.99756H20.0063V20.0026H45.0027V9.99756H39.9954V14.9951H35.0081V9.99756H30.0009V14.9951H25.0136V9.99756Z"
            fill="#FBCB4A"
          />
        </g>
      ) : (
        <g>
          <path d="M35 10V15H30V20H25V30H20V35H25V45H20V40H15V20H20V15H25V10H35Z" fill="#5E4E26" />
          <path d="M25 35V30H30V35H25Z" fill="#5E4E26" />
          <path d="M45 30V35H40V40H35V30H45Z" fill="#5E4E26" />
          <path d="M35 55V60H45V55H35Z" fill="#5E4E26" />
          <path d="M25 55H15V60H25V55Z" fill="#5E4E26" />
          <path d="M30 25H35V40H30V45H25V35H30V25Z" fill="#FDE092" />
          <path d="M25 35H20V30H25V35Z" fill="#FDE092" />
          <path d="M40 45V50H30V45H40Z" fill="#FDE092" />
          <path d="M40 45V35H45V45H40Z" fill="#FDE092" />
          <path d="M45 25H40V30H45V25Z" fill="#FDE092" />
          <path d="M45 10V20H50V35H45V25H40V30H35V25H30V30H25V20H30V15H35V10H45Z" fill="#A78C44" />
          <path d="M30 40H40V45H30V40Z" fill="#A78C44" />
          <path d="M30 45V50H35V60H25V45H30Z" fill="#A78C44" />
        </g>
      );
      break;
  }
  return path;
};
