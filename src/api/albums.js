const API_BASE = "http://localhost:8000";

export async function fetchAlbums(power = 1.0, greatnessThreshold = 8.0, scalingFactor = 0.3, steepFactor = 3) {
  const res = await fetch(`${API_BASE}/albums?power=${power}&greatness_threshold=${greatnessThreshold}&scaling_factor=${scalingFactor}&steep_factor=${steepFactor}`);
  if (!res.ok) throw new Error("Failed to fetch albums");
  return res.json();
}

export async function fetchAlbumById(id, power = 1.0, greatnessThreshold = 8.0, scalingFactor = 0.3, steepFactor = 3) {
  const res = await fetch(`${API_BASE}/albums/${id}?power=${power}&greatness_threshold=${greatnessThreshold}&scaling_factor=${scalingFactor}&steep_factor=${steepFactor}`);
  if (!res.ok) throw new Error("Album not found");
  return res.json();
}

export async function addAlbum(album) {
  const res = await fetch(`${API_BASE}/albums`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(album),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to add album");
  }
  return res.json();
}

export async function deleteAlbum(id) {
  const res = await fetch(`${API_BASE}/albums/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to delete album");
  }
}

export async function updateAlbum(id, albumData) {
  const res = await fetch(`${API_BASE}/albums/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(albumData),
  });
  if (!res.ok) throw new Error("Failed to update album");
  return res.json();
}

export async function updateAlbumField(id, field, value) {
  const res = await fetch(`${API_BASE}/albums/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [field]: value }),
  });
  if (!res.ok) throw new Error("Failed to update album");
  return res.json();
}


