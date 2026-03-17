import React from 'react';
import './index.css';
import { WindowControls } from '../WindowControls';

interface TitleBarProps {
  title: string;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  active?: boolean;
}

export const TitleBar: React.FC<TitleBarProps> = ({ 
  title, 
  onMinimize, 
  onMaximize, 
  onClose, 
  active = true 
}) => {
  return (
    <div className={`title-bar ${active ? '' : 'inactive'}`}>
      <div className="title-bar-text">{title}</div>
      <WindowControls 
        onMinimize={onMinimize} 
        onMaximize={onMaximize} 
        onClose={onClose} 
      />
    </div>
  );
};
