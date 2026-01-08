import React, { useState } from "react";

function AddAlbumForm({onSubmit}){
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [year, setYear] = useState("");
    const [rating, setRating] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();
        const album={
            title,
            artist,
            year: year && parseInt(year),
            rating: rating && parseFloat(rating)
        };
        onSubmit(album);    
    }
      return (
    <form onSubmit={handleSubmit} className="album-form">
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
      <button type="submit" className="button">Save</button>
    </form>
    );
}

export default AddAlbumForm;
