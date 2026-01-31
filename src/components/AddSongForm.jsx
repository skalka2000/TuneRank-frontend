import { useState } from "react";

function AddSongForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [trackNumber, setTrackNumber] = useState("");
  const [rating, setRating] = useState("");
  const [isInterlude, setIsInterlude] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

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
    <form onSubmit={handleSubmit} className="song-form">
      <input
        type="number"
        placeholder="Track #"
        value={trackNumber}
        onChange={(e) => setTrackNumber(e.target.value)}
        min={1}
      />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Rating"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
