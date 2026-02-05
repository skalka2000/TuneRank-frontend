import { useSettings } from "../../context/SettingsContext";
import SliderControl from "../common/SliderControl";

function AverageRatingWeightPanel() {
  const {
    averageRatingWeight,
    setAverageRatingWeight
  } = useSettings();

  return (
    <div className="settings-panel">
      <h3>Average Rating Weight</h3>

      <SliderControl
        label="Average Rating Weight"
        value={averageRatingWeight}
        onChange={setAverageRatingWeight}
        min={0}
        max={1}
        step={0.01}
        description="How much to take into account the album's rating vs. its weighted average. 0 = ignore avg, 1 = only avg."
      />
    </div>
  );
}

export default AverageRatingWeightPanel;
