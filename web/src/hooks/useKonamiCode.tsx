import { useEffect, useState } from "react";

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

export default function useKonamiCode(codeSequence = konamiSequence, callback = () => {}) {
  const [isRightSequence, setIsRightSequence] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);

  const onKeyDown = (event: KeyboardEvent) => setSequence([...sequence, event.key]);

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
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return { sequence, setSequence, isRightSequence, setIsRightSequence };
}
