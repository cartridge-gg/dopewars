import React, { useEffect, useState } from "react";

interface TimerProps {
  startInSeconds: number;
  onStart?: () => void;
  onEnd?: () => void;
}

export const Timer: React.FC<TimerProps> = ({ startInSeconds, onStart, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState(startInSeconds);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (started && onEnd) {
        onEnd();
      }
      return;
    }

    if (!started) {
      setStarted(true);
      if (onStart) {
        onStart();
      }
    }

    const interval = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timeLeft, started, onStart, onEnd]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours ? `${hours}h ` : ""}${minutes ? `${minutes}m ` : ""}${remainingSeconds}s`;
  };

  return (
    <div>
      {timeLeft > 0 ? (
        <div className="flex">
          <span className="text-[#878E8E]">Starts in&nbsp;</span>
          <span className="text-[#22B617]">{formatTime(timeLeft)}</span>
        </div>
      ) : (
        <span className="text-[#22B617]">Started</span>
      )}
    </div>
  );
};
