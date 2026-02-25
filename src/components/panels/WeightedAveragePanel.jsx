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
      average_power: value,
    });
  };

  const extraInfo = (
    <div className="info-box-inner">
      <p>
        The weighted average amplifies or suppresses songs based on rating,
        track type, and exponent scaling.
      </p>

      <p><strong>Weight Formula:</strong></p>

      <code>
        weight = baseWeight × max(rating, 6)^power
      </code>

      <ul>
        <li><strong>baseWeight</strong> = 1.0 (song)</li>
        <li><strong>baseWeight</strong> = interlude weight (interlude)</li>
        <li><strong>baseWeight</strong> = epic weight (epic)</li>
        <li>
          A floor of 6 prevents low ratings from becoming mathematically
          insignificant when power is high.
        </li>
        <li><strong>power</strong> controls how aggressively high ratings dominate</li>
      </ul>

      <p><strong>Final Calculation:</strong></p>

      <code>
        Weighted Avg = Σ(rating × weight) / Σ(weight)
      </code>

      <p>
        Higher power exaggerates standout tracks.  
        Lower interlude weight minimizes structural filler impact.  
        Higher epic weight boosts “centerpiece” tracks.
      </p>
    </div>
  );

  return (
    <div className="settings-panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Weighted Average Rating</h3>
        <button
          className={`button button-info ${displayExtraInfo ? "active" : ""}`}
          onClick={() => setDisplayExtraInfo((prev) => !prev)}
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

      <SliderControl
        label="Interlude Weight"
        value={draft.interlude_weight}
        onChange={(val) => setDraft({ ...draft, interlude_weight: val })}
        min={0}
        max={1}
        step={0.05}
        description="Base multiplier applied to interludes before power weighting."
      />

      <SliderControl
        label="Epic Weight"
        value={draft.epic_weight}
        onChange={(val) => setDraft({ ...draft, epic_weight: val })}
        min={1}
        max={4}
        step={0.1}
        description="Base multiplier applied to epic tracks before power weighting."
      />

      <div className={`extra-info ${displayExtraInfo ? "open" : ""}`}>
        {extraInfo}
      </div>
    </div>
  );
}

export default WeightedAveragePanel;