import { useGameStore, useRouterContext } from "@/dojo/hooks";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";

const RegisterEntities = observer(() => {
  const { gameId } = useRouterContext();
  const gameStore = useGameStore();

  const [retry, setRetry] = useState(200);

  useEffect(() => {
    const init = async () => {
      try {
        if (gameStore && gameId) {
          await gameStore.init(gameId);
        } else {
          gameStore.reset();
        }
        setRetry(200);
      } catch (e) {
        console.log(e);
        setTimeout(() => {
          setRetry(retry * 2);
        }, retry);
      }
    };

    init();
  }, [gameId, gameStore, retry]);

  return null;
});

export default RegisterEntities;
