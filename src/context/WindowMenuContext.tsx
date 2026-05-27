import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MenuDefinition } from '../components/molecules/MenuBar';

interface WindowMenuContextType {
  menu: MenuDefinition | null;
  setMenu: (menu: MenuDefinition | null) => void;
}

const WindowMenuContext = createContext<WindowMenuContextType | null>(null);

export const WindowMenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menu, setMenu] = useState<MenuDefinition | null>(null);

  return (
    <WindowMenuContext.Provider value={{ menu, setMenu }}>
      {children}
    </WindowMenuContext.Provider>
  );
};

export const useWindowMenu = () => {
  const context = useContext(WindowMenuContext);
  if (!context) {
    throw new Error('useWindowMenu must be used within WindowMenuProvider');
  }
  return context;
};