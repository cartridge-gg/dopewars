import { AvatarPathProps } from "../Avatar";

export const PersonQ = ({ color, hasCrown }: AvatarPathProps) => {
  let path;
  switch (color) {
    // Green color
    case "green":
      path = hasCrown ? (
        <g>
          <path d="M25 30H30V35H25V30Z" fill="#00743E" />
          <path d="M30 40H40V45H30V40Z" fill="#00743E" />
          <path d="M30 45V50H35V60H25V45H30Z" fill="#00743E" />
          <path d="M45 30H40V35H45V30Z" fill="#00743E" />
          <path d="M40 10H50V20H45V25H40V20H30V25H25V30H20V35H25V45H15V20H10V10H20V15H40V10Z" fill="#114329" />
          <path d="M35 55V60H45V55H35Z" fill="#114329" />
          <path d="M35 40V30H40V40H35Z" fill="#114329" />
          <path d="M25 55H15V60H25V55Z" fill="#114329" />
          <path d="M40 20V25H45V30H35V40H30V45H25V35H30V30H25V25H30V20H40Z" fill="#0FD976" />
          <path d="M25 30H20V35H25V30Z" fill="#0FD976" />
          <path d="M40 45V50H30V45H40Z" fill="#0FD976" />
          <path d="M40 45V35H45V45H40Z" fill="#0FD976" />
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
          <path d="M25 30H30V35H25V30Z" fill="#00743E" />
          <path d="M30 40H40V45H30V40Z" fill="#00743E" />
          <path d="M30 45V50H35V60H25V45H30Z" fill="#00743E" />
          <path d="M45 30H40V35H45V30Z" fill="#00743E" />
          <path d="M40 10H50V20H45V25H40V20H30V25H25V30H20V35H25V45H15V20H10V10H20V15H40V10Z" fill="#114329" />
          <path d="M35 55V60H45V55H35Z" fill="#114329" />
          <path d="M35 40V30H40V40H35Z" fill="#114329" />
          <path d="M25 55H15V60H25V55Z" fill="#114329" />
          <path d="M40 20V25H45V30H35V40H30V45H25V35H30V30H25V25H30V20H40Z" fill="#0FD976" />
          <path d="M25 30H20V35H25V30Z" fill="#0FD976" />
          <path d="M40 45V50H30V45H40Z" fill="#0FD976" />
          <path d="M40 45V35H45V45H40Z" fill="#0FD976" />
        </g>
      );
      break;
    // Yellow color
    case "yellow":
      path = hasCrown ? (
        <g>
          <path d="M25 30H30V35H25V30Z" fill="#A78C44" />
          <path d="M30 40H40V45H30V40Z" fill="#A78C44" />
          <path d="M30 45V50H35V60H25V45H30Z" fill="#A78C44" />
          <path d="M45 30H40V35H45V30Z" fill="#A78C44" />
          <path d="M40 10H50V20H45V25H40V20H30V25H25V30H20V35H25V45H15V20H10V10H20V15H40V10Z" fill="#5E4E26" />
          <path d="M35 55V60H45V55H35Z" fill="#5E4E26" />
          <path d="M35 40V30H40V40H35Z" fill="#5E4E26" />
          <path d="M25 55H15V60H25V55Z" fill="#5E4E26" />
          <path d="M40 20V25H45V30H35V40H30V45H25V35H30V30H25V25H30V20H40Z" fill="#FDE092" />
          <path d="M25 30H20V35H25V30Z" fill="#FDE092" />
          <path d="M40 45V50H30V45H40Z" fill="#FDE092" />
          <path d="M40 45V35H45V45H40Z" fill="#FDE092" />
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
          <path d="M25 30H30V35H25V30Z" fill="#A78C44" />
          <path d="M30 40H40V45H30V40Z" fill="#A78C44" />
          <path d="M30 45V50H35V60H25V45H30Z" fill="#A78C44" />
          <path d="M45 30H40V35H45V30Z" fill="#A78C44" />
          <path d="M40 10H50V20H45V25H40V20H30V25H25V30H20V35H25V45H15V20H10V10H20V15H40V10Z" fill="#5E4E26" />
          <path d="M35 55V60H45V55H35Z" fill="#5E4E26" />
          <path d="M35 40V30H40V40H35Z" fill="#5E4E26" />
          <path d="M25 55H15V60H25V55Z" fill="#5E4E26" />
          <path d="M40 20V25H45V30H35V40H30V45H25V35H30V30H25V25H30V20H40Z" fill="#FDE092" />
          <path d="M25 30H20V35H25V30Z" fill="#FDE092" />
          <path d="M40 45V50H30V45H40Z" fill="#FDE092" />
          <path d="M40 45V35H45V45H40Z" fill="#FDE092" />
        </g>
      );
      break;
  }
  return path;
};
