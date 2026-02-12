const API_BASE = process.env.REACT_APP_API_BASE;

export async function fetchSongs(userId, filters = {}) {
  const url = new URL(`${API_BASE}/songs`);

  // Always include user_id
  url.searchParams.append("user_id", userId);

  // Append optional filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
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

export async function addSongToAlbum(albumId, songData, userId) {
  const res = await fetch(
    `${API_BASE}/albums/${albumId}/songs?user_id=${userId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...songData,
        user_id: userId,
      }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to add song");
  }

  return res.json();
}

export async function updateSongField(songId, field, value, userId) {
  const res = await fetch(
    `${API_BASE}/songs/${songId}?user_id=${userId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [field]: value,
        user_id: userId,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to update song");
  }

  return res.json();
}

export async function deleteSong(songId, userId) {
  const res = await fetch(
    `${API_BASE}/songs/${songId}?user_id=${userId}`,
    { method: "DELETE" }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to delete song");
  }
}
