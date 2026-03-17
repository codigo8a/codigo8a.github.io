import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useWindow } from '../../context/WindowContext';
import { useTranslation } from '../../i18n/translations';
import './index.css';

export const SettingsApp: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const windowContext = useWindow();
  const onClose = windowContext?.onClose;
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleApply = () => {
    changeLanguage(selectedLanguage);
    onClose?.();
  };

  const handleCancel = () => {
    onClose?.();
  };

  return (
    <div className="settings-container">
      <div className="settings-content">
        <div className="settings-language-row">
          <label className="settings-language-label">
            {t('language')}:
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

        <div className="settings-info">
          {selectedLanguage === 'es' 
            ? 'El idioma seleccionado afectará toda la interfaz de usuario.'
            : 'The selected language will affect the entire user interface.'}
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
