import React, { useEffect, useState } from "react";
import { fetchSongs } from "../api/songs";
import SongTable from "../components/SongTable";
import { updateSongField } from "../api/songs";
import RatingDistributionChart from "../components/graphs/RatingDistributionChart";
import LoadingOverlay from "../components/common/LoadingOverlay";


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

  if (loading) return <LoadingOverlay message="Loading songs..." />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const ratingChart = displayRatingChart ? (
    <RatingDistributionChart 
      data={songs} 
      valueAccessor={(s) => s.rating} 
      type="discrete" 
      step={0.5} 
    />
  ) : null;

  return (
    <div className="page">
      <h1>All Songs</h1>
      <SongTable 
        songs={songs} 
        showAlbum 
        showTrackNumber={false}  
        onUpdate={handleSongUpdate}
        extraContent={ratingChart}
        toolbarActions={
          <div>
            <button 
              className="button button-secondary" 
              style={{marginBottom: '20px'}} 
              onClick={() => setDisplayRatingChart(prev => !prev)}>
              {displayRatingChart ? "Hide Rating Distribution" : "Display Rating Distribution"}
            </button>
          </div>
        }/>
    </div>
  );
}

export default Songs;
