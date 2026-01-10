import React, { useEffect, useState } from "react";
import { fetchSongs } from "../api/songs";
import SongTable from "../components/SongTable";

function Songs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <SongTable songs={songs} showAlbum showTrackNumber={false} />
    </div>
  );
}

export default Songs;
