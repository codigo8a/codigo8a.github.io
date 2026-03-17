import React from 'react';
import './index.css';

interface WindowControlsProps {
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

export const WindowControls: React.FC<WindowControlsProps> = ({ 
  onMinimize, 
  onMaximize, 
  onClose 
}) => {
  return (
    <div className="title-bar-controls">
      <button aria-label="Minimize" onClick={onMinimize} />
      <button aria-label="Maximize" onClick={onMaximize} />
      <button aria-label="Close" onClick={onClose} />
    </div>
  );
};
