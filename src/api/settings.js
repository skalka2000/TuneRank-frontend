const API_BASE = process.env.REACT_APP_API_BASE;

export async function getUserSettings(userId) {
  const res = await fetch(
    `${API_BASE}/user-settings?user_id=${userId}`
  );

  if (!res.ok) throw new Error("Failed to load user settings");
  return res.json();
}

export async function saveUserSettings(settings, userId) {
  const res = await fetch(
    `${API_BASE}/user-settings?user_id=${userId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...settings,
        user_id: userId
      }),
    }
  );

  if (!res.ok) throw new Error("Failed to save settings");

  return res.json();
}
