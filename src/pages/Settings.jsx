import NormalizationGraph from "../components/graphs/NormalizationGraph";
import WeightedAveragePanel from "../components/panels/WeightedAveragePanel";
import LogisticNormalizationPanel from "../components/panels/LogisticNormalizationPanel";
import WeightedAverageImpactGraph from "../components/graphs/WeightedAverageImpactGraph";
import AverageRatingWeightPanel from "../components/panels/AverageRatingWeightPanel";
import AverageRatingBlender from "../components/panels/AverageRatingBlenderPanel";

function Settings() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>⚙️ Settings</h2>
        <div className = "settings-section" style={{alignItems: "center", justifyContent: "space-between"}}>
            <AverageRatingWeightPanel/>
            <AverageRatingBlender />
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
