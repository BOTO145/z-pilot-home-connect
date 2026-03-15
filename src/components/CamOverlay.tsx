import { useRef } from 'react';

interface CamOverlayProps {
  stream: { url: string; label: string };
  onClose: () => void;
}

const CamOverlay = ({ stream, onClose }: CamOverlayProps) => {
  const imgRef = useRef<HTMLImageElement>(null);

  function closeCam() {
    if (imgRef.current) imgRef.current.src = '';
    onClose();
  }

  return (
    <div className="cam-overlay">
      <div className="cam-header">
        <span className="cam-title">Live View: {stream.label}</span>
        <button className="cam-close" onClick={closeCam}>✕</button>
      </div>
      <div className="cam-body">
        <img
          ref={imgRef}
          src={stream.url}
          crossOrigin="anonymous"
          onError={closeCam}
          alt={`Live feed: ${stream.label}`}
          style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }}
        />
      </div>
      <div className="cam-footer">
        <span className="live-badge">
          <span className="live-dot" />
          ▶ LIVE
        </span>
        <span>⇌ Streaming</span>
      </div>
    </div>
  );
};

export default CamOverlay;
