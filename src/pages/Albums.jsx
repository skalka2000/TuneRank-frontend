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
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDecades, setSelectedDecades] = useState([]);

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

  const availableDecades = useMemo(() => {
    const decades = new Set();

    albums.forEach(album => {
      if (album.year) {
        const decade = Math.floor(album.year / 10) * 10;
        decades.add(decade);
      }
    });

    return Array.from(decades).sort((a, b) => a - b);
  }, [albums]);

  const filteredAlbums = useMemo(() => {
    return albums.filter(album => {

      const genreMatch =
        selectedGenres.length === 0 ||
        album.genres?.some(g => selectedGenres.includes(g.id));

      const decadeMatch =
        selectedDecades.length === 0 ||
        (album.year &&
          selectedDecades.includes(Math.floor(album.year / 10) * 10));

      return genreMatch && decadeMatch;
    });
  }, [albums, selectedGenres, selectedDecades]);

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
      data={filteredAlbums}
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

  const displayGeneralFilterText = <>
    <span role="img" aria-label="chart">🔍</span>
    <span className="button-text">Filters</span>
  </>;

  const hideGeneralFilterText = <>
    <span role="img" aria-label="chart">✖</span>
    <span className="button-text">Hide Filters</span>
  </>;

  const marginTopToolbar = displayRatingChart ? 0 : "-1rem"

  return (
    <div className="page">
      <h1>Albums</h1>
      {ratingChart}
      <div className="toolbar-actions" style={{marginTop: marginTopToolbar}}>
        <button
          className="button button-secondary"
          onClick={() => setShowFilters(prev => !prev)}
        >
        {showFilters ? hideGeneralFilterText : displayGeneralFilterText}
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
      {showFilters > 0 && (
        <div className="genre-filter">
          {/* Genre Section */}
          {allGenres.length > 0 && (
            <div className="genre-selector">
              <strong>Genres:</strong>
              {allGenres.map(genre => (
                <label key={genre.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox-standard"
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
          )}

          {/* Decade Section */}
          {availableDecades.length > 0 && (
            <div className="genre-selector">
              <strong>Decades:</strong>
              {availableDecades.map(decade => (
                <label key={decade} className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox-standard"
                    checked={selectedDecades.includes(decade)}
                    onChange={() => {
                      setSelectedDecades(prev =>
                        prev.includes(decade)
                          ? prev.filter(d => d !== decade)
                          : [...prev, decade]
                      );
                    }}
                  />
                  {decade}s
                </label>
              ))}
            </div>
          )}

          <button
            className="button button-secondary"
            style={{ marginTop: "1rem" }}
            onClick={() => {
              setSelectedGenres([]);
              setSelectedDecades([]);
            }}
          >
            Clear Filters
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
