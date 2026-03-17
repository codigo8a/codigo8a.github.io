import React, { createContext, useContext, ReactNode } from 'react';

interface WindowContextType {
  id: string;
  onClose: () => void;
}

const WindowContext = createContext<WindowContextType | null>(null);

export const WindowProvider: React.FC<{ children: ReactNode; id: string; onClose: () => void }> = ({ children, id, onClose }) => {
  return (
    <WindowContext.Provider value={{ id, onClose }}>
      {children}
    </WindowContext.Provider>
  );
};

export const useWindow = () => {
  const context = useContext(WindowContext);
  return context;
};
