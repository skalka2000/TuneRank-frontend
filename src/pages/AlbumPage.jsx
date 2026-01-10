import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAlbumById } from "../api/albums";
import { addSongToAlbum } from "../api/songs";
import SongTable from "../components/SongTable";
import AddSongForm from "../components/AddSongForm";


function AlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddSongForm, setShowAddSongForm] = useState(false);


  useEffect(() => {
    fetchAlbumById(id)
      .then(setAlbum)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddSong = async (songData) => {
    try {
      const newSong = await addSongToAlbum(id, songData);
      setAlbum((prev) => ({
        ...prev,
        songs: [...prev.songs, newSong],
      }));
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) return <p>Loading album...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>{album.title}</h2>
      <div className = "album-info">
        <p><strong>Artist:</strong> {album.artist}</p>
        <p><strong>Year:</strong> {album.year ?? "N/A"}</p>
        <p><strong>Rating:</strong> {album.rating ?? "N/A"}</p>
      </div>
      <div className = "album-info-songs-add-song">
        <h3>Songs</h3>
        <button className="button" onClick={() => setShowAddSongForm(prev => !prev)}>
          {showAddSongForm ? "Cancel" : "Add Song"}
        </button>
      </div>
      {showAddSongForm && <AddSongForm onSubmit={handleAddSong} />}
      <SongTable songs={album.songs} />
    </div>
  );
}

export default AlbumPage;
