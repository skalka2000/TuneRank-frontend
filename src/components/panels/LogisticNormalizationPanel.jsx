import { useUserSettings } from "../../context/SettingsContext";
import SliderControl from "../common/SliderControl";
import { useState } from "react";


function LogisticNormalizationPanel() {
  const { draft, setDraft, loading } = useUserSettings();
  const [displayExtraInfo, setDisplayExtraInfo] = useState(false);

  if (loading || !draft) return null;

  const extraInfo = (
    <div className="info-box-inner">
      <p>
        This stage reshapes the weighted average using a blend of linear
        rescaling and logistic normalization.
      </p>

      <p><strong>1. Greatness Threshold (μ)</strong></p>
      <p>
        Defines the score considered “great.” The curve pivots around this value.
        Scores above μ are amplified differently than scores below it.
      </p>

      <p><strong>2. Logistic Scaling</strong></p>

      <code>
        f(r) = 1 / (1 + e^(−k(r − μ)))
      </code>

      <p>
        The logistic curve compresses mid-tier ratings and increases separation
        near the extremes. Higher <strong>Steepness</strong> makes this transition sharper.
      </p>

      <p><strong>3. Final Blend</strong></p>

      <code>
        Adjusted = s × Logistic + (1 − s) × Linear
      </code>

      <ul>
        <li><strong>s = 0</strong> → Pure linear scaling</li>
        <li><strong>s = 1</strong> → Fully logistic curve</li>
      </ul>

      <p>
        The goal is to control how aggressively “great” albums separate from
        merely good ones without completely distorting the scale.
      </p>
    </div>
  );


  return (
    <div className="settings-panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Weighted Average Logistic Normalization</h3>
        <button
          className={`button button-info ${displayExtraInfo ? "active" : ""}`}
          onClick={() => setDisplayExtraInfo(prev => !prev)}
        >
          ❔
        </button>
      </div>

      <div className="slider-group">
        <SliderControl
          label="Greatness Threshold"
          value={draft.greatness_threshold}
          onChange={(val) => setDraft({ ...draft, greatness_threshold: val })}
          min={6}
          max={9}
          step={0.1}
          description="Pivot point of the curve. Ratings above this are treated as 'great'."
        />

        <SliderControl
          label="Scaling Factor"
          value={draft.scaling_factor}
          onChange={(val) => setDraft({ ...draft, scaling_factor: val })}
          min={0}
          max={0.8}
          step={0.01}
          description="Blends linear and logistic normalization."
        />

        <SliderControl
          label="Steepness Factor"
          value={draft.steep_factor}
          onChange={(val) => setDraft({ ...draft, steep_factor: val })}
          min={1}
          max={10}
          step={0.1}
          description="Controls how sharply the curve bends around the threshold."
        />
      </div>

      <div className={`extra-info ${displayExtraInfo ? "open" : ""}`}>
        {extraInfo}
      </div>
    </div>
  );
}

export default LogisticNormalizationPanel;
