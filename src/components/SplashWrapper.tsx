'use client';

import { useCallback, useEffect, useState } from 'react';
import { SplashScreen } from './SplashScreen';

const SESSION_KEY = 'rehearse_splash_seen';

export function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (!seen) {
      setShowSplash(true);
    }
  }, []);

  const handleDone = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setShowSplash(false);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen onDone={handleDone} />}
      <div style={{ opacity: showSplash ? 0 : 1, transition: 'opacity 0.4s ease-in' }}>
        {children}
      </div>
    </>
  );
}
