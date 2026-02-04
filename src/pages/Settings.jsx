import NormalizationGraph from "../components/NormalizationGraph";
import SettingsPanel from "../components/SettingsPanel";
import WeightedAveragePanel from "../components/WeightedAveragePanel";
import LogisticNormalizationPanel from "../components/LogisticNormalizationPanel";
import WeightedAverageImpactGraph from "../components/WeightedAverageImpactGraph";
import AverageRatingWeightPanel from "../components/AverageRatingWeightPanel";

function Settings() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>⚙️ Settings</h2>
        <div className = "settings-section">
            <AverageRatingWeightPanel/>
        </div>
        <div className = "settings-section">
            <WeightedAveragePanel/>
            <WeightedAverageImpactGraph />
        </div>
        <div className = "settings-section">
            <LogisticNormalizationPanel />
            <NormalizationGraph />
        </div>
    </div>
  );
}

export default Settings;
