const API_BASE = "http://localhost:8000";

export async function fetchAlbums() {
  const res = await fetch(`${API_BASE}/albums`);
  if (!res.ok) throw new Error("Failed to fetch albums");
  return res.json();
}
export async function fetchAlbumById(id) {
  const res = await fetch(`http://localhost:8000/albums/${id}`);
  if (!res.ok) throw new Error("Album not found");
  return res.json();
}

