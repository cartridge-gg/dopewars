import { AvatarPathProps } from "../Avatar";

export const PersonI = ({ color, hasCrown }: AvatarPathProps) => {
  let path;
  switch (color) {
    // Green color
    case "green":
      path = hasCrown ? (
        <g>
          <path d="M30.05 20H25V30.05H30.05V20Z" fill="#00743E" />
          <path d="M40.05 30H35V40.05H40.05V30Z" fill="#00743E" />
          <path d="M25 45H30.05V50H40.05V60.05H25V45Z" fill="#00743E" />
          <path
            d="M30 20H45.05V30.05H35.05V40.05H30.05V45H40V35H45.05V45.05H40.05V50.05H30V45.05H25V35.05H20V30H25.05V35H30V20Z"
            fill="#0FD976"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M45.05 15V20H50.05V30H55.05V40.05H50V30.05H45.05V35.05H40V30H45V20.05H25.05V30H30.05V35.05H25.05V45.05H20.05V50H25.05V60.05H15V55H20V50.05H15V45H20V35.05H15.05V40.05H10V35H15V30H20V20H25V15H45.05ZM25 35V30.05H20.05V35H25Z"
            fill="#114329"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M45 45H50.05V50H55.05V55.05H50.05V60.05H40V50H45V45ZM45.05 55H50V50.05H45.05V55Z"
            fill="#114329"
          />
          <path d="M30 40H40.05V45.05H30V40Z" fill="#114329" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.05 5H50.05V25H15.05V5ZM45.0415 10.0075H40.0529V15.005H35.0443V10.0075H30.0558V15.005H25.0472V10.0075H20.0586V19.9925H45.0415V10.0075Z"
            fill="#172217"
          />
          <path
            d="M25.0572 9.99756H20.0486V20.0026H45.0514V9.99756H40.0429V14.9951H35.0543V9.99756H30.0457V14.9951H25.0572V9.99756Z"
            fill="#11ED83"
          />
        </g>
      ) : (
        <g>
          <path d="M30.05 20H25V30.05H30.05V20Z" fill="#00743E" />
          <path d="M40.05 30H35V40.05H40.05V30Z" fill="#00743E" />
          <path d="M25 45H30.05V50H40.05V60.05H25V45Z" fill="#00743E" />
          <path
            d="M30 20H45.05V30.05H35.05V40.05H30.05V45H40V35H45.05V45.05H40.05V50.05H30V45.05H25V35.05H20V30H25.05V35H30V20Z"
            fill="#0FD976"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M45.05 15V20H50.05V30H55.05V40.05H50V30.05H45.05V35.05H40V30H45V20.05H25.05V30H30.05V35.05H25.05V45.05H20.05V50H25.05V60.05H15V55H20V50.05H15V45H20V35.05H15.05V40.05H10V35H15V30H20V20H25V15H45.05ZM25 35V30.05H20.05V35H25Z"
            fill="#114329"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M45 45H50.05V50H55.05V55.05H50.05V60.05H40V50H45V45ZM45.05 55H50V50.05H45.05V55Z"
            fill="#114329"
          />
          <path d="M30 40H40.05V45.05H30V40Z" fill="#114329" />
        </g>
      );
      break;
    // Yellow color
    case "yellow":
      path = hasCrown ? (
        <g>
          <path d="M30.05 20H25V30.05H30.05V20Z" fill="#A78C44" />
          <path d="M40.05 30H35V40.05H40.05V30Z" fill="#A78C44" />
          <path d="M25 45H30.05V50H40.05V60.05H25V45Z" fill="#A78C44" />
          <path
            d="M30 20H45.05V30.05H35.05V40.05H30.05V45H40V35H45.05V45.05H40.05V50.05H30V45.05H25V35.05H20V30H25.05V35H30V20Z"
            fill="#FDE092"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M45.05 15V20H50.05V30H55.05V40.05H50V30.05H45.05V35.05H40V30H45V20.05H25.05V30H30.05V35.05H25.05V45.05H20.05V50H25.05V60.05H15V55H20V50.05H15V45H20V35.05H15.05V40.05H10V35H15V30H20V20H25V15H45.05ZM25 35V30.05H20.05V35H25Z"
            fill="#5E4E26"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M45 45H50.05V50H55.05V55.05H50.05V60.05H40V50H45V45ZM45.05 55H50V50.05H45.05V55Z"
            fill="#5E4E26"
          />
          <path d="M30 40H40.05V45.05H30V40Z" fill="#5E4E26" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15 5H50.05V25H15V5ZM45.0343 10.0075H40.0386V15.005H35.0229V10.0075H30.0272V15.005H25.0114V10.0075H20.0157V19.9925H45.0343V10.0075Z"
            fill="#172217"
          />
          <path
            d="M25.0278 9.99756H20.0134V20.0026H45.0455V9.99756H40.0311V14.9951H35.0367V9.99756H30.0223V14.9951H25.0278V9.99756Z"
            fill="#FBCB4A"
          />
        </g>
      ) : (
        <g>
          <path d="M30.05 20H25V30.05H30.05V20Z" fill="#A78C44" />
          <path d="M40.05 30H35V40.05H40.05V30Z" fill="#A78C44" />
          <path d="M25 45H30.05V50H40.05V60.05H25V45Z" fill="#A78C44" />
          <path
            d="M30 20H45.05V30.05H35.05V40.05H30.05V45H40V35H45.05V45.05H40.05V50.05H30V45.05H25V35.05H20V30H25.05V35H30V20Z"
            fill="#FDE092"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M45.05 15V20H50.05V30H55.05V40.05H50V30.05H45.05V35.05H40V30H45V20.05H25.05V30H30.05V35.05H25.05V45.05H20.05V50H25.05V60.05H15V55H20V50.05H15V45H20V35.05H15.05V40.05H10V35H15V30H20V20H25V15H45.05ZM25 35V30.05H20.05V35H25Z"
            fill="#5E4E26"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M45 45H50.05V50H55.05V55.05H50.05V60.05H40V50H45V45ZM45.05 55H50V50.05H45.05V55Z"
            fill="#5E4E26"
          />
          <path d="M30 40H40.05V45.05H30V40Z" fill="#5E4E26" />
        </g>
      );
      break;
  }
  return path;
};
