import { useSettings } from "../../context/SettingsContext";
import SliderControl from "../common/SliderControl";

function LogisticNormalizationPanel() {
  const {
    greatnessThreshold, setGreatnessThreshold,
    scalingFactor, setScalingFactor,
    steepFactor, setSteepFactor
  } = useSettings();

  return (
    <div className = "settings-panel">
      <h3>Weighted Average Logistic Normalization</h3>
        <div className="slider-group">
          <SliderControl
            label="Greatness Threshold"
            value={greatnessThreshold}
            onChange={setGreatnessThreshold}
            min={6}
            max={9}
            step={0.1}
            description="Score at which a rating is considered 'great'. For optimal effects set between 7.5 and 8.5."
          />
          <SliderControl
            label="Scaling Factor"
            value={scalingFactor}
            onChange={setScalingFactor}
            min={0}
            max={1}
            step={0.05}
            description="0 = linear scaling, 1 = full logistic"
          />
          <SliderControl
            label="Steepness Factor"
            value={steepFactor}
            onChange={setSteepFactor}
            min={1}
            max={10}
            step={0.1}
            description="Controls how sharp the logistic curve is"
          />
      </div>
    </div>
  );
}

export default LogisticNormalizationPanel;
