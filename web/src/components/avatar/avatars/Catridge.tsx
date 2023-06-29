import { AvatarPathProps } from "../Avatar";

export const Catridge = ({ color, hasCrown }: AvatarPathProps) => {
  let path;
  switch (color) {
    // Green color
    case "green":
      path = hasCrown ? (
        <g>
          <path d="M15 15.5249H20V20.5249H15V15.5249Z" fill="#11ED83" />
          <path d="M20 15.5249H25V20.5249H20V15.5249Z" fill="#11ED83" />
          <path d="M20 10.5249H25V15.5249H20V10.5249Z" fill="#11ED83" />
          <path d="M25 15.5249H30V20.5249H25V15.5249Z" fill="#11ED83" />
          <path d="M30 15.5249H35V20.5249H30V15.5249Z" fill="#11ED83" />
          <path d="M20 35.5249H25V40.5249H20V35.5249Z" fill="#11ED83" />
          <path d="M35 35.5249H40V40.5249H35V35.5249Z" fill="#11ED83" />
          <path d="M10 30.5249H15V35.5249H10V30.5249Z" fill="#11ED83" />
          <path d="M45 35.5249H50V40.5249H45V35.5249Z" fill="#11ED83" />
          <path d="M45 30.5249H50V35.5249H45V30.5249Z" fill="#11ED83" />
          <path d="M10 35.5249H15V40.5249H10V35.5249Z" fill="#11ED83" />
          <path d="M25 45.5249H30V50.5249H25V45.5249Z" fill="#11ED83" />
          <path d="M25 40.5249H30V45.5249H25V40.5249Z" fill="#11ED83" />
          <path d="M30 45.5249H35V50.5249H30V45.5249Z" fill="#11ED83" />
          <path d="M30 40.5249H35V45.5249H30V40.5249Z" fill="#11ED83" />
          <path d="M25 25.5249H30V30.5249H25V25.5249Z" fill="#11ED83" />
          <path d="M30 25.5249H35V30.5249H30V25.5249Z" fill="#11ED83" />
          <path d="M35 15.5249H40V20.5249H35V15.5249Z" fill="#11ED83" />
          <path d="M35 10.5249H40V15.5249H35V10.5249Z" fill="#11ED83" />
          <path d="M20 20.5249H25V25.5249H20V20.5249Z" fill="#11ED83" />
          <path d="M35 20.5249H40V25.5249H35V20.5249Z" fill="#11ED83" />
          <path d="M40 15.5249H45V20.5249H40V15.5249Z" fill="#11ED83" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.475 5.5249H47.525V25.5249H12.475V5.5249ZM42.5093 10.5324H37.5136V15.5299H32.4979V10.5324H27.5021V15.5299H22.4864V10.5324H17.4907V20.5174H42.5093V10.5324Z"
            fill="#172217"
          />
          <path
            d="M22.5029 10.5225H17.4885V20.5275H42.5206V10.5225H37.5062V15.52H32.5118V10.5225H27.4973V15.52H22.5029V10.5225Z"
            fill="#11ED83"
          />
        </g>
      ) : (
        <g>
          <path d="M15 15.5249H20V20.5249H15V15.5249Z" fill="#11ED83" />
          <path d="M20 15.5249H25V20.5249H20V15.5249Z" fill="#11ED83" />
          <path d="M20 10.5249H25V15.5249H20V10.5249Z" fill="#11ED83" />
          <path d="M25 15.5249H30V20.5249H25V15.5249Z" fill="#11ED83" />
          <path d="M30 15.5249H35V20.5249H30V15.5249Z" fill="#11ED83" />
          <path d="M20 35.5249H25V40.5249H20V35.5249Z" fill="#11ED83" />
          <path d="M35 35.5249H40V40.5249H35V35.5249Z" fill="#11ED83" />
          <path d="M10 30.5249H15V35.5249H10V30.5249Z" fill="#11ED83" />
          <path d="M45 35.5249H50V40.5249H45V35.5249Z" fill="#11ED83" />
          <path d="M45 30.5249H50V35.5249H45V30.5249Z" fill="#11ED83" />
          <path d="M10 35.5249H15V40.5249H10V35.5249Z" fill="#11ED83" />
          <path d="M25 45.5249H30V50.5249H25V45.5249Z" fill="#11ED83" />
          <path d="M25 40.5249H30V45.5249H25V40.5249Z" fill="#11ED83" />
          <path d="M30 45.5249H35V50.5249H30V45.5249Z" fill="#11ED83" />
          <path d="M30 40.5249H35V45.5249H30V40.5249Z" fill="#11ED83" />
          <path d="M25 25.5249H30V30.5249H25V25.5249Z" fill="#11ED83" />
          <path d="M30 25.5249H35V30.5249H30V25.5249Z" fill="#11ED83" />
          <path d="M35 15.5249H40V20.5249H35V15.5249Z" fill="#11ED83" />
          <path d="M35 10.5249H40V15.5249H35V10.5249Z" fill="#11ED83" />
          <path d="M20 20.5249H25V25.5249H20V20.5249Z" fill="#11ED83" />
          <path d="M35 20.5249H40V25.5249H35V20.5249Z" fill="#11ED83" />
          <path d="M40 15.5249H45V20.5249H40V15.5249Z" fill="#11ED83" />
        </g>
      );
      break;
    // Yellow color
    case "yellow":
      path = hasCrown ? (
        <g>
          <path d="M15 15.0249H20V20.0249H15V15.0249Z" fill="#FBCB4A" />
          <path d="M20 15.0249H25V20.0249H20V15.0249Z" fill="#FBCB4A" />
          <path d="M20 10.0249H25V15.0249H20V10.0249Z" fill="#FBCB4A" />
          <path d="M25 15.0249H30V20.0249H25V15.0249Z" fill="#FBCB4A" />
          <path d="M30 15.0249H35V20.0249H30V15.0249Z" fill="#FBCB4A" />
          <path d="M20 35.0249H25V40.0249H20V35.0249Z" fill="#FBCB4A" />
          <path d="M35 35.0249H40V40.0249H35V35.0249Z" fill="#FBCB4A" />
          <path d="M10 30.0249H15V35.0249H10V30.0249Z" fill="#FBCB4A" />
          <path d="M45 35.0249H50V40.0249H45V35.0249Z" fill="#FBCB4A" />
          <path d="M45 30.0249H50V35.0249H45V30.0249Z" fill="#FBCB4A" />
          <path d="M10 35.0249H15V40.0249H10V35.0249Z" fill="#FBCB4A" />
          <path d="M25 45.0249H30V50.0249H25V45.0249Z" fill="#FBCB4A" />
          <path d="M25 40.0249H30V45.0249H25V40.0249Z" fill="#FBCB4A" />
          <path d="M30 45.0249H35V50.0249H30V45.0249Z" fill="#FBCB4A" />
          <path d="M30 40.0249H35V45.0249H30V40.0249Z" fill="#FBCB4A" />
          <path d="M25 25.0249H30V30.0249H25V25.0249Z" fill="#FBCB4A" />
          <path d="M30 25.0249H35V30.0249H30V25.0249Z" fill="#FBCB4A" />
          <path d="M35 15.0249H40V20.0249H35V15.0249Z" fill="#FBCB4A" />
          <path d="M35 10.0249H40V15.0249H35V10.0249Z" fill="#FBCB4A" />
          <path d="M20 20.0249H25V25.0249H20V20.0249Z" fill="#FBCB4A" />
          <path d="M35 20.0249H40V25.0249H35V20.0249Z" fill="#FBCB4A" />
          <path d="M40 15.0249H45V20.0249H40V15.0249Z" fill="#FBCB4A" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.475 5.0249H47.525V25.0249H12.475V5.0249ZM42.5093 10.0324H37.5136V15.0299H32.4979V10.0324H27.5021V15.0299H22.4864V10.0324H17.4907V20.0174H42.5093V10.0324Z"
            fill="#172217"
          />
          <path
            d="M22.5029 10.0225H17.4885V20.0275H42.5206V10.0225H37.5062V15.02H32.5118V10.0225H27.4973V15.02H22.5029V10.0225Z"
            fill="#FBCB4A"
          />
        </g>
      ) : (
        <g>
          <path d="M15 15.5249H20V20.5249H15V15.5249Z" fill="#FBCB4A" />
          <path d="M20 15.5249H25V20.5249H20V15.5249Z" fill="#FBCB4A" />
          <path d="M20 10.5249H25V15.5249H20V10.5249Z" fill="#FBCB4A" />
          <path d="M25 15.5249H30V20.5249H25V15.5249Z" fill="#FBCB4A" />
          <path d="M30 15.5249H35V20.5249H30V15.5249Z" fill="#FBCB4A" />
          <path d="M20 35.5249H25V40.5249H20V35.5249Z" fill="#FBCB4A" />
          <path d="M35 35.5249H40V40.5249H35V35.5249Z" fill="#FBCB4A" />
          <path d="M10 30.5249H15V35.5249H10V30.5249Z" fill="#FBCB4A" />
          <path d="M45 35.5249H50V40.5249H45V35.5249Z" fill="#FBCB4A" />
          <path d="M45 30.5249H50V35.5249H45V30.5249Z" fill="#FBCB4A" />
          <path d="M10 35.5249H15V40.5249H10V35.5249Z" fill="#FBCB4A" />
          <path d="M25 45.5249H30V50.5249H25V45.5249Z" fill="#FBCB4A" />
          <path d="M25 40.5249H30V45.5249H25V40.5249Z" fill="#FBCB4A" />
          <path d="M30 45.5249H35V50.5249H30V45.5249Z" fill="#FBCB4A" />
          <path d="M30 40.5249H35V45.5249H30V40.5249Z" fill="#FBCB4A" />
          <path d="M25 25.5249H30V30.5249H25V25.5249Z" fill="#FBCB4A" />
          <path d="M30 25.5249H35V30.5249H30V25.5249Z" fill="#FBCB4A" />
          <path d="M35 15.5249H40V20.5249H35V15.5249Z" fill="#FBCB4A" />
          <path d="M35 10.5249H40V15.5249H35V10.5249Z" fill="#FBCB4A" />
          <path d="M20 20.5249H25V25.5249H20V20.5249Z" fill="#FBCB4A" />
          <path d="M35 20.5249H40V25.5249H35V20.5249Z" fill="#FBCB4A" />
          <path d="M40 15.5249H45V20.5249H40V15.5249Z" fill="#FBCB4A" />
        </g>
      );
      break;
  }
  return path;
};
