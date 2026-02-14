import { useUserSettings } from "../../context/SettingsContext";
import { useState } from "react";
import RatingCell from "../common/RatingCell";

function OverallRatingPanel() {
  const { draft, setDraft, loading } = useUserSettings();
  const [albumRating, setAlbumRating] = useState(8.0);
  const [weightedAverage, setWeightedAverage] = useState(7.5);

  if (loading || !draft) return null;

  const blended = (
    albumRating * (1 - draft.average_rating_weight) +
    weightedAverage * draft.average_rating_weight
  );

  return (
    <div className="settings-panel">
      <h3>Overall Rating Calculation</h3>
      <div className="settings-overall-rating-panel">
        {/* Weight Control */}
        <div className="slider-group">
          <label>
            Average Rating Weight: <strong>{(draft.average_rating_weight * 100).toFixed(0)}%</strong>
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={draft.average_rating_weight}
            onChange={(e) =>
              setDraft({
                ...draft,
                average_rating_weight: parseFloat(e.target.value),
              })
            }
          />
        </div>

        {/* Calculator */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label>
            <span>Album Rating: </span>
            <input
              className="input-simple input-small"
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={albumRating}
              onChange={(e) => setAlbumRating(parseFloat(e.target.value))}
            />
          </label>

          <label>
            <span>Avg. Song Rating: </span>
            <input
              className="input-simple input-small"
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={weightedAverage}
              onChange={(e) => setWeightedAverage(parseFloat(e.target.value))}
            />
          </label>

          <div>
            <strong>Overall Rating: </strong> <RatingCell value={blended} precision={2}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverallRatingPanel;
