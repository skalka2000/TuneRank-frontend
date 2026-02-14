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
    let isMounted = true;
    let retryTimeout;

    const loadSettings = async (retryCount = 0) => {
      try {
        const loaded = await getUserSettings(userId);

        if (!isMounted) return;

        setSettings(loaded);
        setDraft(loaded);
        setLoading(false);
      } catch (e) {
        if (!isMounted) return;

        if (retryCount < 1) {
          retryTimeout = setTimeout(() => {
            loadSettings(retryCount + 1);
          }, 2000);
        } else {
          console.error("Failed to load settings", e);
          setLoading(false);
        }
      }
    };

    setLoading(true);
    loadSettings();

    return () => {
      isMounted = false;
      clearTimeout(retryTimeout);
    };
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
