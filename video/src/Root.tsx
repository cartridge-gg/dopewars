import { Composition } from "remotion";
import { DopeWarsShowcase } from "./DopeWarsShowcase";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DopeWarsShowcase"
      component={DopeWarsShowcase}
      durationInFrames={450}
      fps={30}
      width={390}
      height={844}
    />
  );
};
