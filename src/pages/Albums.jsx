import React, { useEffect, useState } from "react";
import { fetchAlbums, deleteAlbum } from "../api/albums";
import { Link } from "react-router-dom";
import AlbumTable from "../components/AlbumTable";
import { useSettings } from "../context/SettingsContext";
import RatingDistributionChart from "../components/graphs/RatingDistributionChart";


function Albums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { power, greatnessThreshold, scalingFactor, steepFactor, averageRatingWeight } = useSettings();
  const [displayRatingChart, setDisplayRatingChart] = useState(false)


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

  if (loading) return <p>Loading albums...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const ratingChart = displayRatingChart ? (
    <RatingDistributionChart
      data={albums}
      valueAccessor={(a) => a.overall_rating}
      type="continuous"
      step={0.25}
    />
  ) : null;

  return (
    <div className="page">
      <h1>Albums</h1>
      {displayRatingChart && (
        <RatingDistributionChart
          data={albums}
          valueAccessor={(a) => a.overall_rating}
          type="continuous"
          step={0.25}
        />
      )}
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
              {displayRatingChart ? "Hide Rating Distribution" : "Display Rating Distribution"}
            </button>
              <Link to="/albums/add">
                <button className="button">Add Album</button>
              </Link>
          </div>
        }
      />
    </div>
  );
}

export default Albums;
