import { useSettings } from "../context/SettingsContext";

function Settings() {
  const { power, setPower } = useSettings();

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", maxWidth: "400px" }}>
      <label>
        Weighted Avg. Power: <strong>{power}</strong>
      </label>
      <input
        type="range"
        min="0"
        max="4"
        step="0.1"
        value={power}
        onChange={(e) => setPower(parseFloat(e.target.value))}
        style={{ width: "100%" }}
      />
      <small>0 = equal weight, higher = favor high ratings</small>
    </div>
  );
}

export default Settings;
