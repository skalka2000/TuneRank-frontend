import { useSettings } from "../context/SettingsContext";

function AverageRatingWeightPanel() {
  const {
    averageRatingWeight,
    setAverageRatingWeight
  } = useSettings();

  return (
    <div style={panelStyle}>
      <h3 style={{ margin: 0 }}>Average Rating Weight</h3>

      <div>
        <label>
          Average Rating Weight: <strong>{(Math.floor(averageRatingWeight * 100) / 100).toFixed(2)}</strong>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={averageRatingWeight}
          onChange={(e) => setAverageRatingWeight(parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />
        <small>
          How much to take into account the album's rating vs. its weighted average . 0 = ignore avg, 1 = only avg.
        </small>
      </div>
    </div>
  );
}

const panelStyle = {
  padding: "1rem",
  border: "1px solid #ccc",
  borderRadius: "8px",
  maxWidth: "400px",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

export default AverageRatingWeightPanel;
