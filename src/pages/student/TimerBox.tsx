import React, { useState, useEffect, useMemo } from 'react';

type TimerBoxProps = {
  durationSec: number;
  finished?: boolean;
  onFinish?: () => void;
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export const TimerBox: React.FC<TimerBoxProps> = ({ durationSec, finished, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(durationSec);
  const [timeIsOver, setTimeIsOver] = useState(false);

  const spentSec = durationSec - timeLeft;
  const formattedTime = useMemo(() => formatTime(timeLeft), [timeLeft]);

  useEffect(() => {
    if (finished || timeIsOver) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeIsOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [finished, timeIsOver]);

  useEffect(() => {
    if (!timeIsOver) return;
    onFinish?.();
  }, [timeIsOver, onFinish]);

  return (
    <div className="timer-box">
      <div className="label">
        {finished ? "Время выполнения:" : "Осталось времени:"}
      </div>
      <div className="time">
        {finished ? formatTime(spentSec) : formattedTime}
      </div>
    </div>
  );
};
