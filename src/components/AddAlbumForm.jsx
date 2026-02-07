import React, { useState } from "react";
import SongInputRow from "./common/SongInputRow";

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
        className="input-standard"
        required
      />
      <input
        type="text"
        placeholder="Artist"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        className="input-standard"
        required
      />
      <input
        type="text"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="input-standard"
      />
      <input
        type="text"
        placeholder="Rating"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="input-standard"
      />
      </div>
      {songs.length > 0 && <h3>Songs</h3>}
      {songs.map((song, index) => (
        <SongInputRow
          key={index}
          song={song}
          onChange={(field, value) => handleSongChange(index, field, value)}
        />
      ))}
      <button type="button" onClick={handleAddSong} className="button">Add Song</button>
      <div className="form-button-group">
        <button type="submit" className="button">Confirm</button>
        <button type="button" className="button button-danger" onClick={onCancel}>Cancel</button>
      </div>
    </form>
    );
}

export default AddAlbumForm;
