import { useCallback, useEffect, useState } from "react";

export const konamiSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export const starkpimpSequence = ["s", "t", "a", "r", "k", "p", "i", "m", "p"];
export const psySequence = ["p", "s", "y"];

const useKonamiCode = (codeSequence = konamiSequence, callback = () => {}) => {
  const [isRightSequence, setIsRightSequence] = useState(false);
  const [sequence, setSequence] = useState<string[]>(new Array());

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => setSequence([...sequence, event.key]),
    [setSequence, sequence],
  );

  useEffect(() => {
    sequence.forEach((key, i) => {
      if (key !== codeSequence[i]) {
        setSequence([]);
      }
    });

    if (!isRightSequence && sequence.toString() === codeSequence.toString()) {
      setIsRightSequence(true);
      callback();
    }
  }, [sequence, callback, codeSequence, isRightSequence]);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  return { sequence, setSequence, isRightSequence, setIsRightSequence };
};

export default useKonamiCode;
