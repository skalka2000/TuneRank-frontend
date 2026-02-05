import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAlbumById, updateAlbumField } from "../api/albums";
import { addSongToAlbum } from "../api/songs";
import SongTable from "../components/SongTable";
import AddSongForm from "../components/AddSongForm";
import EditableField from "../components/common/EditableField";
import { updateSongField } from "../api/songs";
import { deleteSong } from "../api/songs";
import { useSettings } from "../context/SettingsContext";
import { getRatingColor } from "../utils/ratingColors";
import { useRef } from "react";
import { fireConfetti } from "../utils/specialEffects";

function AlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddSongForm, setShowAddSongForm] = useState(false);
  const { power, greatnessThreshold, scalingFactor, steepFactor, averageRatingWeight } = useSettings();
  const previousSongRatingsRef = useRef([])

  const refreshAlbum = async () => {
    try {
      const updated = await fetchAlbumById(id, power, greatnessThreshold, scalingFactor, steepFactor, averageRatingWeight);
      const previous = previousSongRatingsRef.current;
      const current = updated.songs.map(s => ({ id: s.id, rating: s.rating }));
      const newPerfectSongs = current.filter(({ id, rating }) => {
        const prev = previous.find(p => p.id === id);
        return prev && prev.rating !== rating && rating === 11;
      });

      if (newPerfectSongs.length > 0) {
        fireConfetti();
      }

      previousSongRatingsRef.current = current;      
      setAlbum(updated);
    } catch (err) {
      console.error("Failed to refresh album:", err.message);
    }
  };

  const handleFieldUpdate = async (field, value) => {
    const updated = await updateAlbumField(id, field, value);
    await refreshAlbum();
  };

  const handleSongUpdate = async (songId, field, value) => {
    try {
      const updated = await updateSongField(songId, field, value);
      await refreshAlbum();
    } catch (err) {
      console.error("Failed to update song:", err.message);
    }
  };

  const handleDeleteSong = async (songId) => {
    try {
      await deleteSong(songId);
      await refreshAlbum();
    } catch (err) {
      console.error("Failed to delete song:", err.message);
    }
  };

  useEffect(() => {
    fetchAlbumById(id, power, greatnessThreshold, scalingFactor, steepFactor, averageRatingWeight)
      .then(setAlbum)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, power, greatnessThreshold, scalingFactor, steepFactor, averageRatingWeight]);

  const handleAddSong = async (songData) => {
    try {
      const newSong = await addSongToAlbum(id, songData);
      await refreshAlbum();
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
      <div style={{alignItems: 'center', display: 'flex', gap: '1.5rem'}}>
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
      <p>
        <strong>Album Rating:</strong>{" "}
        <span
          className="rating-box"
          style={{
            backgroundColor: getRatingColor(album.rating),
          }}
        >
          <EditableField
            value={album.rating}
            onSave={(val) => handleFieldUpdate("rating", val)}
          />
        </span>
      </p>
      <p>
        <strong>Avg. Song Rating:</strong>{" "}
        {album.average_rating != null ? (
          <span
            className="rating-box"
            style={{
              backgroundColor: getRatingColor(album.average_rating),
            }}
          >
            {album.average_rating.toFixed(2)}
          </span>
        ) : (
          "N/A"
        )}
      </p>
      <p>
        <strong>Overall Rating:</strong>{" "}
        {album.overall_rating != null ? (
          <span
            className="rating-box"
            style={{
              backgroundColor: getRatingColor(album.average_rating),
            }}
          >
            {(Math.floor(album.overall_rating * 100) / 100).toFixed(2)}
          </span>
        ) : (
          "N/A"
        )}
      </p>      
      </div>


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
