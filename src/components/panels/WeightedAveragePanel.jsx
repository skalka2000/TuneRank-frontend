import { useUserSettings } from "../../context/SettingsContext";
import SliderControl from "../common/SliderControl";

function WeightedAveragePanel() {
  const { draft, setDraft, loading } = useUserSettings();

  if (loading || !draft) return null;

  const handlePowerChange = (value) => {
    setDraft({
      ...draft,
      average_power: value
    });
  };

  return (
    <div className="settings-panel">
      <h3>Weighted Average Rating</h3>

      <SliderControl
        label="Power"
        value={draft.average_power}
        onChange={handlePowerChange}
        min={0}
        max={4}
        step={0.1}
        description="0 = equal weight, higher = emphasize high ratings"
      />
    </div>
  );
}

export default WeightedAveragePanel;