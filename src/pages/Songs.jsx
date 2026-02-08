import React, { useEffect, useState } from "react";
import { fetchSongs } from "../api/songs";
import SongTable from "../components/SongTable";
import { updateSongField } from "../api/songs";
import RatingDistributionChart from "../components/graphs/RatingDistributionChart";
import LoadingOverlay from "../components/common/LoadingOverlay";
import { useIsMobile } from "../hooks/useIsMobile";


function Songs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [displayRatingChart, setDisplayRatingChart] = useState(false)
  const isMobile = useIsMobile()

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

  const refreshSongs = async () => {
    try {
      const data = await fetchSongs();
      setSongs(data);
    } catch (err) {
      console.error("Failed to refresh songs:", err.message);
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
  
  const displayRatingChartButton = (
    <>
      <span role="img" aria-label="chart">📊</span>
      <span className="button-text">Display Rating Distribution</span>
    </>
  );

  const hideRatingChartButton = (
    <>
      <span role="img" aria-label="back">🔙</span>
      <span className="button-text">Hide Rating Distribution</span>
    </>
  );

  const marginTopToolbar = displayRatingChart ? 0 : "-1rem"

  return (
    <div className="page">
      <h1>All Songs</h1>
      {ratingChart}
      <div className="toolbar-actions" style={{marginTop: marginTopToolbar}}>
        <button 
          className="button button-secondary" 
          onClick={() => setDisplayRatingChart(prev => !prev)}>
          {displayRatingChart ? hideRatingChartButton : displayRatingChartButton}
        </button>
      </div>
      <SongTable 
        songs={songs}
        isAlbumSpecific={false} 
        onUpdate={handleSongUpdate}
        onRefresh={refreshSongs}
      />
    </div>
  );
}

export default Songs;
