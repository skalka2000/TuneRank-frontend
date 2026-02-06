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

  const addButtonText = isMobile ? "➕" : "Add Album"
  const displayRatingChartButton = isMobile ? "📊" : "Display Rating Distribution"
  const hideRatingChartButton = isMobile ? "🔙" : "Hide Rating Distribution"

  return (
    <div className="page">
      <h1>Albums</h1>
      <AlbumTable
        albums={albums}
        onDelete={handleDeleteAlbum}
        extraContent={ratingChart}  
        toolbarActions={
          <div className="toolbar-actions">
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
        }
      />
    </div>
  );
}

export default Albums;
