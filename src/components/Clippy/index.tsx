import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from '../../i18n/translations';
import { useLanguage } from '../../context/LanguageContext';
import './index.css';

interface ClippyProps {
  enabled: boolean;
  onClose: () => void;
}

const TIPS = {
  es: [
    "¡Hola! Soy Clippy, tu asistente virtual. ¿Necesitas ayuda con algo?",
    "¿Sabías que puedes arrastrar las ventanas por la barra de título?",
    "Personaliza tu escritorio cambiando el wallpaper en Configuración.",
    "Haz doble clic en los iconos del escritorio para abrir aplicaciones.",
    "Usa el buscador (Find) para encontrar archivos por nombre o contenido.",
    "Las ventanas tienen animaciones suaves al abrirse, cerrarse y minimizarse.",
    "Cambia el idioma completo entre Español e Inglés desde Configuración.",
    "El Explorador de Archivos tiene dos vistas: tabla y árbol de carpetas.",
    "Este portfolio está construido con React 19, TypeScript y Vite.",
    "Maximiza ventanas haciendo doble clic en la barra de título.",
    "Las ventanas recuerdan su posición y tamaño cuando las cierras y reabres.",
    "El Navegador (Browser) te permite visitar sitios web con estilo retro.",
    "Los documentos se abren en un visor con pestañas de Preview y Código.",
    "Puedes hacer clic derecho en el escritorio para más opciones (próximamente).",
    "El menú Start te da acceso rápido a todas las aplicaciones del sistema.",
    "El reloj en la barra de tareas muestra la hora en tiempo real.",
    "Prueba diferentes wallpapers: Teal, Brick, Marble, Ocean, Grid y Purple.",
    "Clippy tiene 20 tips diferentes que aparecen en orden aleatorio.",
    "Si cierras Clippy, puedes reabrirlo desde Configuración o el icono en la barra.",
    "Las apps se pueden minimizar, maximizar, redimensionar y cerrar como en Windows 98.",
  ],
  en: [
    "Hi! I'm Clippy, your virtual assistant. Need help with something?",
    "Did you know you can drag windows around by the title bar?",
    "Customize your desktop by changing the wallpaper in Settings.",
    "Double-click desktop icons to open applications.",
    "Use the search (Find) to locate files by name or content.",
    "Windows have smooth animations when opening, closing, and minimizing.",
    "Switch the entire interface between Spanish and English in Settings.",
    "File Explorer has two views: table and tree folder structure.",
    "This portfolio is built with React 19, TypeScript, and Vite.",
    "Maximize windows by double-clicking the title bar.",
    "Windows remember their position and size when you close and reopen them.",
    "The Browser app lets you visit websites with a retro style.",
    "Documents open in a viewer with Preview and Source code tabs.",
    "Right-click on the desktop for more options (coming soon).",
    "The Start Menu gives you quick access to all system applications.",
    "The clock in the taskbar shows real-time updates every second.",
    "Try different wallpapers: Teal, Brick, Marble, Ocean, Grid, and Purple.",
    "Clippy has 20 different tips that appear in random order.",
    "If you close Clippy, you can reopen it from Settings or the taskbar icon.",
    "Apps can be minimized, maximized, resized, and closed just like Windows 98.",
  ]
};

// Función para mezclar array (Fisher-Yates shuffle)
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const Clippy: React.FC<ClippyProps> = ({ enabled, onClose }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showSpeech, setShowSpeech] = useState(false);
  
  // Guardar el lenguaje actual para detectar cambios
  const [prevLang, setPrevLang] = useState(language);
  const shuffledTipsRef = useRef<string[]>([]);
  
  const allTips = TIPS[language as 'es' | 'en'] || TIPS.en;
  
  // Reiniciar el orden si cambió el idioma
  if (shuffledTipsRef.current.length === 0 || language !== prevLang) {
    setPrevLang(language);
    setCurrentTipIndex(0);
    // El primer tip siempre es el de bienvenida (índice 0)
    const otherTips = allTips.slice(1);
    const shuffledOthers = shuffleArray(otherTips);
    shuffledTipsRef.current = [allTips[0], ...shuffledOthers];
  }

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
      setCurrentTipIndex((prev) => (prev + 1) % shuffledTipsRef.current.length);
      setShowSpeech(true);
    }, 300);
  }, []);

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
          <p>{shuffledTipsRef.current[currentTipIndex]}</p>
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
