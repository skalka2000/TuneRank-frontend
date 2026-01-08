import { Link } from "react-router-dom";
import { getRatingColor } from "../utils/ratingColors";


function AlbumTable({ albums }) {
  if (!albums.length) return <p>No albums found.</p>;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Artist</th>
          <th>Year</th>
          <th>Rating</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {albums.map((album) => (
          <tr key={album.id}>
            <td>{album.title}</td>
            <td>{album.artist}</td>
            <td>{album.year}</td>
            <td>
              <div className={getRatingColor(album.rating)}>
                {album.rating}
              </div>
            </td>
            <td>
              <Link to={`/albums/${album.id}`}>
                <button className="button">View</button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AlbumTable;
