import { createContext, useContext, useState, useEffect } from "react";
import { getUserSettings, saveUserSettings } from "../api/settings";

const UserSettingsContext = createContext();

export function UserSettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserSettings()
      .then((loaded) => {
        setSettings(loaded);
        setDraft(loaded); // start with synced values
      })
      .catch((e) => console.error("Failed to load settings", e))
      .finally(() => setLoading(false));
  }, []);

  const saveSettings = async () => {
    const updated = await saveUserSettings(draft);
    setSettings(updated);
    setDraft(updated);
  };

  return (
    <UserSettingsContext.Provider value={{
      settings,
      draft,
      setDraft,
      saveSettings,
      loading
    }}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings() {
  return useContext(UserSettingsContext);
}
