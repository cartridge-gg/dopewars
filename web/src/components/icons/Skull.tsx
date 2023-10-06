import { Icon, IconProps } from ".";
import { AvatarPathProps } from "@/components/avatar/Avatar";

export const Skull = ({
  hasCrown,
  color,
  ...props
}: IconProps & AvatarPathProps) => {
  return (
    <Icon {...props}>
      <>
        <path
          d="M28.5001 13.5V11.9998H27.0002V10.4999H25.5003V9H10.5V10.4999H9.00007V11.9998H7.50016V13.4997L6 13.5V20.9995H7.49991V23.9993H8.99981V25.4992H10.4997V29.9989H13.4995V26.9991H16.4993V29.9989H19.4992V26.9991H22.499V29.9989H25.4988V25.4992H26.9987V23.9993H28.4986V20.9995H29.9985V16.4998L30 14.9999V13.5L28.5001 13.5ZM25.5003 20.9995H22.5005V19.4996H21.0006V16.4998H25.5003V20.9995ZM16.5004 23.9996V20.9998H19.5002V23.9996H16.5004ZM10.5002 19.4996V16.4998H14.9999V19.4996H13.5003V20.9995H10.5002V19.4996Z"
          fill={color === "green" ? "#0FD976" : "#FBCB4A"}
        />
        {hasCrown && (
          <>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9 3H30.03V15H9V3ZM27.0206 6.0045H24.0232V9.003H21.0137V6.0045H18.0163V9.003H15.0069V6.0045H12.0094V11.9955H27.0206V6.0045Z"
              fill="#172217"
            />
            <path
              d="M15.0168 5.99854H12.0082V12.0015H27.0274V5.99854H24.0188V8.99704H21.0221V5.99854H18.0135V8.99704H15.0168V5.99854Z"
              fill={color === "green" ? "#11ED83" : "#FBCB4A"}
            />
          </>
        )}
      </>
    </Icon>
  );
};
