import { useSettings } from "../../context/SettingsContext";
import SliderControl from "../common/SliderControl";

function WeightedAveragePanel() {
  const { power, setPower } = useSettings();

  return (
    <div className = "settings-panel">
      <h3>Weighted Average Rating</h3>
        <SliderControl
          label="Power"
          value={power}
          onChange={setPower}
          min={0}
          max={4}
          step={0.1}
          description="0 = equal weight, higher = emphasize high ratings"
        />
    </div>
  );
}

export default WeightedAveragePanel;
