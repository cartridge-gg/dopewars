import { AvatarPathProps } from "../Avatar";

export const PersonM = ({ color, hasCrown }: AvatarPathProps) => {
  let path;
  switch (color) {
    // Green color
    case "green":
      path = hasCrown ? (
        <g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M40 5H35V10H30V20H45V10H40V5ZM40 10H35V15H40V10Z"
            fill="#00743E"
          />
          <path d="M20 25H25V30H20V25Z" fill="#00743E" />
          <path d="M25 35V30H30V35H25Z" fill="#00743E" />
          <path d="M25 35V40H20V35H25Z" fill="#00743E" />
          <path d="M30 40H40V45H30V40Z" fill="#00743E" />
          <path d="M30 45V50H40V60H25V45H30Z" fill="#00743E" />
          <path d="M45 30H40V35H45V30Z" fill="#00743E" />
          <path d="M25 5V10H20V25H55V20H30V10H35V5H25Z" fill="#114329" />
          <path d="M35 40H40V30H35V40Z" fill="#114329" />
          <path d="M45 50H40V60H50V55H45V50Z" fill="#114329" />
          <path d="M20 55V50H25V60H15V55H20Z" fill="#114329" />
          <path d="M40 10H35V15H40V10Z" fill="#0FD976" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M25 25V30H20V35H25V45H30V50H40V45H45V35H40V45H30V40H35V30H45V25H25ZM30 30V35H25V30H30Z"
            fill="#0FD976"
          />
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
        <g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M40 5H35V10H30V20H45V10H40V5ZM40 10H35V15H40V10Z"
            fill="#00743E"
          />
          <path d="M20 25H25V30H20V25Z" fill="#00743E" />
          <path d="M25 35V30H30V35H25Z" fill="#00743E" />
          <path d="M25 35V40H20V35H25Z" fill="#00743E" />
          <path d="M30 40H40V45H30V40Z" fill="#00743E" />
          <path d="M30 45V50H40V60H25V45H30Z" fill="#00743E" />
          <path d="M45 30H40V35H45V30Z" fill="#00743E" />
          <path d="M25 5V10H20V25H55V20H30V10H35V5H25Z" fill="#114329" />
          <path d="M35 40H40V30H35V40Z" fill="#114329" />
          <path d="M45 50H40V60H50V55H45V50Z" fill="#114329" />
          <path d="M20 55V50H25V60H15V55H20Z" fill="#114329" />
          <path d="M40 10H35V15H40V10Z" fill="#0FD976" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M25 25V30H20V35H25V45H30V50H40V45H45V35H40V45H30V40H35V30H45V25H25ZM30 30V35H25V30H30Z"
            fill="#0FD976"
          />
        </g>
      );
      break;
    // Yellow color
    case "yellow":
      path = hasCrown ? (
        <g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M40 5H35V10H30V20H45V10H40V5ZM40 10H35V15H40V10Z"
            fill="#A78C44"
          />
          <path d="M20 25H25V30H20V25Z" fill="#A78C44" />
          <path d="M25 35V30H30V35H25Z" fill="#A78C44" />
          <path d="M25 35V40H20V35H25Z" fill="#A78C44" />
          <path d="M30 40H40V45H30V40Z" fill="#A78C44" />
          <path d="M30 45V50H40V60H25V45H30Z" fill="#A78C44" />
          <path d="M45 30H40V35H45V30Z" fill="#A78C44" />
          <path d="M25 5V10H20V25H55V20H30V10H35V5H25Z" fill="#5E4E26" />
          <path d="M35 40H40V30H35V40Z" fill="#5E4E26" />
          <path d="M45 50H40V60H50V55H45V50Z" fill="#5E4E26" />
          <path d="M20 55V50H25V60H15V55H20Z" fill="#5E4E26" />
          <path d="M40 10H35V15H40V10Z" fill="#FDE092" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M25 25V30H20V35H25V45H30V50H40V45H45V35H40V45H30V40H35V30H45V25H25ZM30 30V35H25V30H30Z"
            fill="#FDE092"
          />
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
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M40 5H35V10H30V20H45V10H40V5ZM40 10H35V15H40V10Z"
            fill="#A78C44"
          />
          <path d="M20 25H25V30H20V25Z" fill="#A78C44" />
          <path d="M25 35V30H30V35H25Z" fill="#A78C44" />
          <path d="M25 35V40H20V35H25Z" fill="#A78C44" />
          <path d="M30 40H40V45H30V40Z" fill="#A78C44" />
          <path d="M30 45V50H40V60H25V45H30Z" fill="#A78C44" />
          <path d="M45 30H40V35H45V30Z" fill="#A78C44" />
          <path d="M25 5V10H20V25H55V20H30V10H35V5H25Z" fill="#5E4E26" />
          <path d="M35 40H40V30H35V40Z" fill="#5E4E26" />
          <path d="M45 50H40V60H50V55H45V50Z" fill="#5E4E26" />
          <path d="M20 55V50H25V60H15V55H20Z" fill="#5E4E26" />
          <path d="M40 10H35V15H40V10Z" fill="#FDE092" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M25 25V30H20V35H25V45H30V50H40V45H45V35H40V45H30V40H35V30H45V25H25ZM30 30V35H25V30H30Z"
            fill="#FDE092"
          />
        </g>
      );
      break;
  }
  return path;
};
