import React from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import './Loading.css';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const Loading: React.FC<LoadingProps> = ({ 
  fullScreen = false, 
  message = 'Cargando...', 
  size = 'medium' 
}) => {
  const containerClass = fullScreen 
    ? 'loading-container fullscreen' 
    : 'loading-container';
  
  const spinnerClass = `loading-spinner ${size}`;
  
  return (
    <div className={containerClass}>
      <div className="spinner-wrapper">
        <BiLoaderAlt className={spinnerClass} />
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default Loading;