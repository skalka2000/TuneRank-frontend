import { useState, useEffect } from "react";
import SongInputRow from "./common/SongInputRow";

export default function EditSongModal({ song, onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    track_number: 0,
    rating: 0,
    is_interlude: false,
  });

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

    const handleSubmit = () => {
    let hasChanges = false;

    for (const key in form) {
        if (form[key] !== song[key]) {
        const value =
            key === "track_number" || key === "rating"
            ? Number(form[key])
            : form[key];
        onSave(key, value);
        hasChanges = true;
        }
    }

    if (!hasChanges) {
        onClose(); 
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

        <div className="button-group-center">
          <button onClick={handleSubmit} className="button button-primary">
            Save
          </button>
          <button onClick={onClose} className="button button-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
