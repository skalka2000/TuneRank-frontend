import { useEffect, useState } from "react";
import { fetchGenres, createGenre, deleteGenre } from "../../api/genres";
import { useUserMode } from "../../hooks/useUserMode";

function GenresPanel() {
  const { userId } = useUserMode();

  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      const data = await fetchGenres(userId);
      setGenres(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newGenre.trim()) return;

    try {
      const created = await createGenre(userId, newGenre.trim());
      setGenres(prev => [...prev, created]);
      setNewGenre("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (genreId) => {
    try {
      await deleteGenre(userId, genreId);
      setGenres(prev => prev.filter(g => g.id !== genreId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading genres...</p>;

  return (
    <div className="settings-panel">
      <h3>Genres</h3>

      <div className="genre-add">
        <input
          className="input-simple"
          value={newGenre}
          onChange={(e) => setNewGenre(e.target.value)}
          placeholder="New genre..."
        />
        <button className="button" onClick={handleAdd}>
          Add
        </button>
      </div>

      <div className="genre-list">
        {genres.map(genre => (
          <div key={genre.id} className="genre-item">
            <span>{genre.name}</span>
            <button
              className="button button-secondary button-small"
              onClick={() => handleDelete(genre.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


export default GenresPanel;
