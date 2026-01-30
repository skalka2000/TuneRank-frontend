import React, { useEffect, useState } from "react";
import { fetchAlbums, deleteAlbum } from "../api/albums";
import { Link } from "react-router-dom";
import AlbumTable from "../components/AlbumTable";

function Albums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDeleteAlbum = async (id) => {
    try {
      await deleteAlbum(id);
      setAlbums((prev) => prev.filter((album) => album.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAlbums()
      .then(setAlbums)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading albums...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", marginTop: "1rem" }}>
            <h2 style={{ margin: 0 }}>Albums</h2>
            <Link to="/albums/add">
                <button className="button">Add Album</button>
            </Link>
        </div>
      <AlbumTable albums={albums} onDelete={handleDeleteAlbum} setAlbums={setAlbums}/>
    </div>
  );
}

export default Albums;
