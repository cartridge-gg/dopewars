import { AvatarPathProps } from "../Avatar";

export const PersonP = ({ color, hasCrown }: AvatarPathProps) => {
  let path;
  switch (color) {
    // Green color
    case "green":
      path = hasCrown ? (
        <>
          <g clipPath="url(#clip0_620_2323)">
            <path d="M35 10V15H45V20H30V30H25V20H20V30H15V15H20V10H35Z" fill="#114329" />
            <path d="M10 50V30H15V50H10Z" fill="#114329" />
            <path d="M10 50V55H5V50H10Z" fill="#114329" />
            <path d="M30 35V30H35V35H30Z" fill="#114329" />
            <path d="M30 35V40H25V35H30Z" fill="#114329" />
            <path d="M45 20H50V25H45V20Z" fill="#114329" />
            <path d="M40 55H50V60H40V55Z" fill="#114329" />
            <path d="M40 40H45V30H40V40Z" fill="#114329" />
            <path d="M30 55V60H20V55H30Z" fill="#114329" />
            <path d="M45 20H35V35H30V30H25V35H30V45H35V50H45V45H50V35H45V45H35V40H40V30H50V25H45V20Z" fill="#0FD976" />
            <path d="M30 20H35V30H30V20Z" fill="#00743E" />
            <path d="M50 30H45V35H50V30Z" fill="#00743E" />
            <path d="M35 40V45H30V60H40V50H35V45H45V40H35Z" fill="#00743E" />
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
            <clipPath id="clip0_620_2323">
              <rect width="60" height="60" fill="white" />
            </clipPath>
          </defs>
        </>
      ) : (
        <>
          <g clipPath="url(#clip0_620_2305)">
            <path d="M35 10V15H45V20H30V30H25V20H20V30H15V15H20V10H35Z" fill="#114329" />
            <path d="M10 50V30H15V50H10Z" fill="#114329" />
            <path d="M10 50V55H5V50H10Z" fill="#114329" />
            <path d="M30 35V30H35V35H30Z" fill="#114329" />
            <path d="M30 35V40H25V35H30Z" fill="#114329" />
            <path d="M45 20H50V25H45V20Z" fill="#114329" />
            <path d="M40 55H50V60H40V55Z" fill="#114329" />
            <path d="M40 40H45V30H40V40Z" fill="#114329" />
            <path d="M30 55V60H20V55H30Z" fill="#114329" />
            <path d="M45 20H35V35H30V30H25V35H30V45H35V50H45V45H50V35H45V45H35V40H40V30H50V25H45V20Z" fill="#0FD976" />
            <path d="M30 20H35V30H30V20Z" fill="#00743E" />
            <path d="M50 30H45V35H50V30Z" fill="#00743E" />
            <path d="M35 40V45H30V60H40V50H35V45H45V40H35Z" fill="#00743E" />
          </g>
          <defs>
            <clipPath id="clip0_620_2305">
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
          <g clipPath="url(#clip0_620_2332)">
            <path d="M35 10V15H45V20H30V30H25V20H20V30H15V15H20V10H35Z" fill="#5E4E26" />
            <path d="M10 50V30H15V50H10Z" fill="#5E4E26" />
            <path d="M10 50V55H5V50H10Z" fill="#5E4E26" />
            <path d="M30 35V30H35V35H30Z" fill="#5E4E26" />
            <path d="M30 35V40H25V35H30Z" fill="#5E4E26" />
            <path d="M45 20H50V25H45V20Z" fill="#5E4E26" />
            <path d="M40 55H50V60H40V55Z" fill="#5E4E26" />
            <path d="M40 40H45V30H40V40Z" fill="#5E4E26" />
            <path d="M30 55V60H20V55H30Z" fill="#5E4E26" />
            <path d="M45 20H35V35H30V30H25V35H30V45H35V50H45V45H50V35H45V45H35V40H40V30H50V25H45V20Z" fill="#FDE092" />
            <path d="M30 20H35V30H30V20Z" fill="#A78C44" />
            <path d="M50 30H45V35H50V30Z" fill="#A78C44" />
            <path d="M35 40V45H30V60H40V50H35V45H45V40H35Z" fill="#A78C44" />
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
            <clipPath id="clip0_620_2332">
              <rect width="60" height="60" fill="white" />
            </clipPath>
          </defs>
        </>
      ) : (
        <>
          <g clipPath="url(#clip0_620_2314)">
            <path d="M35 10V15H45V20H30V30H25V20H20V30H15V15H20V10H35Z" fill="#5E4E26" />
            <path d="M10 50V30H15V50H10Z" fill="#5E4E26" />
            <path d="M10 50V55H5V50H10Z" fill="#5E4E26" />
            <path d="M30 35V30H35V35H30Z" fill="#5E4E26" />
            <path d="M30 35V40H25V35H30Z" fill="#5E4E26" />
            <path d="M45 20H50V25H45V20Z" fill="#5E4E26" />
            <path d="M40 55H50V60H40V55Z" fill="#5E4E26" />
            <path d="M40 40H45V30H40V40Z" fill="#5E4E26" />
            <path d="M30 55V60H20V55H30Z" fill="#5E4E26" />
            <path d="M45 20H35V35H30V30H25V35H30V45H35V50H45V45H50V35H45V45H35V40H40V30H50V25H45V20Z" fill="#FDE092" />
            <path d="M30 20H35V30H30V20Z" fill="#A78C44" />
            <path d="M50 30H45V35H50V30Z" fill="#A78C44" />
            <path d="M35 40V45H30V60H40V50H35V45H45V40H35Z" fill="#A78C44" />
          </g>
          <defs>
            <clipPath id="clip0_620_2314">
              <rect width="60" height="60" fill="white" />
            </clipPath>
          </defs>
        </>
      );
      break;
  }
  return path;
};
