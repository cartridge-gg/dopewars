import { Flex, Text } from "@chakra-ui/layout";
import React, { useState, useEffect } from "react";

interface TimerProps {
  startInSeconds: number;
  onStart?: () => void;
  onEnd?: () => void;
}

const Timer: React.FC<TimerProps> = ({ startInSeconds, onStart, onEnd }) => {
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

    return `${hours ? `${hours}h ` : ""}${
      minutes ? `${minutes}m ` : ""
    }${remainingSeconds}s`;
  };

  return (
    <div>
      {timeLeft > 0 ? (
        <Flex>
          <Text color="#878E8E">
            Starts in&nbsp;
          </Text>
          <Text color="#22B617">{formatTime(timeLeft)}</Text>
        </Flex>
      ) : (
        <Text color="#22B617">Started</Text>
      )}
    </div>
  );
};

export default Timer;
