import { AvatarPathProps } from "../Avatar";

export const PersonL = ({ color, hasCrown }: AvatarPathProps) => {
  let path;
  switch (color) {
    // Green color
    case "green":
      path = hasCrown ? (
        <g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M30 20H40.05V25H45.05V30.05H35.05V40.05H30.05V45H40V35H45.05V45.05H40.05V50.05H30V45.05H25V35.05H20V30H25V25H30V20ZM25.05 30.05V35H30V30.05H25.05Z"
            fill="#0FD976"
          />
          <path d="M45.05 20H40V25.05H45.05V20Z" fill="#00743E" />
          <path d="M30.05 30H25V35.05H30.05V30Z" fill="#00743E" />
          <path d="M30.05 45.05V50H40.05V60.05H25V45H30V40H40.05V45.05H30.05Z" fill="#00743E" />
          <path d="M45.05 30H40V35.05H45.05V30Z" fill="#00743E" />
          <path
            d="M40.05 10V15H45.05V20H50.05V30.05H45V20.05H30.05V25.05H25.05V30.05H20.05V35H25.05V45.05H20V35.05H15.05V45.05H10V40.05H5V25H15V15H20V10H40.05Z"
            fill="#114329"
          />
          <path d="M35 30H40.05V40.05H35V30Z" fill="#114329" />
          <path d="M15 55H20V50H25.05V60.05H15V55Z" fill="#114329" />
          <path d="M40 50H45.05V55H50.05V60.05H40V50Z" fill="#114329" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15 5H50.05V25H15V5ZM45.0343 10.0075H40.0386V15.005H35.0229V10.0075H30.0272V15.005H25.0114V10.0075H20.0157V19.9925H45.0343V10.0075Z"
            fill="#172217"
          />
          <path
            d="M25.028 9.99756H20.0135V20.0026H45.0456V9.99756H40.0312V14.9951H35.0368V9.99756H30.0224V14.9951H25.028V9.99756Z"
            fill="#11ED83"
          />
        </g>
      ) : (
        <g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M30 20H40.05V25H45.05V30.05H35.05V40.05H30.05V45H40V35H45.05V45.05H40.05V50.05H30V45.05H25V35.05H20V30H25V25H30V20ZM25.05 30.05V35H30V30.05H25.05Z"
            fill="#0FD976"
          />
          <path d="M45.05 20H40V25.05H45.05V20Z" fill="#00743E" />
          <path d="M30.05 30H25V35.05H30.05V30Z" fill="#00743E" />
          <path d="M30.05 45.05V50H40.05V60.05H25V45H30V40H40.05V45.05H30.05Z" fill="#00743E" />
          <path d="M45.05 30H40V35.05H45.05V30Z" fill="#00743E" />
          <path
            d="M40.05 10V15H45.05V20H50.05V30.05H45V20.05H30.05V25.05H25.05V30.05H20.05V35H25.05V45.05H20V35.05H15.05V45.05H10V40.05H5V25H15V15H20V10H40.05Z"
            fill="#114329"
          />
          <path d="M35 30H40.05V40.05H35V30Z" fill="#114329" />
          <path d="M15 55H20V50H25.05V60.05H15V55Z" fill="#114329" />
          <path d="M40 50H45.05V55H50.05V60.05H40V50Z" fill="#114329" />
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
            d="M30 20H40.05V25H45.05V30.05H35.05V40.05H30.05V45H40V35H45.05V45.05H40.05V50.05H30V45.05H25V35.05H20V30H25V25H30V20ZM25.05 30.05V35H30V30.05H25.05Z"
            fill="#FDE092"
          />
          <path d="M45.05 20H40V25.05H45.05V20Z" fill="#A78C44" />
          <path d="M30.05 30H25V35.05H30.05V30Z" fill="#A78C44" />
          <path d="M30.05 45.05V50H40.05V60.05H25V45H30V40H40.05V45.05H30.05Z" fill="#A78C44" />
          <path d="M45.05 30H40V35.05H45.05V30Z" fill="#A78C44" />
          <path
            d="M40.05 10V15H45.05V20H50.05V30.05H45V20.05H30.05V25.05H25.05V30.05H20.05V35H25.05V45.05H20V35.05H15.05V45.05H10V40.05H5V25H15V15H20V10H40.05Z"
            fill="#5E4E26"
          />
          <path d="M35 30H40.05V40.05H35V30Z" fill="#5E4E26" />
          <path d="M15 55H20V50H25.05V60.05H15V55Z" fill="#5E4E26" />
          <path d="M40 50H45.05V55H50.05V60.05H40V50Z" fill="#5E4E26" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15 5H50.05V25H15V5ZM45.0343 10.0075H40.0386V15.005H35.0229V10.0075H30.0272V15.005H25.0114V10.0075H20.0157V19.9925H45.0343V10.0075Z"
            fill="#172217"
          />
          <path
            d="M25.028 9.99756H20.0135V20.0026H45.0456V9.99756H40.0312V14.9951H35.0368V9.99756H30.0224V14.9951H25.028V9.99756Z"
            fill="#FBCB4A"
          />
        </g>
      ) : (
        <g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M30 20H40.05V25H45.05V30.05H35.05V40.05H30.05V45H40V35H45.05V45.05H40.05V50.05H30V45.05H25V35.05H20V30H25V25H30V20ZM25.05 30.05V35H30V30.05H25.05Z"
            fill="#FDE092"
          />
          <path d="M45.05 20H40V25.05H45.05V20Z" fill="#A78C44" />
          <path d="M30.05 30H25V35.05H30.05V30Z" fill="#A78C44" />
          <path d="M30.05 45.05V50H40.05V60.05H25V45H30V40H40.05V45.05H30.05Z" fill="#A78C44" />
          <path d="M45.05 30H40V35.05H45.05V30Z" fill="#A78C44" />
          <path
            d="M40.05 10V15H45.05V20H50.05V30.05H45V20.05H30.05V25.05H25.05V30.05H20.05V35H25.05V45.05H20V35.05H15.05V45.05H10V40.05H5V25H15V15H20V10H40.05Z"
            fill="#5E4E26"
          />
          <path d="M35 30H40.05V40.05H35V30Z" fill="#5E4E26" />
          <path d="M15 55H20V50H25.05V60.05H15V55Z" fill="#5E4E26" />
          <path d="M40 50H45.05V55H50.05V60.05H40V50Z" fill="#5E4E26" />
        </g>
      );
      break;
  }
  return path;
};
