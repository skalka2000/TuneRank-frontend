const API_BASE = process.env.REACT_APP_API_BASE;

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

export async function addSongToAlbum(albumId, songData) {
  const res = await fetch(`${API_BASE}/albums/${albumId}/songs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(songData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to add song");
  }

  return res.json();
}

export async function updateSongField(id, field, value) {
  const res = await fetch(`${API_BASE}/songs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [field]: value }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to update song");
  }
  return res.json();
}

export async function deleteSong(songId) {
  const res = await fetch(`${API_BASE}/songs/${songId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to delete song");
  }
}
