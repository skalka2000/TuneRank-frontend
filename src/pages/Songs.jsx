import React, { useEffect, useState } from "react";
import { fetchSongs } from "../api/songs";
import SongTable from "../components/SongTable";
import { updateSongField } from "../api/songs";


function Songs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleSongUpdate = async (songId, field, value) => {
    try {
      const updated = await updateSongField(songId, field, value);
      setSongs(prev =>
        prev.map(song => (song.id === updated.id ? updated : song))
      );
    } catch (err) {
      console.error("Failed to update song:", err.message);
    }
  };


  useEffect(() => {
    fetchSongs()
      .then(setSongs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading songs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>All Songs</h2>
      <SongTable songs={songs} showAlbum showTrackNumber={false}  onUpdate={handleSongUpdate}/>
    </div>
  );
}

export default Songs;
