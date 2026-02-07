import { useState } from "react";
import { fireConfetti } from "../utils/specialEffects";
import SongInputRow from "./common/SongInputRow";

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
    <form onSubmit={handleSubmit} className="add-song-form">
      <SongInputRow
        song={{ title, track_number: trackNumber, rating, is_interlude: isInterlude }}
        onChange={(field, val) => {
          if (field === "title") setTitle(val);
          if (field === "track_number") setTrackNumber(val);
          if (field === "rating") setRating(val);
          if (field === "is_interlude") setIsInterlude(val);
        }}
        showTrack={true}
      />
      <button type="submit" className="button" style={{height: "2rem", width: "5rem"}}>
        Confirm
      </button>
    </form>
  );
}

export default AddSongForm;
