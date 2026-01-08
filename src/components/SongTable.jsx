// import { Link } from "react-router-dom";
import { getRatingColor } from "../utils/ratingColors";


function SongTable({ songs, showAlbum = false }) {
  if (!songs.length) return <p>No songs found.</p>;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          {showAlbum  && <th>Album</th>}
          <th>Artist</th>
          <th>Rating</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {songs.map((song) => (
          <tr key={song.id}>
            <td>{song.track_number}</td>
            <td>{song.title}</td>
            {showAlbum && <td>{song.album?.title || "N/A"}</td>}
            <td>{song.album?.artist || "N/A"}</td>
            <td>
              <div className={getRatingColor(song.rating)}>
                {song.rating}
              </div>
            </td>
            <td></td>
            {/* <td>
              <Link to={`/songs/${song.id}`}>
                <button className="button">View</button>
              </Link>
            </td> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SongTable;
