import NormalizationGraph from "../components/graphs/NormalizationGraph";
import WeightedAveragePanel from "../components/panels/WeightedAveragePanel";
import LogisticNormalizationPanel from "../components/panels/LogisticNormalizationPanel";
import WeightedAverageImpactGraph from "../components/graphs/WeightedAverageImpactGraph";
import OverallRatingPanel from "../components/panels/OverallRatingPanel";
import { useUserSettings } from "../context/SettingsContext";
import { useEffect, useState } from "react";
import LoadingOverlay from "../components/common/LoadingOverlay";
import { showSuccessCheckmark, showErrorX } from "../utils/specialEffects";

const SCORING_PROFILES = {
  custom: {
    name: "Custom",
    description: "Manual configuration. Adjust settings freely.",
    values: null
  },
  balanced: {
    name: "Balanced",
    description: "Moderate weighting, soft normalization. Analytical but fair.",
    values: {
      average_rating_weight: 0.5,
      average_power: 1.5,
      greatness_threshold: 8.0,
      scaling_factor: 0.3,
      steep_factor: 4,
      interlude_weight: 0.5,

    }
  },

  consistency: {
    name: "Consistency Focused",
    description: "Rewards albums that are strong front-to-back.",
    values: {
      average_rating_weight: 0.8,
      average_power: 1.0,
      greatness_threshold: 8.0,
      scaling_factor: 0.3,
      steep_factor: 3,
      interlude_weight: 0.5
    }
  },

  peak: {
    name: "Peak Emphasis",
    description: "High ratings dominate. Standout tracks matter most.",
    values: {
      average_rating_weight: 0.7,
      average_power: 3.0,
      greatness_threshold: 7.5,
      scaling_factor: 0.4,
      steep_factor: 7,
      interlude_weight: 0.5,
    }
  },

  purist: {
    name: "Linear Purist",
    description: "Minimal distortion. Mostly linear scoring.",
    values: {
      average_rating_weight: 0.5,
      average_power: 0.0,
      greatness_threshold: 8.0,
      scaling_factor: 0.0,
      steep_factor: 1,
      interlude_weight: 0.5,

    }
  }
};

function Settings() {
  const { settings, saveSettings, draft, setDraft, loading } = useUserSettings();
  const [selectedProfile, setSelectedProfile] = useState("balanced");

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

  useEffect(() => {
    if (!draft) return;

    const matchesProfile = Object.entries(SCORING_PROFILES).find(
      ([key, profile]) => {
        if (!profile.values || key === "custom") return false;

        return Object.entries(profile.values).every(
          ([settingKey, value]) => draft[settingKey] === value
        );
      }
    );

    if (matchesProfile) {
      setSelectedProfile(matchesProfile[0]);
    } else {
      setSelectedProfile("custom");
    }
  }, [draft]);

  if (loading || !settings || !draft)
    return <LoadingOverlay message="Loading settings..." />;

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>⚙️ Settings</h2>
        <button onClick={handleSave} className="button">
          Save Settings
        </button>
      </div>
      <div className="scoring-profile-section">
        <h3>Default Scoring Profile</h3>

        <div className="profile-selector">
        <select
          className="input-simple"
          value={selectedProfile}
          onChange={(e) => {
            const key = e.target.value;
            setSelectedProfile(key);

            if (key === "custom") {
              if (!settings) return;
              setDraft({ ...settings });
              return;
            }

            const profile = SCORING_PROFILES[key];

            setDraft({
              ...draft,
              ...profile.values
            });
          }}
        >

          {Object.entries(SCORING_PROFILES).map(([key, profile]) => (
            <option key={key} value={key}>
              {profile.name}
            </option>
          ))}
        </select>

        </div>

        <p className="profile-description">
          {SCORING_PROFILES[selectedProfile].description}
        </p>
      </div>

      <div className="settings-section">
        <OverallRatingPanel />
      </div>

      <div className="settings-section" style={{alignItems: "flex-start" }}>
        <WeightedAveragePanel />
        <WeightedAverageImpactGraph />
      </div>

      <div className="settings-section" style={{alignItems: "flex-start" }}>
        <LogisticNormalizationPanel />
        <NormalizationGraph />
      </div>
    </div>
  );
}

export default Settings;
