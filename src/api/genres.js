const API_BASE = process.env.REACT_APP_API_BASE;

export async function fetchGenres(userId) {
  const res = await fetch(
    `${API_BASE}/genres?user_id=${userId}`
  );

  if (!res.ok) throw new Error("Failed to fetch genres");
  return res.json();
}

export async function createGenre(userId, name) {
  const res = await fetch(
    `${API_BASE}/genres?user_id=${userId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    }
  );

  if (!res.ok) throw new Error("Failed to create genre");
  return res.json();
}

export async function deleteGenre(userId, genreId) {
  const res = await fetch(
    `${API_BASE}/genres/${genreId}?user_id=${userId}`,
    {
      method: "DELETE"
    }
  );

  if (!res.ok) throw new Error("Failed to delete genre");
}

export async function attachGenre(userId, albumId, genreId) {
  const res = await fetch(
    `${API_BASE}/albums/${albumId}/genres/${genreId}?user_id=${userId}`,
    { method: "POST" }
  );

  if (!res.ok) {
    throw new Error("Failed to attach genre");
  }

  return res.json();
}

export async function detachGenre(userId, albumId, genreId) {
  const res = await fetch(
    `${API_BASE}/albums/${albumId}/genres/${genreId}?user_id=${userId}`,
    { method: "DELETE" }
  );

  if (!res.ok) {
    throw new Error("Failed to detach genre");
  }

  return res.json();
}
