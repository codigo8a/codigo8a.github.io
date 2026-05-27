import React from 'react';
import './index.css';
import { WindowControls } from '../WindowControls';

interface TitleBarProps {
  title: string;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  active?: boolean;
  icon?: string;
}

export const TitleBar: React.FC<TitleBarProps> = ({ 
  title, 
  onMinimize, 
  onMaximize, 
  onClose, 
  active = true,
  icon
}) => {
  return (
    <div className={`title-bar ${active ? 'active' : 'inactive'}`}>
      {icon && <img src={icon} alt="" className="title-bar-icon" />}
      <div className="title-bar-text">{title}</div>
      <WindowControls 
        onMinimize={onMinimize} 
        onMaximize={onMaximize} 
        onClose={onClose} 
      />
    </div>
  );
};
