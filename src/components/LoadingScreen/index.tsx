import React, { useState, useEffect } from 'react';
import './index.css';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onLoadingComplete, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-container">
        {/* Hourglass Animation */}
        <div className="hourglass-container">
          <svg 
            className="hourglass-svg" 
            viewBox="0 0 60 80" 
            width="60" 
            height="80"
          >
            {/* Hourglass outline */}
            <path
              d="M5,0 L55,0 L55,5 L30,35 L55,75 L55,80 L5,80 L5,75 L30,35 L5,5 Z"
              fill="none"
              stroke="#000"
              strokeWidth="2"
            />
            
            {/* Sand top */}
            <path
              className="sand-top"
              d="M8,3 L52,3 L30,30 Z"
              fill="#c0a060"
            />
            
            {/* Sand falling */}
            <rect
              className="sand-falling"
              x="29"
              y="35"
              width="2"
              height="0"
              fill="#c0a060"
            />
            
            {/* Sand bottom */}
            <path
              className="sand-bottom"
              d="M30,40 L52,77 L8,77 Z"
              fill="#c0a060"
              opacity="0"
            />
          </svg>
        </div>

        {/* Windows 95 style text */}
        <div className="loading-text">
          <p className="loading-title">juandavid.site</p>
          <p className="loading-message">Starting...</p>
        </div>

        {/* Progress bar */}
        <div className="loading-progress-container">
          <div className="loading-progress-bar">
            <div 
              className="loading-progress-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="loading-percentage">{Math.min(Math.round(progress), 100)}%</p>
        </div>

        {/* Copyright text */}
        <p className="loading-copyright">
          Copyright © 1998 juandavid Corp.
        </p>
      </div>
    </div>
  );
};