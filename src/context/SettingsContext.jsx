import { createContext, useContext, useState, useEffect } from "react";
import { getUserSettings, saveUserSettings } from "../api/settings";
import { useUserMode } from "../hooks/useUserMode";

const UserSettingsContext = createContext();

export function UserSettingsProvider({ children }) {
  const { userId } = useUserMode();

  const [settings, setSettings] = useState(null);
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getUserSettings(userId)
      .then((loaded) => {
        setSettings(loaded);
        setDraft(loaded);
      })
      .catch((e) => console.error("Failed to load settings", e))
      .finally(() => setLoading(false));

  }, [userId]);

  const saveSettingsHandler = async () => {
    const updated = await saveUserSettings(draft, userId);
    setSettings(updated);
    setDraft(updated);
  };

  return (
    <UserSettingsContext.Provider
      value={{
        settings,
        draft,
        setDraft,
        saveSettings: saveSettingsHandler,
        loading
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings() {
  return useContext(UserSettingsContext);
}
