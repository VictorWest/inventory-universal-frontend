import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  selectedIndustry: string;
  setSelectedIndustry: (industry: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  selectedIndustry: '',
  setSelectedIndustry: () => {},
  companyName: 'Mi-Inventory Pro',
  setCompanyName: () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [companyName, setCompanyName] = useState('Mi-Inventory Pro');

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        selectedIndustry,
        setSelectedIndustry,
        companyName,
        setCompanyName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};