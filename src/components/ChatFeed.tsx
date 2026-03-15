import { useEffect, useRef } from 'react';
import GpioCard from './GpioCard';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
  image?: string | null;
  action?: { type: string; device_id?: string; stream_url?: string } | null;
  gpio_result?: { success: boolean; device: string; pin: string; state: string } | null;
}

interface ChatFeedProps {
  messages: Message[];
  isLoading: boolean;
  liveText: string;
}

const ChatFeed = ({ messages, isLoading, liveText }: ChatFeedProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, liveText]);

  return (
    <div className="chat-feed">
      {messages.map((msg) => (
        <div key={msg.id}>
          <div className={`bubble-wrap ${msg.role}`}>
            <div className={`bubble ${msg.role}`}>{msg.text}</div>
          </div>
          {msg.gpio_result && (
            <div className="bubble-wrap ai">
              <GpioCard result={msg.gpio_result} />
            </div>
          )}
        </div>
      ))}

      {liveText && (
        <div className="bubble-wrap user">
          <div className="bubble ghost">{liveText}</div>
        </div>
      )}

      {isLoading && (
        <div className="loading-dots">
          <span /><span /><span />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatFeed;
