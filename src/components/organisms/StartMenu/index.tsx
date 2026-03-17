import React, { useState } from "react";
import { APPS } from "../../../apps/apps";
import { useTranslation } from "../../../i18n/translations";
import "./index.css";

interface StartMenuProps {
  onClose: () => void;
  onOpenApp: (appId: string) => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onClose, onOpenApp }) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { t } = useTranslation();

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  return (
    <div className="start-menu" onClick={(e) => e.stopPropagation()}>
      <div className="start-menu-sidebar">
        <span>Desktop</span>
      </div>
      <div className="start-menu-items">
        <div className="menu-item-with-submenu">
          <button onClick={() => toggleSubmenu("programs")}>
            <span className="icon" style={{ marginRight: "8px" }}>
              🗃️
            </span>
            {t("programs" as any)}
            <span style={{ marginLeft: "auto" }}>▶</span>
          </button>
          {openSubmenu === "programs" && (
            <div className="submenu">
              <button
                onClick={() => {
                  onOpenApp("notepad");
                  onClose();
                }}
              >
                <span className="icon" style={{ marginRight: "8px" }}>
                  {APPS.notepad.icon}
                </span>
                {APPS.notepad.title}
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => {
            onOpenApp("search");
            onClose();
          }}
        >
          <span className="icon" style={{ marginRight: "8px" }}>
            🔍
          </span>
          {t("find" as any)}
        </button>
        <button
          onClick={() => {
            onOpenApp("fileExplorer");
            onClose();
          }}
        >
          <span className="icon" style={{ marginRight: "8px" }}>
            {APPS.fileExplorer.icon}
          </span>
          {t("documents" as any)}
        </button>
        <div className="start-menu-divider" />
         <button
          onClick={() => {
            onOpenApp("settings");
            onClose();
          }}
        >
          <span className="icon" style={{ marginRight: "8px" }}>
            ⚙️
          </span>
          {t("settings" as any)}
        </button>
        <button
          onClick={() => {
            onOpenApp("welcome");
            onClose();
          }}
        >
          <span className="icon" style={{ marginRight: "8px" }}>
            {APPS.welcome.icon}
          </span>
          {APPS.welcome.title}
        </button>
        <button disabled>{t("help" as any)}</button>
        <button disabled>{t("run" as any)}...</button>
        <div className="start-menu-divider" />
        <button disabled>{t("shutDown" as any)}...</button>
      </div>
    </div>
  );
};
