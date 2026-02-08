import { useState, useEffect } from "react";
import SongInputRow from "./common/SongInputRow";
import { updateSongField } from "../api/songs";

export default function EditSongModal({ song, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: "",
    track_number: 0,
    rating: 0,
    is_interlude: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (song) {
      setForm({
        title: song.title || "",
        track_number: song.track_number || 0,
        rating: song.rating || 0,
        is_interlude: song.is_interlude || false,
      });
    }
  }, [song]);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      let hasChanges = false;

      for (const key in form) {
        if (form[key] !== song[key]) {
          const value =
            key === "track_number" || key === "rating"
              ? Number(form[key])
              : form[key];

          await updateSongField(song.id, key, value);
          hasChanges = true;
        }
      }
      if (onSaved) onSaved();
    } catch (err) {
      console.error("Failed to update song:", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!song) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Edit Song</h2>

        <SongInputRow
          song={form}
          onChange={(field, value) =>
            setForm((prev) => ({ ...prev, [field]: value }))
          }
        />

        {error && <p className="text-error">{error}</p>}

        <div className="button-group-center">
          <button
            onClick={handleSubmit}
            className="button button-primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={onClose}
            className="button button-secondary"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}