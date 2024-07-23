import { createContext, useContext, useState, ReactNode } from "react";

interface SettingsContextProps {
  showDescriptions: boolean;
  setShowDescriptions: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [showDescriptions, setShowDescriptions] = useState<boolean>(false);

  return (
    <SettingsContext.Provider value={{ showDescriptions, setShowDescriptions }}>{children}</SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
