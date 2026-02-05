import EditableField from "./common/EditableField";
import { useIsMobile } from "../hooks/useIsMobile";

function AlbumHeader({ album, onFieldUpdate }) {
  const isMobile = useIsMobile();

  return (
    <div className="album-header">
      <h2 className="album-title">
        <EditableField
          value={album.title}
          onSave={(val) => onFieldUpdate("title", val)}
        />
        {!isMobile && (
        <>
            <span style={{ fontWeight: "normal"}}> by </span>
            <EditableField
            value={album.artist}
            onSave={(val) => onFieldUpdate("artist", val)}
            />
            <span style={{ fontWeight: "normal"}}>&minus; </span>
            <span style={{ fontWeight: "normal"}}>
            <EditableField
            value={album.year}
            onSave={(val) => onFieldUpdate("year", val)}
            />
            </span>
        </>
        )}
      </h2>

      {isMobile && (
        <div className="album-meta-mobile">
          <p>
            <strong>Artist:</strong>{" "}
            <EditableField
              value={album.artist}
              onSave={(val) => onFieldUpdate("artist", val)}
            />
          </p>
          <p>
            <strong>Year:</strong>{" "}
            <EditableField
              value={album.year}
              onSave={(val) => onFieldUpdate("year", val)}
            />
          </p>
        </div>
      )}
    </div>
  );
}

export default AlbumHeader;
