import { useUserSettings } from "../../context/SettingsContext";
import SliderControl from "../common/SliderControl";

function LogisticNormalizationPanel() {
  const { draft, setDraft, loading } = useUserSettings();

  if (loading || !draft) return null;

  return (
    <div className="settings-panel">
      <h3>Weighted Average Logistic Normalization</h3>
      <div className="slider-group">
        <SliderControl
          label="Greatness Threshold"
          value={draft.greatness_threshold}
          onChange={(val) => setDraft({ ...draft, greatness_threshold: val })}
          min={6}
          max={9}
          step={0.1}
          description="Score at which a rating is considered 'great'. For optimal effects set between 7.5 and 8.5."
        />
        <SliderControl
          label="Scaling Factor"
          value={draft.scaling_factor}
          onChange={(val) => setDraft({ ...draft, scaling_factor: val })}
          min={0}
          max={1}
          step={0.05}
          description="0 = linear scaling, 1 = full logistic"
        />
        <SliderControl
          label="Steepness Factor"
          value={draft.steep_factor}
          onChange={(val) => setDraft({ ...draft, steep_factor: val })}
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
