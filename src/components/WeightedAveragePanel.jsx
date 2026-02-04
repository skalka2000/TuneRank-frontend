import { useSettings } from "../context/SettingsContext";

function WeightedAveragePanel() {
  const { power, setPower } = useSettings();

  return (
    <div style={panelStyle}>
      <h3 style={{ margin: 0 }}>Weighted Average Rating</h3>
      <div>
        <label>
          Power: <strong>{power.toFixed(2)}</strong>
        </label>
        <input
          type="range"
          min={0}
          max={4}
          step={0.1}
          value={power}
          onChange={(e) => setPower(parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />
        <small>0 = equal weight, higher = emphasize high ratings</small>
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

export default WeightedAveragePanel;
