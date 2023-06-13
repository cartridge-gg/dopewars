import { Icon, IconProps } from ".";

export interface SoundProps {
  isMuted?: boolean;
}

export const Sound = ({ isMuted, ...props }: SoundProps & IconProps) => {
  return (
    <Icon {...props}>
      <>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.1996 8.69775V10.8794H13.018V13.061H6.47314V23.9713H13.018V26.1529H15.1996V28.3345H21.7467V8.69775H15.1996ZM13.0202 13.0632V15.2448H8.65695V21.7875H13.0202V23.9691H15.2018V26.1507H19.5629V10.8816H15.2018V13.0632H13.0202Z"
        />
        {isMuted ? (
          <path d="M25.9261 19.6059H28.1077V17.4264H25.9261V15.2426H28.1099V17.4242H30.2893V15.2426H32.4731V17.4264H30.2915V19.6059H32.4731V21.7897H30.2893V19.608H28.1099V21.7897H25.9261V19.6059Z" />
        ) : (
          <path d="M28.1077 18.5153H25.9261V22.8807H30.2915V16.3359H32.4731V14.1522H28.1077V18.5153Z" />
        )}
      </>
    </Icon>
  );
};
