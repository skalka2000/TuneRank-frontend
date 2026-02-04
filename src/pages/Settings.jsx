import NormalizationGraph from "../components/NormalizationGraph";
import SettingsPanel from "../components/SettingsPanel";
import WeightedAveragePanel from "../components/WeightedAveragePanel";
import LogisticNormalizationPanel from "../components/LogisticNormalizationPanel";
import WeightedAverageImpactGraph from "../components/WeightedAverageImpactGraph";

function Settings() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>⚙️ Settings</h2>
        <div style={{marginBottom: "2rem", display: "flex", gap: "2rem", alignItems: "flex-start"}}>
            <WeightedAveragePanel/>
            <WeightedAverageImpactGraph />
        </div>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <LogisticNormalizationPanel />
        <NormalizationGraph />
      </div>
    </div>
  );
}

export default Settings;
