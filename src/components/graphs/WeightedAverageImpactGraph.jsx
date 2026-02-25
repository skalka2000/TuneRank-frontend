import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useUserSettings } from "../../context/SettingsContext";
import { useIsMobile } from "../../hooks/useIsMobile";

function WeightedAverageImpactGraph() {
  const { draft } = useUserSettings();

  const power = draft.average_power;
  const interludeWeight = draft.interlude_weight;
  const epicWeight = draft.epic_weight;

  const [avgRating, setAvgRating] = useState(7.5);
  const [songCount, setSongCount] = useState(10);
  const [songType, setSongType] = useState("song");

  const isMobile = useIsMobile();

  const data = useMemo(() => {
    const baseRatings = Array(songCount).fill(avgRating);

    const baseWeightForType = () => {
      if (songType === "interlude") return interludeWeight;
      if (songType === "epic") return epicWeight;
      return 1.0;
    };

    const simulate = (newRating) => {
      const ratings = [...baseRatings];

      const newSongWeight =
        baseWeightForType() * Math.pow(Math.max(newRating, 6), power);

      ratings.push(newRating);

      // Existing songs get weight = max(r,6)^power (baseWeight=1.0)
      const poweredWeights = baseRatings.map((r) => Math.pow(Math.max(r, 6), power));
      const totalWeights = [...poweredWeights, newSongWeight];

      const numerator = ratings.reduce((sum, r, i) => sum + r * totalWeights[i], 0);
      const denominator = totalWeights.reduce((sum, w) => sum + w, 0);

      return +(numerator / denominator).toFixed(2);
    };

    return Array.from({ length: 91 }, (_, i) => {
      const newRating = 1 + i * 0.1;
      return {
        rating: +newRating.toFixed(2),
        result: simulate(newRating),
      };
    });
  }, [avgRating, songCount, songType, power, interludeWeight, epicWeight]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        height: "450px",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        margin: "0 auto",
      }}
    >
      <h4>📈 Weighted Average Sensitivity (1 New Song)</h4>

      {/* Inputs */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <label>
          Weighted Avg Rating:
          <input
            className="input-simple input-small"
            type="number"
            value={avgRating}
            min={1}
            max={10}
            step={0.1}
            onChange={(e) => setAvgRating(parseFloat(e.target.value))}
            style={{ width: "60px", marginLeft: "0.5rem" }}
          />
        </label>

        <label>
          Song Count:
          <input
            className="input-simple input-small"
            type="number"
            value={songCount}
            min={1}
            step={1}
            onChange={(e) => setSongCount(parseInt(e.target.value, 10))}
            style={{ width: "60px", marginLeft: "0.5rem" }}
          />
        </label>

        <label className="checkbox-label type-selector">
          <span>Type: </span>
          <select
            className="input-simple"
            value={songType}
            onChange={(e) => setSongType(e.target.value)}
          >
            <option value="song">Song</option>
            <option value="interlude">Interlude</option>
            <option value="epic">Epic</option>
          </select>
        </label>
      </div>

      {/* Graph */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="rating"
            domain={[1, 10]}
            ticks={
              isMobile
                ? [...Array(10)].map((_, i) => i + 1)
                : [...Array(19)].map((_, i) => +(1 + i * 0.5).toFixed(1))
            }
            label={{
              value: "New Song Rating",
              position: "insideBottomRight",
              offset: -5,
            }}
          />

          <YAxis
            domain={[1, 10]}
            ticks={[...Array(19)].map((_, i) => +(1 + i * 0.5).toFixed(1))}
            label={{
              value: "New Weighted Avg",
              angle: -90,
              position: "insideLeft",
              dy: 30,
            }}
          />

          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="result"
            stroke="#ff7300"
            strokeWidth={2}
            dot={false}
            name="Weighted Average"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeightedAverageImpactGraph;
