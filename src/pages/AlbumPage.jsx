import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAlbumById, updateAlbumField } from "../api/albums";
import { addSongToAlbum } from "../api/songs";
import SongTable from "../components/SongTable";
import AddSongForm from "../components/AddSongForm";
import EditableField from "../components/EditableField";


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
        field="title"
        albumId={id}
        onUpdate={handleFieldUpdate}
      />
    </h2>
    <div className="album-info">
      <p><strong>Artist:</strong>{" "}
        <EditableField
          value={album.artist}
          field="artist"
          albumId={id}
          onUpdate={handleFieldUpdate}
        />
      </p>
      <p><strong>Year:</strong>{" "}
        <EditableField
          value={album.year}
          field="year"
          albumId={id}
          onUpdate={handleFieldUpdate}
        />
      </p>
      <p><strong>Rating:</strong>{" "}
        <EditableField
          value={album.rating}
          field="rating"
          albumId={id}
          onUpdate={handleFieldUpdate}
        />
      </p>
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
