import React, { useState, useEffect } from "react";
import SongInputRow from "./common/SongInputRow";
import { fetchGenres } from "../api/genres";
import { useUserMode } from "../hooks/useUserMode";
import { showErrorX } from "../utils/specialEffects";

function AddAlbumForm({onSubmit, onCancel}){
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [year, setYear] = useState("");
    const [rating, setRating] = useState("");
    const [songs, setSongs] = useState([]);
    const { userId } = useUserMode();
    const [allGenres, setAllGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState(new Set());

    useEffect(() => {
      const loadGenres = async () => {
        try {
          const data = await fetchGenres(userId);
          setAllGenres(data);
        } catch (err) {
          console.error(err);
        }
      };

      loadGenres();
    }, [userId]);

    const toggleGenre = (genreId) => {
      setSelectedGenres(prev => {
        const copy = new Set(prev);
        if (copy.has(genreId)) {
          copy.delete(genreId);
        } else {
          copy.add(genreId);
        }
        return copy;
      });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const album={
            title,
            artist,
            year: year && parseInt(year),
            rating: rating && parseFloat(rating),
            genre_ids: Array.from(selectedGenres),
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
    <form onSubmit={handleSubmit} className="add-album-form">
    <div className="add-album-form-details">    
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input-standard input-xxl"
        required
      />
      <input
        type="text"
        placeholder="Artist"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        className="input-standard input-xl"
        required
      />
      <input
        type="text"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="input-standard input-medium"
      />
      <input
        type="text"
        placeholder="Rating"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="input-standard input-small"
      />
      </div>
      {allGenres.length > 0 && (
        <div className="genre-selector">
          <h4>Genres</h4>
          {allGenres.map(genre => (
            <label key={genre.id} className="checkbox-label">
              <input
                className="checkbox-standard"
                type="checkbox"
                checked={selectedGenres.has(genre.id)}
                onChange={() => toggleGenre(genre.id)}
              />
              {genre.name}
            </label>
          ))}
        </div>
      )}
      {songs.length > 0 && <h3>Songs</h3>}
      {songs.map((song, index) => (
        <SongInputRow
          key={index}
          song={song}
          onChange={(field, value) => handleSongChange(index, field, value)}
        />
      ))}
      <button type="button" onClick={handleAddSong} className="button" style={{marginTop: "0.5rem"}}>Add Song</button>
      <div className="form-button-group">
        <button type="submit" className="button">Confirm</button>
        <button type="button" className="button button-danger" onClick={onCancel}>Cancel</button>
      </div>
    </form>
    );
}

export default AddAlbumForm;
