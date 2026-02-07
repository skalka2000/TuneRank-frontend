import React, { useEffect, useState } from "react";
import { fetchAlbums, deleteAlbum } from "../api/albums";
import { Link } from "react-router-dom";
import AlbumTable from "../components/AlbumTable";
import { useSettings } from "../context/SettingsContext";
import RatingDistributionChart from "../components/graphs/RatingDistributionChart";
import LoadingOverlay from "../components/common/LoadingOverlay";
import { useIsMobile } from "../hooks/useIsMobile";


function Albums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { power, greatnessThreshold, scalingFactor, steepFactor, averageRatingWeight } = useSettings();
  const [displayRatingChart, setDisplayRatingChart] = useState(false)
  const isMobile = useIsMobile()

  const handleDeleteAlbum = async (id) => {
    try {
      await deleteAlbum(id);
      setAlbums((prev) => prev.filter((album) => album.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAlbums(power, greatnessThreshold, scalingFactor, steepFactor, averageRatingWeight)
      .then(setAlbums)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [power, greatnessThreshold, scalingFactor, steepFactor, averageRatingWeight]);

  if (loading) return <LoadingOverlay message="Loading albums..." />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const ratingChart = displayRatingChart ? (
    <RatingDistributionChart
      data={albums}
      valueAccessor={(a) => a.overall_rating}
      type="continuous"
      step={0.25}
    />
  ) : null;

  const addButtonText = <>
    <span role="img" aria-label="add">➕</span>
    <span className="button-text">Add Album</span>
  </>;

  const displayRatingChartButton = <>
    <span role="img" aria-label="chart">📊</span>
    <span className="button-text">Display Rating Distribution</span>
  </>;

  const hideRatingChartButton = <>
    <span role="img" aria-label="back">🔙</span>
    <span className="button-text">Hide Rating Distribution</span>
  </>;


  const marginTopToolbar = displayRatingChart ? 0 : "-1rem"

  return (
    <div className="page">
      <h1>Albums</h1>
      {ratingChart}
      <div className="toolbar-actions" style={{marginTop: marginTopToolbar}}>
        <button
          className="button button-secondary"
          onClick={() => setDisplayRatingChart(prev => !prev)}
        >
        {displayRatingChart ? hideRatingChartButton : displayRatingChartButton}
        </button>
        <Link to="/albums/add">
          <button className="button">{addButtonText}</button>
        </Link>
      </div>
      <AlbumTable
        albums={albums}
        onDelete={handleDeleteAlbum}
      />
    </div>
  );
}

export default Albums;
