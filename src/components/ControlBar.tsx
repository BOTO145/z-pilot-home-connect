import { useRef } from 'react';

interface ControlBarProps {
  isListening: boolean;
  isMuted: boolean;
  speakerOn: boolean;
  pendingImage: File | null;
  onMicPress: () => void;
  onSpeakerToggle: () => void;
  onImageSelect: (file: File | null) => void;
  onHangUp: () => void;
}

const ControlBar = ({
  isListening, isMuted, speakerOn, pendingImage,
  onMicPress, onSpeakerToggle, onImageSelect, onHangUp
}: ControlBarProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const thumbUrl = pendingImage ? URL.createObjectURL(pendingImage) : null;

  const micClass = isMuted ? 'ctrl-btn muted-btn' : isListening ? 'ctrl-btn active' : 'ctrl-btn';

  return (
    <div className="control-bar">
      {/* Mic */}
      <button className={micClass} onClick={onMicPress}>
        {isListening && <span className="pulse-ring" />}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
          {isMuted && <line x1="2" y1="2" x2="22" y2="22" stroke="var(--red)" strokeWidth="2.5" />}
        </svg>
      </button>

      {/* Speaker */}
      <button className={`ctrl-btn ${!speakerOn ? 'off' : ''}`} onClick={onSpeakerToggle}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          {speakerOn ? (
            <>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </>
          ) : (
            <line x1="23" y1="9" x2="17" y2="15" />
          )}
        </svg>
      </button>

      {/* Image */}
      <button className="ctrl-btn" onClick={() => {
        if (pendingImage) {
          onImageSelect(null);
        } else {
          fileRef.current?.click();
        }
      }}>
        {thumbUrl && (
          <span className="thumb-badge">
            <img src={thumbUrl} alt="pending" />
          </span>
        )}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </button>

      {/* Hang up */}
      <button className="ctrl-btn hangup" onClick={onHangUp}>
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          onImageSelect(file);
          e.target.value = '';
        }}
      />
    </div>
  );
};

export default ControlBar;
