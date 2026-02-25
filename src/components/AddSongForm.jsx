import { useState } from "react";
import { fireConfetti } from "../utils/specialEffects";
import SongInputRow from "./common/SongInputRow";

function AddSongForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [trackNumber, setTrackNumber] = useState("");
  const [rating, setRating] = useState("");
  const [songType, setSongType] = useState("song");

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedRating = parseFloat(rating);
    if (parsedRating === 11) {
      fireConfetti();
    }

    const newSong = {
      title,
      ...(trackNumber && { track_number: parseInt(trackNumber, 10) }),
      ...(rating && { rating: parseFloat(rating) }),
      song_type: songType,
    };

    onSubmit(newSong);

    // Reset form
    setTitle("");
    setTrackNumber("");
    setRating("");
    setSongType("song");
  };

  return (
    <form onSubmit={handleSubmit} className="add-song-form">
      <SongInputRow
        song={{ title, track_number: trackNumber, rating, song_type: songType }}
        onChange={(field, val) => {
          if (field === "title") setTitle(val);
          if (field === "track_number") setTrackNumber(val);
          if (field === "rating") setRating(val);
          if (field === "song_type") setSongType(val);
        }}
        showTrack={true}
      />
      <button type="submit" className="button" style={{ height: "2rem", width: "5rem" }}>
        Confirm
      </button>
    </form>
  );
}

export default AddSongForm;
