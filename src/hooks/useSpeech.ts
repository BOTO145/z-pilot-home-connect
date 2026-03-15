import { useRef, useState, useCallback } from 'react';

interface UseSpeechOptions {
  onResult?: (text: string) => void;
  onEnd?: (finalText: string) => void;
}

export function useSpeech({ onResult, onEnd }: UseSpeechOptions = {}) {
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [liveText, setLiveText] = useState('');
  const liveTextRef = useRef('');

  const start = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const R = new SpeechRecognition();
    R.continuous = false;
    R.interimResults = true;
    R.lang = 'en-US';

    R.onresult = (e: any) => {
      const text = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      setLiveText(text);
      liveTextRef.current = text;
      onResult?.(text);
    };

    R.onend = () => {
      setIsListening(false);
      const finalText = liveTextRef.current;
      setLiveText('');
      liveTextRef.current = '';
      if (finalText) onEnd?.(finalText);
    };

    R.onerror = () => {
      setIsListening(false);
      setLiveText('');
      liveTextRef.current = '';
    };

    recognitionRef.current = R;
    R.start();
    setIsListening(true);
  }, [onResult, onEnd]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return { isListening, liveText, start, stop };
}
