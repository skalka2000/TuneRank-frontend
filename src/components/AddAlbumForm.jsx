import React, { useState } from "react";

function AddAlbumForm({onSubmit, onCancel}){
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [year, setYear] = useState("");
    const [rating, setRating] = useState("");
    const [songs, setSongs] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const album={
            title,
            artist,
            year: year && parseInt(year),
            rating: rating && parseFloat(rating),
            songs: songs
              .filter(song => song.title.trim() !== "")
              .map(song => ({
                title: song.title,
                ...(song.track_number && { track_number: parseInt(song.track_number) }),
                ...(song.rating && { rating: parseFloat(song.rating) }),
                is_interlude: song.is_interlude ?? false,
              }))
        };
        console.log("Submitting album:", album);
        onSubmit(album);    
    }

    const handleAddSong = () => {
      setSongs([...songs, { title: "", track_number: "", rating: "", is_interlude: false }]);
    }

    const handleSongChange = (index, field, value) => {
        const updatedSongs = [...songs]
        updatedSongs[index][field] = value
        setSongs(updatedSongs)
    }
    return (
    <form onSubmit={handleSubmit} className="album-form">
    <div className="album-form-details">    
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Artist"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      <input
        type="text"
        placeholder="Rating"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />
      </div>
      {songs.length > 0 && <h3>Songs</h3>}
      {songs.map((song, index) => (
        <div key={index} className="song-form-group">
          <input
            type="number"
            placeholder="Track #"
            value={song.track_number}
            onChange={(e) => handleSongChange(index, "track_number", e.target.value)}
            min={1}
          />            
          <input
            type="text"
            placeholder="Song Title"
            value={song.title}
            onChange={(e) => handleSongChange(index, "title", e.target.value)}
          />
          <input
            type="text"
            placeholder="Song Rating"
            value={song.rating}
            onChange={(e) => handleSongChange(index, "rating", e.target.value)}
          />
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={song.is_interlude}
            onChange={(e) => handleSongChange(index, "is_interlude", e.target.checked)}
          />
          Interlude
      </label>
        </div>
      ))}
      
      <button type="button" onClick={handleAddSong} className="button">Add Song</button>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button type="submit" className="button">Confirm</button>
        <button type="button" className="button button-danger" onClick={onCancel}>Cancel</button>
      </div>
      
    </form>
    );
}

export default AddAlbumForm;
