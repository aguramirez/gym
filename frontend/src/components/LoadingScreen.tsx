import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
  message?: string;
  timeout?: number;
  onFinish?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Cargando...", 
  timeout = 2000,
  onFinish
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, onFinish]);

  if (!isVisible) return null;

  return (
    <div className="loading-screen">
      <div className="loading-logo">
        <h1>FABIÁN</h1>
        <h2>COACH</h2>
      </div>
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingScreen;