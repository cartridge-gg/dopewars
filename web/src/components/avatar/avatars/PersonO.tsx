import { AvatarPathProps } from "../Avatar";

export const PersonO = ({ color, hasCrown }: AvatarPathProps) => {
  let path;
  switch (color) {
    // Green color
    case "green":
      path = hasCrown ? (
        <>
          <g clipPath="url(#clip0_620_2322)">
            <path d="M45 10H30V15H20V20H15V30H25V20H30V15H40V20H45V25H50V15H45V10Z" fill="#00743E" />
            <path d="M20 35H25V40H20V35Z" fill="#00743E" />
            <path d="M30 40H40V45H30V40Z" fill="#00743E" />
            <path d="M30 45V50H40V60H25V45H30Z" fill="#00743E" />
            <path d="M35 30H40V35H35V30Z" fill="#00743E" />
            <path d="M30 15H40V20H45V25H25V20H30V15Z" fill="#0FD976" />
            <path d="M20 30H25V35H20V30Z" fill="#0FD976" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M25 35V45H30V50H40V45H45V35H25ZM40 40H30V45H40V40Z"
              fill="#0FD976"
            />
            <path d="M50 25V35H40V30H35V35H25V25H50Z" fill="#114329" />
            <path d="M45 50H40V60H50V55H45V50Z" fill="#114329" />
            <path d="M20 55V50H25V60H15V55H20Z" fill="#114329" />
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
          <defs>
            <clipPath id="clip0_620_2322">
              <rect width="60" height="60" fill="white" />
            </clipPath>
          </defs>
        </>
      ) : (
        <>
          <g clipPath="url(#clip0_620_2304)">
            <path d="M45 10H30V15H20V20H15V30H25V20H30V15H40V20H45V25H50V15H45V10Z" fill="#00743E" />
            <path d="M20 35H25V40H20V35Z" fill="#00743E" />
            <path d="M30 40H40V45H30V40Z" fill="#00743E" />
            <path d="M30 45V50H40V60H25V45H30Z" fill="#00743E" />
            <path d="M35 30H40V35H35V30Z" fill="#00743E" />
            <path d="M30 15H40V20H45V25H25V20H30V15Z" fill="#0FD976" />
            <path d="M20 30H25V35H20V30Z" fill="#0FD976" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M25 35V45H30V50H40V45H45V35H25ZM40 40H30V45H40V40Z"
              fill="#0FD976"
            />
            <path d="M50 25V35H40V30H35V35H25V25H50Z" fill="#114329" />
            <path d="M45 50H40V60H50V55H45V50Z" fill="#114329" />
            <path d="M20 55V50H25V60H15V55H20Z" fill="#114329" />
          </g>
          <defs>
            <clipPath id="clip0_620_2304">
              <rect width="60" height="60" fill="white" />
            </clipPath>
          </defs>
        </>
      );
      break;
    // Yellow color
    case "yellow":
      path = hasCrown ? (
        <>
          <g clipPath="url(#clip0_620_2331)">
            <path d="M45 10H30V15H20V20H15V30H25V20H30V15H40V20H45V25H50V15H45V10Z" fill="#A78C44" />
            <path d="M20 35H25V40H20V35Z" fill="#A78C44" />
            <path d="M30 40H40V45H30V40Z" fill="#A78C44" />
            <path d="M30 45V50H40V60H25V45H30Z" fill="#A78C44" />
            <path d="M35 30H40V35H35V30Z" fill="#A78C44" />
            <path d="M30 15H40V20H45V25H25V20H30V15Z" fill="#FDE092" />
            <path d="M20 30H25V35H20V30Z" fill="#FDE092" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M25 35V45H30V50H40V45H45V35H25ZM40 40H30V45H40V40Z"
              fill="#FDE092"
            />
            <path d="M50 25V35H40V30H35V35H25V25H50Z" fill="#5E4E26" />
            <path d="M45 50H40V60H50V55H45V50Z" fill="#5E4E26" />
            <path d="M20 55V50H25V60H15V55H20Z" fill="#5E4E26" />
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
          <defs>
            <clipPath id="clip0_620_2331">
              <rect width="60" height="60" fill="white" />
            </clipPath>
          </defs>
        </>
      ) : (
        <>
          <g clipPath="url(#clip0_620_2313)">
            <path d="M45 10H30V15H20V20H15V30H25V20H30V15H40V20H45V25H50V15H45V10Z" fill="#A78C44" />
            <path d="M20 35H25V40H20V35Z" fill="#A78C44" />
            <path d="M30 40H40V45H30V40Z" fill="#A78C44" />
            <path d="M30 45V50H40V60H25V45H30Z" fill="#A78C44" />
            <path d="M35 30H40V35H35V30Z" fill="#A78C44" />
            <path d="M30 15H40V20H45V25H25V20H30V15Z" fill="#FDE092" />
            <path d="M20 30H25V35H20V30Z" fill="#FDE092" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M25 35V45H30V50H40V45H45V35H25ZM40 40H30V45H40V40Z"
              fill="#FDE092"
            />
            <path d="M50 25V35H40V30H35V35H25V25H50Z" fill="#5E4E26" />
            <path d="M45 50H40V60H50V55H45V50Z" fill="#5E4E26" />
            <path d="M20 55V50H25V60H15V55H20Z" fill="#5E4E26" />
          </g>
          <defs>
            <clipPath id="clip0_620_2313">
              <rect width="60" height="60" fill="white" />
            </clipPath>
          </defs>
        </>
      );
      break;
  }
  return path;
};
