import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';

type TimerBoxProps = {
  durationSec: number;
  finished?: boolean;
  onFinish?: () => void;
};

interface ContainerProps {
  $finished: boolean;
  $danger: boolean;
}

const StyledTimerContainer = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease-in-out;

  border: 2px solid ${props => {
    if (props.$finished) return '#e5e7eb';
    if (props.$danger) return '#ffb3b3';
    return '#cfe0ff';
  }};

  color: ${props => {
    if (props.$finished) return '#475569';
    if (props.$danger) return '#e00000';
    return '#1b5de0';
  }};

  .label {
    font-size: 14px;
    margin-bottom: 4px;
  }

  .time {
    font-size: 24px;
  }
`;

function formatTime(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export const TimerBox: React.FC<TimerBoxProps> = ({ durationSec, finished = false, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(durationSec);
  const [timeIsOver, setTimeIsOver] = useState(false);

  const spentSec = durationSec - timeLeft;
  const formattedTime = useMemo(() => formatTime(timeLeft), [timeLeft]);
  const isDanger = timeLeft <= durationSec / 4;

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
    <StyledTimerContainer $finished={finished} $danger={isDanger}>
      <div className="label">
        {finished ? "Время выполнения:" : "Осталось времени:"}
      </div>
      <div className="time">
        {finished ? formatTime(spentSec) : formattedTime}
      </div>
    </StyledTimerContainer>
  );
};
