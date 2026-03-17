import React, { useState, useEffect, JSX } from 'react';
import { useWindow } from '../../context/WindowContext';
import { useLanguage } from '../../context/LanguageContext';
import { useDesktop } from '../../context/DesktopContext';
import { useFileSystem } from '../../hooks/useFileSystem';
import { useTranslation } from '../../i18n/translations';
import { LOCAL_STORAGE_KEYS } from '../../constants';
import './index.css';

export const WelcomeApp: React.FC = () => {
  const [showAtStartup, setShowAtStartup] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SHOW_WELCOME);
    return saved !== 'false';
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SHOW_WELCOME, String(showAtStartup));
  }, [showAtStartup]);

  const [currentTip, setCurrentTip] = useState(0);
  const windowContext = useWindow();
  const onClose = windowContext?.onClose;
  
  const { language, changeLanguage } = useLanguage();
  const { openApp } = useDesktop();
  const { getRawFileContent } = useFileSystem();
  const { t } = useTranslation();

  const handleOpenResume = () => {
    const content = getRawFileContent('hoja-de-vida.md', 'content');
    openApp('fileViewer', {
      file: {
        name: 'hoja-de-vida',
        content: content,
        folder: 'content',
        date: '01/01/2009'
      },
      windowKey: 'content/hoja-de-vida.md',
      title: 'hoja-de-vida'
    });
  };

  const handleWhatsNew = () => {
    const content = getRawFileContent('features.md', 'content');
    openApp('fileViewer', {
      file: {
        name: 'features',
        content: content,
        folder: 'content',
        date: '17/03/2026'
      },
      windowKey: 'content/features.md',
      title: t('whatsNew')
    });
  };

  const tips: Record<string, (string | JSX.Element)[]> = {
    en: [
      "Full Stack Developer expert in Cloud Process Automation, PaintBall, Softcombat and Roller derby Player, Robotics, Electronics and Technology Lover.",
      <div>
        <p style={{ margin: '0 0 8px 0', fontStyle: 'italic' }}>About me</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div 
            onClick={handleOpenResume}
            style={{ color: '#0000ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >📄 Resume</div>
          <a href="https://www.linkedin.com/in/juandavid8a" target="_blank" rel="noopener noreferrer" style={{ color: '#0000ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>💼 LinkedIn</a>
          <a href="https://www.youtube.com/@JuanDavidOchoa" target="_blank" rel="noopener noreferrer" style={{ color: '#0000ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>▶️ YouTube</a>
          <a href="https://www.instagram.com/zarkito8a" target="_blank" rel="noopener noreferrer" style={{ color: '#0000ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>📷 Instagram</a>
        </div>
      </div>,
      <div>
        <p style={{ margin: '0 0 8px 0', fontStyle: 'italic' }}>Contact Info</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <a href="mailto:juandavid8a@gmail.com" style={{ color: '#0000ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>📧 juandavid8a@gmail.com</a>
          <a href="tel:+573052370311" style={{ color: '#0000ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>📞 (+57) 3052370311</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>📍 Medellín - Colombia</div>
        </div>
      </div>,
      "Available for consulting, mentoring, or hourly freelance work. Let's build something great together!",
    ],
    es: [
      "Desarrollador Full Stack experto en Automatización de Procesos en la Nube, jugador de PaintBall, Softcombat y Roller derby, Gomoso de la Robótica, Electrónica y Tecnología.",
      <div>
        <p style={{ margin: '0 0 8px 0', fontStyle: 'italic' }}>Sobre mí</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div 
            onClick={handleOpenResume}
            style={{ color: '#0000ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >📄 Hoja de vida</div>
          <a href="https://www.linkedin.com/in/juandavid8a" target="_blank" rel="noopener noreferrer" style={{ color: '#0000ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>💼 LinkedIn</a>
          <a href="https://www.youtube.com/@JuanDavidOchoa" target="_blank" rel="noopener noreferrer" style={{ color: '#0000ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>▶️ YouTube</a>
          <a href="https://www.instagram.com/zarkito8a" target="_blank" rel="noopener noreferrer" style={{ color: '#0000ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>📷 Instagram</a>
        </div>
      </div>,
      <div>
        <p style={{ margin: '0 0 8px 0', fontStyle: 'italic' }}>Datos de contacto</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <a href="mailto:juandavid8a@gmail.com" style={{ color: '#0000ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>📧 juandavid8a@gmail.com</a>
          <a href="tel:+573052370311" style={{ color: '#0000ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>📞 (+57) 3052370311</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>📍 Medellín - Colombia</div>
        </div>
      </div>,
      "Disponible para asesorías, mentorías o trabajos por horas. ¡Impulsemos tu proyecto juntos!",
    ]
  };

  const currentTips = language === 'es' ? tips.es : tips.en;

  const handleNextTip = () => {
    setCurrentTip((prev) => (prev + 1) % currentTips.length);
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <div className="welcome-container" style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      background: '#c0c0c0',
      color: '#000',
      fontFamily: '"MS Sans Serif", Arial, sans-serif',
      fontSize: '11px',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <h2 style={{ 
        fontSize: '18px', 
        margin: '0 0 15px 0', 
        fontWeight: 'normal',
        color: '#000'
      }}>
        {t('welcome')}
      </h2>

      <div style={{ 
        display: 'flex', 
        flex: 1,
        gap: '20px'
      }}>
        {/* Column 1: Tips */}
        <div style={{ 
          flex: 1,
          background: '#fff',
          border: '2px inset #ffffff',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          overflowY: 'auto'
        }}>
           <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
             <div style={{ fontSize: '32px' }}>💡</div>
             <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 12px 0', fontWeight: 'bold', fontSize: '13px' }}>{t('didYouKnow')}</p>
                <div style={{ margin: 0, lineHeight: '1.5', fontSize: '12px' }}>
                  {currentTips[currentTip]}
                </div>
             </div>
           </div>
        </div>

        {/* Column 2: Buttons */}
        <div className="welcome-buttons" style={{ 
          width: '140px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '10px' 
        }}>
          <button 
            onClick={handleNextTip}
            style={{
              padding: '6px 12px',
              background: '#c0c0c0',
              border: '2px outset #ffffff',
              boxShadow: '1px 1px 0px #000',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%'
            }}
          >
            {t('nextTip')}
          </button>
          <button 
            onClick={handleWhatsNew}
            style={{
              padding: '6px 12px',
              background: '#c0c0c0',
              border: '2px outset #ffffff',
              boxShadow: '1px 1px 0px #000',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%'
            }}
          >
            {t('whatsNew')}
          </button>
          <button 
            style={{
              padding: '6px 12px',
              background: '#c0c0c0',
              border: '2px outset #ffffff',
              boxShadow: '1px 1px 0px #000',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%'
            }}
          >
            {t('onlineRegistration')}
          </button>
          <button 
            onClick={handleClose}
            style={{
              padding: '6px 12px',
              background: '#c0c0c0',
              border: '2px outset #ffffff',
              boxShadow: '1px 1px 0px #000',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              marginTop: '10px'
            }}
          >
            {t('close')}
          </button>
          
          <fieldset style={{ marginTop: 'auto', padding: '10px' }}>
            <legend>{t('language')}</legend>
            <div className="field-row">
              <input 
                id="lang-en" 
                type="radio" 
                name="language-select" 
                value="en" 
                checked={language === 'en'} 
                onChange={() => changeLanguage('en')}
              />
              <label htmlFor="lang-en">English</label>
            </div>
            <div className="field-row" style={{ marginTop: '4px' }}>
              <input 
                id="lang-es" 
                type="radio" 
                name="language-select" 
                value="es" 
                checked={language === 'es'} 
                onChange={() => changeLanguage('es')}
              />
              <label htmlFor="lang-es">Español</label>
            </div>
          </fieldset>
        </div>
      </div>

      {/* Footer: Checkbox */}
      <div className="welcome-footer" style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}>
        <input 
          type="checkbox" 
          checked={showAtStartup}
          onChange={(e) => setShowAtStartup(e.target.checked)}
          id="startup-check"
          style={{ cursor: 'pointer' }}
        />
        <label htmlFor="startup-check" style={{ cursor: 'pointer' }}>
          {t('showWelcomeScreen')}
        </label>
      </div>
    </div>
  );
};
