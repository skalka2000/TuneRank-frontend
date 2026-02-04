import { useSettings } from "../context/SettingsContext";

function LogisticNormalizationPanel() {
  const {
    greatnessThreshold, setGreatnessThreshold,
    scalingFactor, setScalingFactor,
    steepFactor, setSteepFactor
  } = useSettings();

  return (
    <div style={panelStyle}>
      <h3 style={{ margin: 0 }}>Weighted Average Logistic Normalization</h3>

      {slider("Greatness Threshold", greatnessThreshold, setGreatnessThreshold, 6, 9, 0.1,
        "Score at which a rating is considered 'great'. For optimal effects set between 7.5 and 8.5.")}

      {slider("Scaling Factor", scalingFactor, setScalingFactor, 0, 1, 0.05,
        "0 = linear scaling, 1 = full logistic")}

      {slider("Steepness Factor", steepFactor, setSteepFactor, 1, 10, 0.1,
        "Controls how sharp the logistic curve is")}
    </div>
  );
}

const slider = (label, value, setValue, min, max, step, description) => (
  <div>
    <label>{label}: <strong>{value.toFixed(2)}</strong></label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => setValue(parseFloat(e.target.value))}
      style={{ width: "100%" }}
    />
    <small>{description}</small>
  </div>
);

const panelStyle = {
  padding: "1rem",
  border: "1px solid #ccc",
  borderRadius: "8px",
  maxWidth: "400px",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

export default LogisticNormalizationPanel;
