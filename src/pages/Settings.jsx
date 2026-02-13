import NormalizationGraph from "../components/graphs/NormalizationGraph";
import WeightedAveragePanel from "../components/panels/WeightedAveragePanel";
import LogisticNormalizationPanel from "../components/panels/LogisticNormalizationPanel";
import WeightedAverageImpactGraph from "../components/graphs/WeightedAverageImpactGraph";
import AverageRatingWeightPanel from "../components/panels/AverageRatingWeightPanel";
import AverageRatingBlender from "../components/panels/AverageRatingBlenderPanel";
import { useUserSettings } from "../context/SettingsContext";
import { useEffect } from "react";
import LoadingOverlay from "../components/common/LoadingOverlay";
import { showSuccessCheckmark, showErrorX } from "../utils/specialEffects";

function Settings() {
  const { settings, saveSettings, draft, setDraft, loading } = useUserSettings();

  const handleSave = async () => {
    try {
      await saveSettings(draft);
      showSuccessCheckmark();
    } catch (err) {
      showErrorX()
      console.error(err);
    }
  };

  useEffect(() => {
    // Reset draft every time user navigates back to this page
    if (settings) {
      setDraft(settings);
    }
  }, [settings, setDraft]);

  if (loading || !settings) return <LoadingOverlay message="Loading settings..." />;;

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>⚙️ Settings</h2>
        <button onClick={handleSave} className="button">
          Save Settings
        </button>
      </div>


      <div className="settings-section" style={{ alignItems: "center", justifyContent: "space-between" }}>
        <AverageRatingWeightPanel />
        <AverageRatingBlender />
      </div>

      <div className="settings-section">
        <WeightedAveragePanel />
        <WeightedAverageImpactGraph />
      </div>

      <div className="settings-section">
        <LogisticNormalizationPanel />
        <NormalizationGraph />
      </div>
    </div>
  );
}

export default Settings;
