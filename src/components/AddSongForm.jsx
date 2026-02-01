import { useState } from "react";
import { fireConfetti } from "../utils/specialEffects";

function AddSongForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [trackNumber, setTrackNumber] = useState("");
  const [rating, setRating] = useState("");
  const [isInterlude, setIsInterlude] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedRating = parseFloat(rating);
        if (parsedRating === 11) {
            fireConfetti()
        }

    const newSong = {
      title,
      ...(trackNumber && { track_number: parseInt(trackNumber) }),
      ...(rating && { rating: parseFloat(rating) }),
      is_interlude: isInterlude,
    };

    onSubmit(newSong);

    // Reset form
    setTitle("");
    setTrackNumber("");
    setRating("");
    setIsInterlude(false);
  };

  return (
    <form onSubmit={handleSubmit} className="song-form-group">
      <input
        type="number"
        placeholder="Track #"
        size={20}
        value={trackNumber}
        onChange={(e) => setTrackNumber(e.target.value)}
        min={1}
        className="input-standard"
      />
      <input
        type="text"
        placeholder="Title"
        size={60}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input-standard"
        required
      />
      <input
        type="text"
        placeholder="Rating"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="input-standard"
      />
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={isInterlude}
          onChange={(e) => setIsInterlude(e.target.checked)}
        />
        Interlude
      </label>
      <button type="submit" className="button">Save</button>
    </form>
  );
}

export default AddSongForm;
