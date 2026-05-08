import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useWindow } from '../../context/WindowContext';
import { useTranslation } from '../../i18n/translations';
import { useDesktop, WALLPAPERS, WallpaperId } from '../../context/DesktopContext';
import './index.css';

type TabId = 'general' | 'desktop';

export const SettingsApp: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const { wallpaper, setWallpaper, clippyEnabled, setClippyEnabled } = useDesktop();
  const windowContext = useWindow();
  const onClose = windowContext?.onClose;
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<TabId>('general');
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
      {/* Tabs - Estilo Windows 98 */}
      <menu role="tablist" className="settings-tablist">
        <li
          role="tab"
          aria-selected={activeTab === 'general'}
        >
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('general'); }}>
            {t('general')}
          </a>
        </li>
        <li
          role="tab"
          aria-selected={activeTab === 'desktop'}
        >
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('desktop'); }}>
            {t('desktop')}
          </a>
        </li>
      </menu>

      {/* Tab Panel */}
      <div className="window" role="tabpanel" style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: '0', border: 'none', boxShadow: 'none', overflow: 'hidden' }}>
        <div className="window-body settings-tab-content">
          {/* Tab 1: General - Language & Clippy */}
          {activeTab === 'general' && (
            <div className="settings-panel">
              <fieldset className="settings-section">
                <legend>{t('language')}</legend>
                <div className="settings-language-row">
                  <div className="field-row">
                    <input
                      type="radio"
                      id="lang-en"
                      name="language"
                      value="en"
                      checked={selectedLanguage === 'en'}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                    />
                    <label htmlFor="lang-en">English</label>
                  </div>
                  <div className="field-row">
                    <input
                      type="radio"
                      id="lang-es"
                      name="language"
                      value="es"
                      checked={selectedLanguage === 'es'}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                    />
                    <label htmlFor="lang-es">Español</label>
                  </div>
                </div>
              </fieldset>

              <fieldset className="settings-section">
                <legend>{t('clippy')}</legend>
                <div className="settings-clippy-row">
                  <div className="field-row">
                    <input
                      type="radio"
                      id="clippy-on"
                      name="clippy"
                      checked={clippyEnabled}
                      onChange={() => setClippyEnabled(true)}
                    />
                    <label htmlFor="clippy-on">{t('enable')}</label>
                  </div>
                  <div className="field-row">
                    <input
                      type="radio"
                      id="clippy-off"
                      name="clippy"
                      checked={!clippyEnabled}
                      onChange={() => setClippyEnabled(false)}
                    />
                    <label htmlFor="clippy-off">{t('disable')}</label>
                  </div>
                </div>
              </fieldset>

              <div className="settings-info">
                {selectedLanguage === 'es'
                  ? 'Los cambios se aplicarán al hacer clic en Aceptar.'
                  : 'Changes will be applied after clicking Apply.'}
              </div>
            </div>
          )}

          {/* Tab 2: Desktop - Wallpapers */}
          {activeTab === 'desktop' && (
            <div className="settings-panel">
              <fieldset className="settings-section">
                <legend>{t('wallpaper')}</legend>
                <div className="settings-wallpaper-section">
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
                  ? 'El wallpaper se aplicará al hacer clic en Aceptar.'
                  : 'Wallpaper will be applied after clicking Apply.'}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="settings-footer">
        <button
          className="settings-button"
          type="button"
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
