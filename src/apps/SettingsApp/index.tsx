import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useWindow } from '../../context/WindowContext';
import { useTranslation } from '../../i18n/translations';
import { useDesktop, WALLPAPERS, WallpaperId } from '../../context/DesktopContext';
import './index.css';

export const SettingsApp: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const { wallpaper, setWallpaper } = useDesktop();
  const windowContext = useWindow();
  const onClose = windowContext?.onClose;
  const { t } = useTranslation();
  
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperId>(wallpaper);

  const handleApply = () => {
    changeLanguage(selectedLanguage);
    setWallpaper(selectedWallpaper);
    onClose?.();
  };

  const handleCancel = () => {
    onClose?.();
  };

  return (
    <div className="settings-container">
      <div className="settings-content">
        <fieldset className="settings-section">
          <legend>{t('language')}</legend>
          <div className="settings-language-row">
            <label className="settings-language-label">
              {t('selectLanguage')}:
            </label>
            <div className="field-row">
              <select 
                className="settings-language-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset className="settings-section">
          <legend>{t('desktop')}</legend>
          <div className="settings-wallpaper-section">
            <label className="settings-wallpaper-label">
              {t('wallpaper')}:
            </label>
            <div className="settings-wallpaper-grid">
              {WALLPAPERS.map((wp) => (
                <div
                  key={wp.id}
                  className={`settings-wallpaper-item ${selectedWallpaper === wp.id ? 'selected' : ''}`}
                  onClick={() => setSelectedWallpaper(wp.id)}
                >
                  <div 
                    className="settings-wallpaper-preview"
                    style={{ backgroundImage: `url(${wp.path})` }}
                  />
                  <span className="settings-wallpaper-name">{wp.name}</span>
                </div>
              ))}
            </div>
          </div>
        </fieldset>

        <div className="settings-info">
          {selectedLanguage === 'es' 
            ? 'Los cambios se aplicarán inmediatamente al hacer clic en Aceptar.'
            : 'Changes will be applied immediately after clicking Apply.'}
        </div>
      </div>

      <div className="settings-footer">
        <button 
          className="settings-button"
          onClick={handleApply}
        >
          {t('apply')}
        </button>
        <button 
          className="settings-button"
          onClick={handleCancel}
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  );
};
