import { Icon, IconProps } from ".";

export const Flipflop = (props: IconProps) => {
  return (
    <Icon viewBox="0 0 24 24" {...props} fill="currentColor">
      <>
        <path d="M12.9 8V8.9H11.1V8H12.9Z" />
        <path d="M10.2 9.8V8.9H11.1V9.8H10.2Z" />
        <path d="M9.3 10.7H10.2V9.8H9.3V10.7Z" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.3 11.6V10.7H6.6V9.8H4.8V10.7H3.9V11.6H3V13.4H3.9V14.3H4.8V15.2H6.6V16.1H10.2V17H19.2V16.1H20.1V15.2H21V13.4H20.1V12.5H19.2V11.6H15.6V10.7H14.7V9.8H13.8V8.9H12.9V11.6H12V12.5H11.1V13.4H10.2V14.3H6.6V13.4H4.8V12.5H3.9V11.6H4.8V10.7H6.6V11.6H9.3ZM19.2 12.5V13.4H20.1V14.3H19.2V15.2H16.5V14.3H17.4V12.5H19.2Z"
        />
      </>
    </Icon>
  );
};
