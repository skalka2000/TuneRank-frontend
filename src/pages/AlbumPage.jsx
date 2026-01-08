import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAlbumById } from "../api/albums";
import SongTable from "../components/SongTable";

function AlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlbumById(id)
      .then(setAlbum)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading album...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>{album.title}</h2>
      <p><strong>Artist:</strong> {album.artist}</p>
      <p><strong>Year:</strong> {album.year ?? "N/A"}</p>
      <p><strong>Rating:</strong> {album.rating ?? "N/A"}</p>

      <Link to={`/albums/${id}/add-song`}>
        <button className="button" style={{ marginBottom: "1rem" }}>
          Add Song
        </button>
      </Link>

      <h3>Songs</h3>
      <SongTable songs={album.songs} />
    </div>
  );
}

export default AlbumPage;
