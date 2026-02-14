import { useUserSettings } from "../../context/SettingsContext";
import SliderControl from "../common/SliderControl";
import { useState } from "react";

function WeightedAveragePanel() {
  const { draft, setDraft, loading } = useUserSettings();
  const [displayExtraInfo, setDisplayExtraInfo] = useState(false);

  if (loading || !draft) return null;

  const handlePowerChange = (value) => {
    setDraft({
      ...draft,
      average_power: value
    });
  };

const extraInfo = (
  <div className="info-box-inner">
    <p>
      The <strong>Power</strong> value controls how strongly higher-rated songs
      dominate the weighted average.
    </p>

    <p><strong>Weight calculation:</strong></p>

    <code>
      weight = baseWeight × max(rating, 6)^power
    </code>

    <ul>
      <li><strong>baseWeight = 1</strong> (normal song)</li>
      <li><strong>baseWeight = 0.5</strong> (interlude)</li>
      <li><strong>Power = 0</strong> → All songs equal weight</li>
      <li><strong>Higher Power</strong> → High ratings dominate</li>
    </ul>

    <p>
      Final average:
    </p>

    <code>
      Weighted Avg = Σ(rating × weight) / Σ(weight)
    </code>

    <p>
      The max(rating, 6) floor prevents low ratings from becoming mathematically
      insignificant when power is high.
    </p>
  </div>
);

return (
  <div className="settings-panel">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h3>Weighted Average Rating</h3>
      <button
        className={`button button-info ${displayExtraInfo ? "active" : ""}`}
        onClick={() => setDisplayExtraInfo(prev => !prev)}
      >
        ❔
      </button>
    </div>

      <SliderControl
        label="Power"
        value={draft.average_power}
        onChange={handlePowerChange}
        min={0}
        max={4}
        step={0.1}
        description="Controls how strongly higher-rated songs influence the weighted average."
      />

      <div className={`extra-info ${displayExtraInfo ? "open" : ""}`}>
        {extraInfo}
      </div>
    </div>
  );
}

export default WeightedAveragePanel;