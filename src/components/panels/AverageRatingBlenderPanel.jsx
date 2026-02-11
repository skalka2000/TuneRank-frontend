import { useUserSettings } from "../../context/SettingsContext";
import { useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

function AverageRatingBlender() {
  const { draft, loading } = useUserSettings();
  const [albumRating, setAlbumRating] = useState(7.5);
  const [weightedAverage, setWeightedAverage] = useState(8.0);
  const isMobile = useIsMobile();

  if (loading || !draft) return null;

  const blended = (
    albumRating * (1 - draft.average_rating_weight) +
    weightedAverage * draft.average_rating_weight
  ).toFixed(2);

  const width = isMobile ? "100%" : "50%";

  return (
    <div className="settings-panel" style={{ width }}>
      <h3>Overall Rating Calculator</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label>
          Album Rating:
          <input
            className="input-simple input-small"
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={albumRating}
            onChange={(e) => setAlbumRating(parseFloat(e.target.value))}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>

        <label>
          Weighted Average Rating:
          <input
            className="input-simple input-small"
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={weightedAverage}
            onChange={(e) => setWeightedAverage(parseFloat(e.target.value))}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>

        <div>
          <strong>Overall Rating:</strong> {blended}
        </div>
      </div>
    </div>
  );
}

export default AverageRatingBlender;
