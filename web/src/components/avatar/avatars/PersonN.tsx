import { AvatarPathProps } from "../Avatar";

export const PersonN = ({ color, hasCrown }: AvatarPathProps) => {
  let path;
  switch (color) {
    // Green color
    case "green":
      path = hasCrown ? (
        <>
          <g clipPath="url(#clip0_620_2321)">
            <path d="M50 5H40V10H30V15H20V20H45V15H50V5Z" fill="#00743E" />
            <path d="M25 25H20V30H25V35H20V40H25V35H30V30H25V25Z" fill="#00743E" />
            <path d="M30 40V45H25V60H40V50H30V45H40V40H30Z" fill="#00743E" />
            <path d="M45 30H40V35H45V30Z" fill="#00743E" />
            <path d="M20 20V25H45V20H20Z" fill="#114329" />
            <path d="M35 30H40V40H35V30Z" fill="#114329" />
            <path d="M45 50H40V60H50V55H45V50Z" fill="#114329" />
            <path d="M20 55V50H25V60H15V55H20Z" fill="#114329" />
            <path d="M45 25V30H35V40H30V45H25V35H30V30H25V25H45Z" fill="#0FD976" />
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
          <defs>
            <clipPath id="clip0_620_2321">
              <rect width="60" height="60" fill="white" />
            </clipPath>
          </defs>
        </>
      ) : (
        <>
          <g clipPath="url(#clip0_620_2303)">
            <path d="M50 5H40V10H30V15H20V20H45V15H50V5Z" fill="#00743E" />
            <path d="M25 25H20V30H25V35H20V40H25V35H30V30H25V25Z" fill="#00743E" />
            <path d="M30 40V45H25V60H40V50H30V45H40V40H30Z" fill="#00743E" />
            <path d="M45 30H40V35H45V30Z" fill="#00743E" />
            <path d="M20 20V25H45V20H20Z" fill="#114329" />
            <path d="M35 30H40V40H35V30Z" fill="#114329" />
            <path d="M45 50H40V60H50V55H45V50Z" fill="#114329" />
            <path d="M20 55V50H25V60H15V55H20Z" fill="#114329" />
            <path d="M45 25V30H35V40H30V45H25V35H30V30H25V25H45Z" fill="#0FD976" />
            <path d="M25 30H20V35H25V30Z" fill="#0FD976" />
            <path d="M40 45V50H30V45H40Z" fill="#0FD976" />
            <path d="M40 45V35H45V45H40Z" fill="#0FD976" />
          </g>
          <defs>
            <clipPath id="clip0_620_2303">
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
          <g clipPath="url(#clip0_620_2330)">
            <path d="M50 5H40V10H30V15H20V20H45V15H50V5Z" fill="#A78C44" />
            <path d="M25 25H20V30H25V35H20V40H25V35H30V30H25V25Z" fill="#A78C44" />
            <path d="M30 40V45H25V60H40V50H30V45H40V40H30Z" fill="#A78C44" />
            <path d="M45 30H40V35H45V30Z" fill="#A78C44" />
            <path d="M20 20V25H45V20H20Z" fill="#5E4E26" />
            <path d="M35 30H40V40H35V30Z" fill="#5E4E26" />
            <path d="M45 50H40V60H50V55H45V50Z" fill="#5E4E26" />
            <path d="M20 55V50H25V60H15V55H20Z" fill="#5E4E26" />
            <path d="M45 25V30H35V40H30V45H25V35H30V30H25V25H45Z" fill="#FDE092" />
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
          <defs>
            <clipPath id="clip0_620_2330">
              <rect width="60" height="60" fill="white" />
            </clipPath>
          </defs>
        </>
      ) : (
        <>
          <g clipPath="url(#clip0_620_2312)">
            <path d="M50 5H40V10H30V15H20V20H45V15H50V5Z" fill="#A78C44" />
            <path d="M25 25H20V30H25V35H20V40H25V35H30V30H25V25Z" fill="#A78C44" />
            <path d="M30 40V45H25V60H40V50H30V45H40V40H30Z" fill="#A78C44" />
            <path d="M45 30H40V35H45V30Z" fill="#A78C44" />
            <path d="M20 20V25H45V20H20Z" fill="#5E4E26" />
            <path d="M35 30H40V40H35V30Z" fill="#5E4E26" />
            <path d="M45 50H40V60H50V55H45V50Z" fill="#5E4E26" />
            <path d="M20 55V50H25V60H15V55H20Z" fill="#5E4E26" />
            <path d="M45 25V30H35V40H30V45H25V35H30V30H25V25H45Z" fill="#FDE092" />
            <path d="M25 30H20V35H25V30Z" fill="#FDE092" />
            <path d="M40 45V50H30V45H40Z" fill="#FDE092" />
            <path d="M40 45V35H45V45H40Z" fill="#FDE092" />
          </g>
          <defs>
            <clipPath id="clip0_620_2312">
              <rect width="60" height="60" fill="white" />
            </clipPath>
          </defs>
        </>
      );
      break;
  }
  return path;
};
