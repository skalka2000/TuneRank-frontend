import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAlbumById, updateAlbumField } from "../api/albums";
import { addSongToAlbum } from "../api/songs";
import SongTable from "../components/SongTable";
import AddSongForm from "../components/AddSongForm";
import EditableField from "../components/EditableField";
import { updateSongField } from "../api/songs";
import { deleteSong } from "../api/songs";



function AlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddSongForm, setShowAddSongForm] = useState(false);

  const handleFieldUpdate = async (field, value) => {
    const updated = await updateAlbumField(id, field, value);
    setAlbum(updated);
  };

  const handleSongUpdate = async (songId, field, value) => {
    try {
      const updated = await updateSongField(songId, field, value);
      setAlbum(prev => ({
        ...prev,
        songs: prev.songs.map(song =>
          song.id === updated.id ? updated : song
        ),
      }));
    } catch (err) {
      console.error("Failed to update song:", err.message);
    }
  };

  const handleDeleteSong = async (songId) => {
    try {
      await deleteSong(songId);
      setAlbum(prev => ({
        ...prev,
        songs: prev.songs.filter(song => song.id !== songId),
      }));
    } catch (err) {
      console.error("Failed to delete song:", err.message);
    }
  };

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
    <h2>
      <EditableField
        value={album.title}
        onSave={(val) => handleFieldUpdate("title", val)}
      />
    </h2>
    <div className="album-info">
      <p><strong>Artist:</strong>{" "}
        <EditableField
          value={album.artist}
          onSave={(val) => handleFieldUpdate("artist", val)}
        />
      </p>
      <p><strong>Year:</strong>{" "}
        <EditableField
          value={album.year}
          onSave={(val) => handleFieldUpdate("year", val)}
        />
      </p>
      <p><strong>Rating:</strong>{" "}
        <EditableField
          value={album.rating}
          onSave={(val) => handleFieldUpdate("rating", val)}
        />
      </p>
      <p><strong>Avg. Song Rating:</strong>{" "}
        {album.average_rating?.toFixed(2) ?? "N/A"}
      </p>
    </div>
      <div className = "album-info-songs-add-song">
        <h3>Songs</h3>
        <button className="button" onClick={() => setShowAddSongForm(prev => !prev)}>
          {showAddSongForm ? "Cancel" : "Add Song"}
        </button>
      </div>
      {showAddSongForm && <AddSongForm onSubmit={handleAddSong} />}
      <SongTable songs={album.songs} onUpdate={handleSongUpdate} onDelete={handleDeleteSong}/>
    </div>
  );
}

export default AlbumPage;
