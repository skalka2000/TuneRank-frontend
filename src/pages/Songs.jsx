import React, { useEffect, useState } from "react";
import { fetchSongs } from "../api/songs";
import SongTable from "../components/SongTable";
import { updateSongField } from "../api/songs";
import RatingDistributionChart from "../components/RatingDistributionChart";


function Songs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [displayRatingChart, setDisplayRatingChart] = useState(false)

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
      <button 
      className="button button-secondary" 
      style={{marginBottom: '20px'}} 
      onClick={() => setDisplayRatingChart(prev => !prev)}>
        {displayRatingChart ? "Hide Rating Distribution" : "Display Rating Distribution"}
      </button>
      {displayRatingChart && <RatingDistributionChart data={songs} valueAccessor={(s) => s.rating} type="discrete" step={0.5} />}
      <SongTable songs={songs} showAlbum showTrackNumber={false}  onUpdate={handleSongUpdate}/>
    </div>
  );
}

export default Songs;
