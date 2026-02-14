import { useUserSettings } from "../../context/SettingsContext";
import { useState } from "react";
import RatingCell from "../common/RatingCell";
import SliderControl from "../common/SliderControl";

function OverallRatingPanel() {
  const { draft, setDraft, loading } = useUserSettings();
  const [albumRating, setAlbumRating] = useState(8.0);
  const [weightedAverage, setWeightedAverage] = useState(7.5);
  const [displayExtraInfo, setDisplayExtraInfo] = useState(false);

  if (loading || !draft) return null;

  const blended = (
    albumRating * (1 - draft.average_rating_weight) +
    weightedAverage * draft.average_rating_weight
  );

  const handleWeightChange = (value) => {
    setDraft({
      ...draft,
      average_rating_weight: value
    });
  };

  const extraInfo = (
    <div className="info-box-inner">
      <p>
        The overall rating is a weighted blend between your manual album rating
        and the average of individual song ratings.
      </p>

      <p>
        <strong>Formula:</strong>
      </p>

      <code>
        Overall = Album × (1 − Weight) + Song Average × Weight
      </code>

      <ul>
        <li><strong>Weight = 0</strong> → Only the album rating matters.</li>
        <li><strong>Weight = 1</strong> → Only the song average matters.</li>
        <li><strong>Weight = 0.5</strong> → Equal influence.</li>
      </ul>

      <p>
        Use this if you want to control whether albums are judged holistically
        (vibe, cohesion, flow) or strictly by track-level consistency.
      </p>

    </div>
  );



  return (
    <div className="settings-panel">
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
        <h3>Overall Rating Calculation</h3>
        <button
          className="button button-info"
          onClick={() => setDisplayExtraInfo(prev => !prev)}
        >
          ❔
        </button>
      </div>
      <div className="settings-overall-rating-panel">
        {/* Weight Control */}
        <div className="slider-group">
          <SliderControl
            label="Average Rating Weight"
            value={draft.average_rating_weight}
            min={0}
            max={1}
            step={0.01}            
            onChange={handleWeightChange}
            description={
              "Controls how much the final score is influenced by the average of individual song ratings versus your manual album rating."
            }
          />
        </div>

        {/* Calculator */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <h4 style={{margin: 0}}>Overall Rating Calculation</h4>
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
      <div
        className={`extra-info ${displayExtraInfo ? "open" : ""}`}
      >
        {extraInfo}
      </div>
    </div>
  );
}

export default OverallRatingPanel;
