import { useState, useCallback } from 'react';
import IdleScreen from './screens/IdleScreen';
import CallingScreen from './screens/CallingScreen';
import EndedScreen from './screens/EndedScreen';
import './index.css';

type Screen = 'idle' | 'calling' | 'ended';

const App = () => {
  const [screen, setScreen] = useState<Screen>('idle');
  const [callStart, setCallStart] = useState<Date>(new Date());

  const handleCallStart = useCallback(() => {
    setCallStart(new Date());
    setScreen('calling');
  }, []);

  const handleHangUp = useCallback(() => {
    setScreen('ended');
  }, []);

  const handleReset = useCallback(() => {
    setScreen('idle');
  }, []);

  return (
    <>
      {screen === 'idle' && <IdleScreen onCallStart={handleCallStart} />}
      {screen === 'calling' && <CallingScreen callStart={callStart} onHangUp={handleHangUp} />}
      {screen === 'ended' && <EndedScreen callStart={callStart} onReset={handleReset} />}
    </>
  );
};

export default App;
