import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../../i18n/translations';
import { useLanguage } from '../../context/LanguageContext';
import './index.css';

interface ClippyProps {
  enabled: boolean;
  onClose: () => void;
}

const TIPS = {
  es: [
    "¡Parece que estás explorando mi portfolio! ¿Necesitas ayuda?",
    "¿Sabías que puedes arrastrar las ventanas?",
    "Prueba cambiar el wallpaper en Configuración.",
    "Haz doble clic en los iconos del escritorio para abrir apps.",
    "Usa el buscador para encontrar archivos rápidamente.",
    "Las ventanas tienen animaciones al abrirse y cerrarse.",
    "Puedes cambiar el idioma entre Español e Inglés.",
    "El Explorador de Archivos tiene vista de tabla y árbol.",
    "¿Sabías que este portfolio está hecho con React 19?",
    "Puedes maximizar ventanas haciendo doble clic en la barra de título.",
  ],
  en: [
    "Looks like you're exploring my portfolio! Need help?",
    "Did you know you can drag the windows around?",
    "Try changing the wallpaper in Settings.",
    "Double-click desktop icons to open apps.",
    "Use the search to find files quickly.",
    "Windows have animations when opening and closing.",
    "You can switch between Spanish and English.",
    "File Explorer has both table and tree views.",
    "Did you know this portfolio is built with React 19?",
    "You can maximize windows by double-clicking the title bar.",
  ]
};

export const Clippy: React.FC<ClippyProps> = ({ enabled, onClose }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showSpeech, setShowSpeech] = useState(false);

  const tips = TIPS[language as 'es' | 'en'] || TIPS.en;

  // Simple effect: show when enabled, hide when disabled
  useEffect(() => {
    if (enabled) {
      setIsVisible(true);
      const timer = setTimeout(() => setShowSpeech(true), 300);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setShowSpeech(false);
    }
  }, [enabled]);

  const nextTip = useCallback(() => {
    setShowSpeech(false);
    setTimeout(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
      setShowSpeech(true);
    }, 300);
  }, [tips.length]);

  const handleClose = () => {
    setShowSpeech(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`clippy-container visible`}>
      {/* Speech Bubble */}
      <div className={`clippy-speech-bubble ${showSpeech ? 'show' : ''}`}>
        <div className="clippy-speech-content">
          <p>{tips[currentTip]}</p>
          <div className="clippy-actions">
            <button className="clippy-button" onClick={nextTip}>
              {t('nextTip')}
            </button>
            <button className="clippy-button clippy-close" onClick={handleClose}>
              {t('close')}
            </button>
          </div>
        </div>
        <div className="clippy-speech-tail" />
      </div>

      {/* Clippy SVG */}
      <div className="clippy-character">
        <svg
          viewBox="0 0 100 120"
          className="clippy-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Paper clip body */}
          <defs>
            <linearGradient id="clipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e8e8e8" />
              <stop offset="50%" stopColor="#c0c0c0" />
              <stop offset="100%" stopColor="#a0a0a0" />
            </linearGradient>
            <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e0e0e0" />
            </linearGradient>
          </defs>

          {/* Main clip shape */}
          <path
            d="M30 20 
               Q30 5, 50 5 
               Q70 5, 70 25
               L70 85
               Q70 95, 60 95
               Q50 95, 50 85
               L50 35
               Q50 30, 45 30
               Q40 30, 40 35
               L40 90
               Q40 105, 55 105
               Q70 105, 70 90
               L70 100
               Q70 115, 55 115
               Q35 115, 35 95
               L35 25
               Q35 15, 45 15
               Q55 15, 55 25
               L55 85
               Q55 90, 60 90
               Q65 90, 65 85
               L65 25
               Q65 10, 50 10
               Q35 10, 35 25
               Z"
            fill="url(#clipGradient)"
            stroke="#808080"
            strokeWidth="1"
          />

          {/* Shadow/highlight for depth */}
          <path
            d="M32 22
               Q32 12, 45 12
               Q55 12, 55 22
               L55 85
               Q55 92, 62 92"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            opacity="0.6"
          />

          {/* Eyes container */}
          <g transform="translate(35, 50)">
            {/* Left eye */}
            <ellipse cx="8" cy="0" rx="6" ry="8" fill="url(#eyeGradient)" stroke="#666" strokeWidth="1" />
            <ellipse cx="9" cy="0" rx="2" ry="3" fill="#000" />
            <circle cx="10" cy="-1" r="1" fill="#fff" />

            {/* Right eye */}
            <ellipse cx="22" cy="0" rx="6" ry="8" fill="url(#eyeGradient)" stroke="#666" strokeWidth="1" />
            <ellipse cx="23" cy="0" rx="2" ry="3" fill="#000" />
            <circle cx="24" cy="-1" r="1" fill="#fff" />

            {/* Eyebrows */}
            <path d="M2 -12 Q8 -15, 14 -12" fill="none" stroke="#666" strokeWidth="1.5" />
            <path d="M16 -12 Q22 -15, 28 -12" fill="none" stroke="#666" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
};
