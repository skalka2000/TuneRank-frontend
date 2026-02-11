import { useUserSettings } from "../../context/SettingsContext";
import SliderControl from "../common/SliderControl";

function AverageRatingWeightPanel() {
  const { draft, setDraft, loading } = useUserSettings();

  if (loading || !draft) return null;

  return (
    <div className="settings-panel">
      <h3>Average Rating Weight</h3>

      <SliderControl
        label="Average Rating Weight"
        value={draft.average_rating_weight}
        onChange={(val) =>
          setDraft({ ...draft, average_rating_weight: val })
        }
        min={0}
        max={1}
        step={0.01}
        description="How much to take into account the album's rating vs. its weighted average. 0 = ignore avg, 1 = only avg."
      />
    </div>
  );
}

export default AverageRatingWeightPanel;
