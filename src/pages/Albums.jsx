import React, { useEffect, useState, useMemo } from "react";
import { fetchAlbums, deleteAlbum } from "../api/albums";
import { Link } from "react-router-dom";
import AlbumTable from "../components/AlbumTable";
import RatingDistributionChart from "../components/graphs/RatingDistributionChart";
import LoadingOverlay from "../components/common/LoadingOverlay";
import { useUserMode } from "../hooks/useUserMode";
import { fetchGenres } from "../api/genres";

function Albums() {
  const { userId, mode } = useUserMode();
  
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [displayRatingChart, setDisplayRatingChart] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [showGenreFilter, setShowGenreFilter] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let retryTimeout;

    const loadAlbums = async (retryCount = 0) => {
      try {
        const data = await fetchAlbums(userId);

        if (!isMounted) return;

        setAlbums(data);
        setError("");
        setLoading(false);
      } catch (err) {
        if (!isMounted) return;

        if (retryCount < 1) {
          retryTimeout = setTimeout(() => {
            loadAlbums(retryCount + 1);
          }, 2000);
        } else {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    setLoading(true);
    loadAlbums();

    return () => {
      isMounted = false;
      clearTimeout(retryTimeout);
    };
  }, [userId]);

  useEffect(() => {
    fetchGenres(userId)
      .then(setAllGenres)
      .catch(err => console.error(err));
  }, [userId]);

  const filteredAlbums = useMemo(() => {
    if (selectedGenres.length === 0) return albums;

    return albums.filter(album =>
      album.genres?.some(g => selectedGenres.includes(g.id))
    );
  }, [albums, selectedGenres]);


  const handleDeleteAlbum = async (id) => {
    try {
      await deleteAlbum(id);
      setAlbums((prev) => prev.filter((album) => album.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

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

  const displayRatingChartButtonText = <>
    <span role="img" aria-label="chart">📊</span>
    <span className="button-text">Display Rating Distribution</span>
  </>;

  const hideRatingChartButtonText = <>
    <span role="img" aria-label="back">✖</span>
    <span className="button-text">Hide Rating Distribution</span>
  </>;

  const displayFilterByGenreText = <>
    <span role="img" aria-label="chart">🎵</span>
    <span className="button-text">Filter by Genre</span>
  </>;

  const hideFilterByGenreText = <>
    <span role="img" aria-label="chart">✖</span>
    <span className="button-text">Hide Filter</span>
  </>;

  const marginTopToolbar = displayRatingChart ? 0 : "-1rem"

  return (
    <div className="page">
      <h1>Albums</h1>
      {ratingChart}
      <div className="toolbar-actions" style={{marginTop: marginTopToolbar}}>
        <button
          className="button button-secondary"
          onClick={() => setShowGenreFilter(prev => !prev)}
        >
        {showGenreFilter ? hideFilterByGenreText : displayFilterByGenreText}
        </button>
        <button
          className="button button-secondary"
          onClick={() => 
            setDisplayRatingChart(prev => !prev)
          }
        >
        {displayRatingChart ? hideRatingChartButtonText : displayRatingChartButtonText}
        </button>
        <Link to={`/${mode}/albums/add`}>
          <button className="button">{addButtonText}</button>
        </Link>
      </div>
      {showGenreFilter && allGenres.length > 0 && (
        <div className="genre-filter">
          <div className="genre-selector">
            <strong>Filter by Genres:</strong>
            {allGenres.map(genre => (
              <label key={genre.id} className="checkbox-label">
                <input
                  type="checkbox"
                  className = "checkbox-standard"
                  checked={selectedGenres.includes(genre.id)}
                  onChange={() => {
                    setSelectedGenres(prev =>
                      prev.includes(genre.id)
                        ? prev.filter(id => id !== genre.id)
                        : [...prev, genre.id]
                    );
                  }}
                />
                {genre.name}
              </label>
            ))}
          </div>
          <button
            className="button button-secondary"
            onClick={() => setSelectedGenres([])}
          >
            Clear Filter
          </button>
        </div>
      )}

      <AlbumTable
        albums={filteredAlbums}
        onDelete={handleDeleteAlbum}
      />
    </div>
  );
}

export default Albums;
