import React, { useState, useRef, useEffect, useCallback } from "react";
import { APPS } from "../../../apps/apps";
import { useTranslation } from "../../../i18n/translations";
import { useDesktop } from "../../../context/DesktopContext";
import "./index.css";

interface StartMenuProps {
  onClose: () => void;
  onOpenApp: (appId: string) => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onClose, onOpenApp }) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [submenuTop, setSubmenuTop] = useState(0);
  const submenuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const programsRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { launchWinamp } = useDesktop();

  const clearTimer = useCallback(() => {
    if (submenuTimer.current) {
      clearTimeout(submenuTimer.current);
      submenuTimer.current = null;
    }
  }, []);

  const startCloseTimer = useCallback(() => {
    clearTimer();
    submenuTimer.current = setTimeout(() => {
      setOpenSubmenu(null);
    }, 300);
  }, [clearTimer]);

  const openPrograms = useCallback(() => {
    clearTimer();
    setOpenSubmenu("programs");
    // Calculate submenu position relative to .start-menu
    if (programsRef.current && menuRef.current) {
      const triggerRect = programsRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      setSubmenuTop(triggerRect.top - menuRect.top);
    }
  }, [clearTimer]);

  const handleSubmenuLeave = useCallback(() => {
    startCloseTimer();
  }, [startCloseTimer]);

  const handleSubPanelEnter = useCallback(() => {
    clearTimer();
  }, [clearTimer]);

  const handleSubPanelLeave = useCallback(() => {
    startCloseTimer();
  }, [startCloseTimer]);

  const handleItemClick = useCallback((appId: string) => {
    onOpenApp(appId);
    onClose();
  }, [onOpenApp, onClose]);

  useEffect(() => {
    return () => {
      if (submenuTimer.current) clearTimeout(submenuTimer.current);
    };
  }, []);

  const renderAppIcon = (iconPath: string, alt: string) => (
    <span className="icon">
      <img src={iconPath} alt={alt} />
    </span>
  );

  return (
    <div className="start-menu outset-deep" ref={menuRef} onClick={(e) => e.stopPropagation()}>
      <div className="start-menu-sidebar">
        <span>Desktop</span>
      </div>

      <div className="start-menu-items">
        {/* Programs submenu trigger */}
        <div
          className="menu-item-with-submenu"
          ref={programsRef}
          onMouseEnter={openPrograms}
          onMouseLeave={handleSubmenuLeave}
        >
          <button
            className={openSubmenu === "programs" ? "active" : ""}
            onClick={() => setOpenSubmenu(openSubmenu === "programs" ? null : "programs")}
          >
            <span className="icon">
              <img src="/app/icons/folder.svg" alt="Programs" />
            </span>
            {t("programs" as any)}
            <span className="submenu-arrow">▶</span>
          </button>
        </div>

        {/* Search */}
        <button onClick={() => handleItemClick("search")}>
          {renderAppIcon(APPS.search.icon, APPS.search.title)}
          {t("search" as any)}
        </button>

        {/* My Documents */}
        <button onClick={() => handleItemClick("fileExplorer")}>
          {renderAppIcon(APPS.fileExplorer.icon, APPS.fileExplorer.title)}
          {t("documents" as any)}
        </button>

        <div className="start-menu-divider" />

        {/* Settings */}
        <button onClick={() => handleItemClick("settings")}>
          {renderAppIcon(APPS.settings.icon, APPS.settings.title)}
          {t("settings" as any)}
        </button>

        {/* Welcome */}
        <button onClick={() => handleItemClick("welcome")}>
          {renderAppIcon(APPS.welcome.icon, APPS.welcome.title)}
          {APPS.welcome.title}
        </button>

        {/* Help (disabled) */}
        <button disabled>{t("help" as any)}</button>

        {/* Run (disabled) */}
        <button disabled>{t("run" as any)}...</button>

        <div className="start-menu-divider" />

        {/* Shut Down (disabled) */}
        <button disabled>{t("shutDown" as any)}...</button>
      </div>

      {/* Submenu rendered OUTSIDE .start-menu-items to avoid overflow clipping */}
      {openSubmenu === "programs" && (
        <div
          className="submenu"
          style={{ top: submenuTop }}
          onMouseEnter={handleSubPanelEnter}
          onMouseLeave={handleSubPanelLeave}
        >
          <button onClick={() => handleItemClick("iexplorer")}>
            {renderAppIcon(APPS.iexplorer.icon, APPS.iexplorer.title)}
            {APPS.iexplorer.title}
          </button>
          <button onClick={() => handleItemClick("notepad")}>
            {renderAppIcon(APPS.notepad.icon, APPS.notepad.title)}
            {APPS.notepad.title}
          </button>
          <button onClick={() => handleItemClick("soundRecorder")}>
            {renderAppIcon(APPS.soundRecorder.icon, APPS.soundRecorder.title)}
            {APPS.soundRecorder.title}
          </button>
          <button onClick={() => handleItemClick("msdos")}>
            {renderAppIcon(APPS.msdos.icon, APPS.msdos.title)}
            {APPS.msdos.title}
          </button>
          <button onClick={() => { launchWinamp(); onClose(); }}>
            <span className="icon">
              <img src="/app/icons/winamp2-16x16.png" alt="Winamp" width={16} height={16} />
            </span>
            Winamp
          </button>
        </div>
      )}
    </div>
  );
};
