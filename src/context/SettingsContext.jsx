// context/SettingsContext.js
import { createContext, useContext, useState } from "react";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [power, setPower] = useState(1.0);
  return (
    <SettingsContext.Provider value={{ power, setPower }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
