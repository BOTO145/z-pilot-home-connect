interface GpioResult {
  success: boolean;
  device: string;
  pin: string;
  state: string;
}

const GpioCard = ({ result }: { result: GpioResult }) => (
  <div className="gpio-card">
    <span className="icon">⚡</span>
    <span className={`dot ${result.state === 'OFF' ? 'off' : ''}`} />
    <span>{result.device} · {result.pin} · {result.state}</span>
  </div>
);

export default GpioCard;
