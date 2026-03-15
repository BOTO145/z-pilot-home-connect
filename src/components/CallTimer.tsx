import { useState, useEffect } from 'react';

interface CallTimerProps {
  startTime: Date;
}

const CallTimer = ({ startTime }: CallTimerProps) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  return <span className="timer">{mm}:{ss}</span>;
};

export default CallTimer;

export function formatDuration(startTime: Date, endTime: Date = new Date()) {
  const elapsed = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}
