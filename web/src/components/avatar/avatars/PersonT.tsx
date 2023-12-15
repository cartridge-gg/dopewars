import { AvatarPathProps } from "../Avatar";

export const PersonT = ({ color, hasCrown }: AvatarPathProps) => {
  let path;
  switch (color) {
    // Green color
    case "green":
      path = hasCrown ? (
        <g>
          <path d="M40 30H45V35H40V30Z" fill="#114329" />
          <path d="M40 40H30V45H40V40Z" fill="#114329" />
          <path d="M45 50H40V60H50V55H45V50Z" fill="#114329" />
          <path d="M25 50H20V55H15V60H25V50Z" fill="#114329" />
          <path d="M30 30H25V35H30V30Z" fill="#114329" />
          <path d="M25 15H30V20H25V15Z" fill="#00743E" />
          <path d="M25 20V30H15V25H20V20H25Z" fill="#00743E" />
          <path d="M40 30H35V40H40V45H30V40H25V50H30V55H40V50H45V40H40V30Z" fill="#00743E" />
          <path d="M45 20H50V30H45V20Z" fill="#00743E" />
          <path d="M30 15H40V20H45V30H35V40H25V35H30V30H25V20H30V15Z" fill="#0FD976" />
          <path d="M25 30V35H20V30H25Z" fill="#0FD976" />
          <path d="M45 35H40V40H45V35Z" fill="#0FD976" />
          <path d="M30 55H40V60H25V50H30V55Z" fill="#0FD976" />
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
          <path d="M40 30H45V35H40V30Z" fill="#114329" />
          <path d="M40 40H30V45H40V40Z" fill="#114329" />
          <path d="M45 50H40V60H50V55H45V50Z" fill="#114329" />
          <path d="M25 50H20V55H15V60H25V50Z" fill="#114329" />
          <path d="M30 30H25V35H30V30Z" fill="#114329" />
          <path d="M25 15H30V20H25V15Z" fill="#00743E" />
          <path d="M25 20V30H15V25H20V20H25Z" fill="#00743E" />
          <path d="M40 30H35V40H40V45H30V40H25V50H30V55H40V50H45V40H40V30Z" fill="#00743E" />
          <path d="M45 20H50V30H45V20Z" fill="#00743E" />
          <path d="M30 15H40V20H45V30H35V40H25V35H30V30H25V20H30V15Z" fill="#0FD976" />
          <path d="M25 30V35H20V30H25Z" fill="#0FD976" />
          <path d="M45 35H40V40H45V35Z" fill="#0FD976" />
          <path d="M30 55H40V60H25V50H30V55Z" fill="#0FD976" />
        </g>
      );
      break;
    // Yellow color
    case "yellow":
      path = hasCrown ? (
        <g>
          <path d="M40 30H45V35H40V30Z" fill="#5E4E26" />
          <path d="M40 40H30V45H40V40Z" fill="#5E4E26" />
          <path d="M45 50H40V60H50V55H45V50Z" fill="#5E4E26" />
          <path d="M25 50H20V55H15V60H25V50Z" fill="#5E4E26" />
          <path d="M30 30H25V35H30V30Z" fill="#5E4E26" />
          <path d="M25 15H30V20H25V15Z" fill="#A78C44" />
          <path d="M25 20V30H15V25H20V20H25Z" fill="#A78C44" />
          <path d="M40 30H35V40H40V45H30V40H25V50H30V55H40V50H45V40H40V30Z" fill="#A78C44" />
          <path d="M45 20H50V30H45V20Z" fill="#A78C44" />
          <path d="M30 15H40V20H45V30H35V40H25V35H30V30H25V20H30V15Z" fill="#FDE092" />
          <path d="M25 30V35H20V30H25Z" fill="#FDE092" />
          <path d="M45 35H40V40H45V35Z" fill="#FDE092" />
          <path d="M30 55H40V60H25V50H30V55Z" fill="#FDE092" />
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
          <path d="M40 30H45V35H40V30Z" fill="#5E4E26" />
          <path d="M40 40H30V45H40V40Z" fill="#5E4E26" />
          <path d="M45 50H40V60H50V55H45V50Z" fill="#5E4E26" />
          <path d="M25 50H20V55H15V60H25V50Z" fill="#5E4E26" />
          <path d="M30 30H25V35H30V30Z" fill="#5E4E26" />
          <path d="M25 15H30V20H25V15Z" fill="#A78C44" />
          <path d="M25 20V30H15V25H20V20H25Z" fill="#A78C44" />
          <path d="M40 30H35V40H40V45H30V40H25V50H30V55H40V50H45V40H40V30Z" fill="#A78C44" />
          <path d="M45 20H50V30H45V20Z" fill="#A78C44" />
          <path d="M30 15H40V20H45V30H35V40H25V35H30V30H25V20H30V15Z" fill="#FDE092" />
          <path d="M25 30V35H20V30H25Z" fill="#FDE092" />
          <path d="M45 35H40V40H45V35Z" fill="#FDE092" />
          <path d="M30 55H40V60H25V50H30V55Z" fill="#FDE092" />
        </g>
      );
      break;
  }
  return path;
};
