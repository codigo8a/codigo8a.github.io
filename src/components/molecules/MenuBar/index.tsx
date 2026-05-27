import React, { useState, useRef, useEffect, useCallback } from 'react';
import './index.css';

export interface MenuItem {
  label?: string;
  shortcut?: string;
  enabled?: boolean;
  checked?: boolean;
  separator?: boolean;
  action?: () => void;
  submenu?: MenuItem[];
}

export interface MenuDefinition {
  [key: string]: MenuItem[];
}

interface MenuBarProps {
  menus: MenuDefinition;
  onClose?: () => void;
  inactive?: boolean;
}

export const MenuBar: React.FC<MenuBarProps> = ({ menus, onClose, inactive = false }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeMenu = useCallback(() => {
    setActiveMenu(null);
    setActiveSubmenu(null);
    setHoveredMenu(null);
    onClose?.();
  }, [onClose]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    if (activeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [activeMenu, closeMenu]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeMenu) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        if (activeSubmenu !== null) {
          setActiveSubmenu(null);
        } else {
          closeMenu();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeMenu, activeSubmenu, closeMenu]);

  const handleMenuClick = (menuName: string) => {
    if (activeMenu === menuName) {
      closeMenu();
    } else {
      setActiveMenu(menuName);
      setActiveSubmenu(null);
      setHoveredMenu(menuName);
    }
  };

  const handleMenuHover = (menuName: string) => {
    setHoveredMenu(menuName);
    if (activeMenu && activeMenu !== menuName) {
      setActiveMenu(menuName);
      setActiveSubmenu(null);
    }
  };

  const handleMenuLeave = () => {
    setHoveredMenu(null);
  };

  const handleItemHover = (item: MenuItem, index: number) => {
    if (!activeMenu) return;
    if (item.separator || item.enabled === false) return;

    if (item.submenu && item.submenu.length > 0) {
      setActiveSubmenu(index);
    } else {
      setActiveSubmenu(null);
    }
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.enabled === false) return;
    if (item.submenu && item.submenu.length > 0) return;
    item.action?.();
    closeMenu();
  };

  const handleSubmenuEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleDropdownLeave = () => {
    if (activeSubmenu !== null) {
      closeTimerRef.current = setTimeout(() => {
        setActiveSubmenu(null);
      }, 300);
    }
  };

  const renderLabel = (label: string) => {
    const ampIndex = label.indexOf('&');
    if (ampIndex === -1 || ampIndex === label.length - 1) {
      return <>{label.replace(/&&/g, '&')}</>;
    }

    const before = label.substring(0, ampIndex);
    const hotKey = label.charAt(ampIndex + 1);
    const after = label.substring(ampIndex + 2);

    return (
      <>
        {before.replace(/&&/g, '&')}
        <span className="hotkey">{hotKey}</span>
        {after.replace(/&&/g, '&')}
      </>
    );
  };

  const renderMenuItem = (item: MenuItem, index: number) => {
    if (item.separator) {
      return <div key={index} className="menu-separator" />;
    }

    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isDisabled = item.enabled === false;
    const isSubmenuOpen = activeSubmenu === index;

    return (
      <div
        key={index}
        className={`menu-item ${isDisabled ? 'disabled' : ''} ${isSubmenuOpen ? 'highlight' : ''}`}
        onClick={() => handleItemClick(item)}
        onMouseEnter={() => handleItemHover(item, index)}
      >
        <div className="menu-item-content">
          <span className="menu-item-label">
            {renderLabel(item.label || '')}
          </span>
          {item.shortcut && <span className="menu-item-shortcut">{item.shortcut}</span>}
          {hasSubmenu && <span className="menu-item-arrow">▶</span>}
        </div>
        {hasSubmenu && isSubmenuOpen && (
          <div className="submenu" onMouseEnter={handleSubmenuEnter} onMouseLeave={handleSubmenuEnter}>
            {item.submenu!.map((subItem, subIndex) => renderMenuItem(subItem, subIndex))}
          </div>
        )}
      </div>
    );
  };

  // Determine if a button should show highlight
  const isButtonHighlighted = (menuName: string) => {
    if (inactive) return false;
    return activeMenu === menuName || hoveredMenu === menuName;
  };

  return (
    <div
      className={`menu-bar ${inactive ? 'inactive' : ''}`}
      ref={menuBarRef}
      onMouseLeave={handleMenuLeave}
    >
      {Object.entries(menus).map(([menuName, items]) => {
        const isOpen = activeMenu === menuName;
        const highlighted = isButtonHighlighted(menuName);
        const buttonClass = highlighted
          ? `menu-button highlight${isOpen ? ' active' : ''}`
          : 'menu-button';

        return (
          <div key={menuName} className="menu-container">
            <button
              className={buttonClass}
              onClick={() => handleMenuClick(menuName)}
              onMouseEnter={() => handleMenuHover(menuName)}
              tabIndex={-1}
            >
              <span>{renderLabel(menuName)}</span>
            </button>
            {isOpen && (
              <div className="menu-dropdown" onMouseLeave={handleDropdownLeave}>
                {items.map((item, index) => renderMenuItem(item, index))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
