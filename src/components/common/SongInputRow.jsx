import { fireConfetti } from "../../utils/specialEffects";

function SongInputRow({ song, onChange, showTrack = true }) {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="song-form-group">
      {showTrack && (
        <input
          type="number"
          placeholder="Track #"
          value={song.track_number}
          onChange={(e) => handleChange("track_number", e.target.value)}
          min={1}
          className="input-standard"
        />
      )}
      <input
        type="text"
        placeholder="Song Title"
        value={song.title}
        onChange={(e) => handleChange("title", e.target.value)}
        className="input-standard"
      />
      <input
        type="text"
        placeholder="Rating"
        value={song.rating}
        onChange={(e) => handleChange("rating", e.target.value)}
        className="input-standard"
        onBlur={(e) => {
          const val = parseFloat(e.target.value);
          if (val === 11) fireConfetti();
        }}
      />
      <label className="checkbox-label">
        <input
          type="checkbox"
          className="checkbox-standard"
          checked={song.is_interlude}
          onChange={(e) => handleChange("is_interlude", e.target.checked)}
        />
        Interlude
      </label>
    </div>
  );
}

export default SongInputRow;
