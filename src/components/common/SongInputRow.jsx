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
          className="input-standard input-small"
        />
      )}

      <input
        type="text"
        placeholder="Song Title"
        value={song.title}
        onChange={(e) => handleChange("title", e.target.value)}
        className="input-standard input-xxl"
      />

      <input
        type="text"
        placeholder="Rating"
        value={song.rating}
        onChange={(e) => handleChange("rating", e.target.value)}
        className="input-standard input-small"
        onBlur={(e) => {
          const val = parseFloat(e.target.value);
          if (val === 11) fireConfetti();
        }}
      />

      <label className="checkbox-label">
        <span style={{ marginRight: "0.5rem" }}>Type</span>
        <select
          className="input-standard"
          value={song.song_type ?? "song"}
          onChange={(e) => handleChange("song_type", e.target.value)}
        >
          <option value="song">Song</option>
          <option value="interlude">Interlude</option>
          <option value="epic">Epic</option>
        </select>
      </label>
    </div>
  );
}

export default SongInputRow;
