interface CamOverlayProps {
  stream: { url: string; label: string };
  onClose: () => void;
}

const CamOverlay = ({ stream, onClose }: CamOverlayProps) => (
  <div className="cam-overlay">
    <div className="cam-header">
      <span className="cam-title">Live View: {stream.label}</span>
      <button className="cam-close" onClick={onClose}>✕</button>
    </div>
    <div className="cam-body">
      <img src={stream.url} alt={`Live feed: ${stream.label}`} />
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

export default CamOverlay;
