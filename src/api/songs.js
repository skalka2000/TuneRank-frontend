const API_BASE = "http://localhost:8000";

export async function fetchSongs(filters = {}) {
  const url = new URL(`${API_BASE}/songs`);

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      // Handles arrays (e.g. artist_names, album_ids)
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(key, v));
      } else {
        url.searchParams.append(key, value);
      }
    }
  });

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch songs");
  return res.json();
}
