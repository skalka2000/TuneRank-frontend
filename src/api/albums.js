const API_BASE = process.env.REACT_APP_API_BASE;

export async function fetchAlbums(userId) {
  const res = await fetch(
    `${API_BASE}/albums?user_id=${userId}`
  );

  if (!res.ok) throw new Error("Failed to fetch albums");
  return res.json();
}

export async function fetchAlbumById(id, userId) {
  const res = await fetch(
    `${API_BASE}/albums/${id}?user_id=${userId}`
  );

  if (!res.ok) throw new Error("Album not found");
  return res.json();
}

export async function addAlbum(album, userId) {
  const res = await fetch(`${API_BASE}/albums`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...album,
      user_id: userId
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to add album");
  }

  return res.json();
}

export async function deleteAlbum(id, userId) {
  const res = await fetch(
    `${API_BASE}/albums/${id}?user_id=${userId}`,
    { method: "DELETE" }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to delete album");
  }
}

export async function updateAlbum(id, albumData, userId) {
  const res = await fetch(
    `${API_BASE}/albums/${id}?user_id=${userId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...albumData,
        user_id: userId
      }),
    }
  );

  if (!res.ok) throw new Error("Failed to update album");
  return res.json();
}

export async function updateAlbumField(id, field, value, userId) {
  return updateAlbum(id, { [field]: value }, userId);
}