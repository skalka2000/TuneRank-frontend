import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAlbumById, updateAlbumField } from "../api/albums";
import { addSongToAlbum } from "../api/songs";
import SongTable from "../components/SongTable";
import AddSongForm from "../components/AddSongForm";
import EditableField from "../components/common/EditableField";
import { updateSongField } from "../api/songs";
import { deleteSong } from "../api/songs";
import { getRatingColor } from "../utils/ratingColors";
import { useRef } from "react";
import { fireConfetti, showSuccessCheckmark } from "../utils/specialEffects";
import AlbumHeader from "../components/AlbumHeader";
import LoadingOverlay from "../components/common/LoadingOverlay";
import { useIsMobile } from "../hooks/useIsMobile";
import { useUserMode } from "../hooks/useUserMode";
import { showErrorX } from "../utils/specialEffects";
import { fetchGenres, attachGenre, detachGenre } from "../api/genres";

function AlbumPage() {
  const { userId } = useUserMode();
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddSongForm, setShowAddSongForm] = useState(false);
  const previousSongRatingsRef = useRef([])
  const isMobile = useIsMobile()
  const [allGenres, setAllGenres] = useState([]);
  const [editingGenres, setEditingGenres] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let retryTimeout;

    const loadAlbum = async (retryCount = 0) => {
      try {
        const data = await fetchAlbumById(id, userId);

        if (!isMounted) return;

        setAlbum(data);
        setError("");
        setLoading(false);
      } catch (err) {
        if (!isMounted) return;

        if (retryCount < 1) {
          retryTimeout = setTimeout(() => {
            loadAlbum(retryCount + 1);
          }, 2000);
        } else {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    setLoading(true);
    loadAlbum();

    return () => {
      isMounted = false;
      clearTimeout(retryTimeout);
    };
  }, [id, userId]);


  const refreshAlbum = async () => {
    try {
      const updated = await fetchAlbumById(id, userId);
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

  const toggleGenre = async (genreId) => {
    if (!album) return;

    const isSelected = album.genres?.some(g => g.id === genreId);

    try {
      let updated;

      if (isSelected) {
        updated = await detachGenre(userId, album.id, genreId);
      } else {
        updated = await attachGenre(userId, album.id, genreId);
      }

      setAlbum(updated);
      showSuccessCheckmark();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFieldUpdate = async (field, value) => {
    const updated = await updateAlbumField(id, field, value, userId);
    await refreshAlbum();
  };

  const handleSongUpdate = async (songId, field, value) => {
    try {
      const updated = await updateSongField(songId, field, value, userId);
      await refreshAlbum();
    } catch (err) {
      showErrorX()
      console.error("Failed to update song:", err.message);
    }
  };

  const handleDeleteSong = async (songId) => {
    try {
      await deleteSong(songId, userId);
      await refreshAlbum();
    } catch (err) {
      console.error("Failed to delete song:", err.message);
    }
  };

  useEffect(() => {
    fetchAlbumById(id, userId)
      .then(setAlbum)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, userId]);

  const handleAddSong = async (songData) => {
    try {
      const newSong = await addSongToAlbum(id, songData, userId);
      await refreshAlbum();
      showSuccessCheckmark();
    } catch (err) {
      showErrorX()
      console.error(err.message);
    }
  };

  if (loading) return <LoadingOverlay message="Loading album..." />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const addSongForm = showAddSongForm ? (
    <AddSongForm onSubmit={handleAddSong} />
  ) : null;

  const addButtonText = (
    <>
      <span role="img" aria-label="add">➕</span>
      <span className="button-text">Add Song</span>
    </>
  );

  const cancelButtonText = (
    <>
      <span role="img" aria-label="cancel">✖</span>
      <span className="button-text">Cancel</span>
    </>
  );

  const marginTopAddSongForm = addSongForm || isMobile ? 0 : "-1rem"

  return (
    <div className="page">
      <AlbumHeader album={album} onFieldUpdate={handleFieldUpdate} />
      {allGenres.length > 0 && (
        <div className="album-genres-section">
          <strong>Genres:</strong>{" "}

          {!editingGenres ? (
            <span
              className="editable-field"
              onClick={() => setEditingGenres(true)}
            >
              {album.genres?.length
                ? album.genres.map(g => g.name).join(", ")
                : <span className="placeholder-muted">No genres</span>}
              <span className="edit-icon"> ✏️</span>
            </span>
          ) : (
            <div>
              {allGenres.map(genre => {
                const selected = album.genres?.some(g => g.id === genre.id);

                return (
                  <label key={genre.id} className="checkbox-label">
                    <input
                      className="checkbox-standard"
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleGenre(genre.id)}
                    />
                    {genre.name}
                  </label>
                );
              })}

              <button
                className="button"
                onClick={() => setEditingGenres(false)}
                style={{ marginTop: "0.5rem" }}
              >
                Done
              </button>
            </div>
          )}
        </div>
      )}

      <div className="album-ratings-form">
          <div>
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
          </div>
          <div>
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
          </div>
          <div>
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
          </div>      
      </div>
      <div className="album-page-add-song-form" style={{marginTop: marginTopAddSongForm}}>
        <div className="toolbar-actions">
        <button
          className={`button ${showAddSongForm ? "button-secondary" : ""}`}
          onClick={() => setShowAddSongForm(prev => !prev)}
        >
          {showAddSongForm ? cancelButtonText : addButtonText}
        </button>
        </div>
        {addSongForm}
      </div>
      <SongTable 
        songs={album.songs}
        isAlbumSpecific={true}
        onUpdate={handleSongUpdate} 
        onDelete={handleDeleteSong}
      />
    </div>
  );
}

export default AlbumPage;
