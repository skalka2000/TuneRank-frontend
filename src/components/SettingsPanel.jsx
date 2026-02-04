import { useSettings } from "../context/SettingsContext";

function SettingsPanel() {
  const {
    power, setPower,
    greatnessThreshold, setGreatnessThreshold,
    scalingFactor, setScalingFactor,
    steepFactor, setSteepFactor
  } = useSettings();

  const panelStyle = {
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginBottom: "2rem",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const sliderBlock = (label, value, setValue, min, max, step, description, precision = 2) => (
    <div>
      <label>
        {label}: <strong>{value.toFixed(precision)}</strong>
      </label>
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

  return (
    <>
      {/* Weighted Average Panel */}
      <div style={panelStyle}>
        <h3 style={{ margin: 0 }}>Weighted Average</h3>
        {sliderBlock(
          "Power",
          power,
          setPower,
          0,
          4,
          0.1,
          "0 = equal weight, higher = emphasize high ratings"
        )}
      </div>

      {/* Logistic Normalization Panel */}
      <div style={panelStyle}>
        <h3 style={{ margin: 0 }}>Logistic Normalization</h3>
        {sliderBlock(
          "Greatness Threshold",
          greatnessThreshold,
          setGreatnessThreshold,
          6,
          9,
          0.1,
          "Score at which a rating is considered 'great'. For optimal effects set between 7.5 and 8.5."
        )}
        {sliderBlock(
          "Scaling Factor",
          scalingFactor,
          setScalingFactor,
          0,
          1,
          0.05,
          "0 = linear scaling, 1 = full logistic"
        )}
        {sliderBlock(
          "Steepness Factor",
          steepFactor,
          setSteepFactor,
          1,
          10,
          0.1,
          "Controls how sharp the logistic curve is"
        )}
      </div>
    </>
  );
}

export default SettingsPanel;
