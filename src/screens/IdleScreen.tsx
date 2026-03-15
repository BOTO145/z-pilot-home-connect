import { useState } from 'react';
import ZAvatar from '../components/ZAvatar';
import { healthCheck } from '../hooks/useApi';

interface IdleScreenProps {
  onCallStart: () => void;
}

const BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://andlab.ratfish-miaplacidus.ts.net:8000';
const displayUrl = BASE_URL.replace(/^https?:\/\//, '');

const IdleScreen = ({ onCallStart }: IdleScreenProps) => {
  const [shaking, setShaking] = useState(false);

  const handleCall = async () => {
    try {
      await healthCheck();
      onCallStart();
    } catch {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="screen idle-screen">
      <ZAvatar size="large" />
      <div className="name">Z-Pilot</div>
      <div className="subtitle">AI Assistant</div>
      <button className={`call-btn ${shaking ? 'shaking' : ''}`} onClick={handleCall}>
        <svg viewBox="0 0 24 24" fill="white">
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
        </svg>
      </button>
      <div className="server-url">{displayUrl}</div>
    </div>
  );
};

export default IdleScreen;
