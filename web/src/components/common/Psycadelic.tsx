import { useGameStore } from "@/dojo/hooks";
import useKonamiCode, { psySequence } from "@/hooks/useKonamiCode";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";

export const Psycadelic = observer(() => {
  const { game, gameInfos } = useGameStore();
  const {
    setSequence: setPsySequence,
    isRightSequence: isPsySequence,
    setIsRightSequence: setIsPsySequence,
  } = useKonamiCode(psySequence);

  const interval = 1_600;

  let colorRotate = 0;
  let scale = 1;
  let skewX = 0;
  let skewY = 0;
  let rotate = 0;
  let blur = 0;
  let saturate = 0;
  let invert = 0;

  const oooo = (delay: number) => {
    const body = document.getElementsByTagName("html")[0];

    colorRotate = (colorRotate + Math.ceil(Math.random() * 40)) % 360;
    saturate = 0.5 + Math.random();
    blur = Math.random() * 1.5;
    invert = Math.random() > 0.9 ? 1 : 0;

    scale = 0.9 + Math.cos(Date.now()) / 13;
    skewX = (Math.sin(Date.now()) / 6) * 25;
    skewY = (Math.cos(Date.now()) / 9) * 25;
    rotate = (Math.sin(Date.now()) / 2) * 10;

    body.style.filter = `invert(${invert}) blur(${blur}px) saturate(${saturate}) hue-rotate(${colorRotate}deg)`;
    body.style.transform = `scale(${scale}) skewX(${skewX}deg) skewX(${skewY}deg) rotate(${rotate}deg)`;
    body.style.transition = `all ${delay}ms ease-out`;
  };

  useEffect(() => {
    let handle = undefined;
    const isEndPage = window.location.pathname.includes("/end");

    if (isPsySequence || (game && !gameInfos?.game_over && game?.player.health < 2 && !isEndPage)) {
      oooo(interval);
      handle = setInterval(() => oooo(interval), interval);
    } else {
      handle && clearInterval(handle);
    }

    return () => {
      handle && clearInterval(handle);

      const body = document.getElementsByTagName("html")[0];
      body.style.filter = ``;
      body.style.transform = ``;
      body.style.transition = ``;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPsySequence, game?.player.health]);

  return <></>;
});
