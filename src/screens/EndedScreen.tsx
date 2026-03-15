import { useEffect } from 'react';
import { formatDuration } from '../components/CallTimer';

interface EndedScreenProps {
  callStart: Date;
  onReset: () => void;
}

const EndedScreen = ({ callStart, onReset }: EndedScreenProps) => {
  useEffect(() => {
    const t = setTimeout(onReset, 2000);
    return () => clearTimeout(t);
  }, [onReset]);

  return (
    <div className="screen ended-screen">
      <div className="ended-title">Call Ended</div>
      <div className="ended-duration">{formatDuration(callStart)}</div>
    </div>
  );
};

export default EndedScreen;
