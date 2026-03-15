import { useState, useCallback } from 'react';
import ZAvatar from '../components/ZAvatar';
import CallTimer from '../components/CallTimer';
import ChatFeed from '../components/ChatFeed';
import CamOverlay from '../components/CamOverlay';
import ControlBar from '../components/ControlBar';
import { useSpeech } from '../hooks/useSpeech';
import { sendChat, camStreamUrl } from '../hooks/useApi';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
  image?: string | null;
  action?: any;
  gpio_result?: any;
}

interface CallingScreenProps {
  callStart: Date;
  onHangUp: () => void;
}

const CallingScreen = ({ callStart, onHangUp }: CallingScreenProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [camStream, setCamStream] = useState<{ url: string; label: string } | null>(null);
  const [pendingImage, setPendingImage] = useState<File | null>(null);

  const handleSpeechEnd = useCallback(async (finalText: string) => {
    if (!finalText.trim()) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text: finalText, image: null };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const data = await sendChat(finalText, pendingImage);
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: 'ai',
        text: data.reply || 'No response.',
        action: data.action || null,
        gpio_result: data.gpio_result || null,
      };
      setMessages(prev => [...prev, aiMsg]);

      if (data.action?.type === 'cam') {
        setCamStream({ url: camStreamUrl(data.action.stream_url), label: data.action.device_id });
      }
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'ai', text: 'Connection error. Try again.', action: null, gpio_result: null
      }]);
    }

    setPendingImage(null);
    setIsLoading(false);
  }, [pendingImage]);

  const { isListening, liveText, start, stop } = useSpeech({ onEnd: handleSpeechEnd });

  const handleMicPress = () => {
    if (isMuted) {
      setIsMuted(false);
      return;
    }
    if (isListening) {
      stop();
    } else {
      start();
    }
  };

  return (
    <div className="screen calling-screen">
      <div className="calling-header">
        <ZAvatar size="small" />
        <div className="name">Z-Pilot</div>
        <div className="subtitle">AI Assistant</div>
        <CallTimer startTime={callStart} />
      </div>

      <ChatFeed messages={messages} isLoading={isLoading} liveText={liveText} />

      {camStream && (
        <CamOverlay stream={camStream} onClose={() => setCamStream(null)} />
      )}

      <ControlBar
        isListening={isListening}
        isMuted={isMuted}
        speakerOn={speakerOn}
        pendingImage={pendingImage}
        onMicPress={handleMicPress}
        onSpeakerToggle={() => setSpeakerOn(p => !p)}
        onImageSelect={setPendingImage}
        onHangUp={onHangUp}
      />
    </div>
  );
};

export default CallingScreen;
