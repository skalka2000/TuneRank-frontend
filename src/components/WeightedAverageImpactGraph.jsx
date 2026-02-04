import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { useSettings } from "../context/SettingsContext";

function WeightedAverageImpactGraph() {
  const { power } = useSettings();
  const [avgRating, setAvgRating] = useState(7.5);
  const [songCount, setSongCount] = useState(10);
  const [isInterlude, setIsInterlude] = useState(false);

  const data = useMemo(() => {
    const baseRatings = Array(songCount).fill(avgRating);

    const simulate = (newRating) => {
      const ratings = [...baseRatings];
      const weights = baseRatings.map(() => 1.0); // full weight

      // Add new rating
      const weight = isInterlude ? 0.5 : 1.0;
      ratings.push(newRating);
      weights.push(weight * Math.pow(Math.max(newRating,6), power));

      // Original weights (apply power)
      const poweredWeights = baseRatings.map(r => Math.pow(r, power));
      const totalWeights = [...poweredWeights, weights[weights.length - 1]];

      const numerator = ratings.reduce((sum, r, i) => sum + r * totalWeights[i], 0);
      const denominator = totalWeights.reduce((sum, w) => sum + w, 0);

      return +(numerator / denominator).toFixed(2);
    };

    return Array.from({ length: 91 }, (_, i) => {
      const newRating = 1 + i * 0.1;
      return {
        rating: +newRating.toFixed(2),
        result: simulate(newRating)
      };
    });
  }, [avgRating, songCount, isInterlude, power]);

  return (
    <div style={{ width: "600px", height: "400px", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h4>📊 Weighted Avg Sensitivity (1 New Song)</h4>

      {/* Inputs */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <label>
          Avg Rating:
          <input
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
            type="number"
            value={songCount}
            min={1}
            step={1}
            onChange={(e) => setSongCount(parseInt(e.target.value))}
            style={{ width: "60px", marginLeft: "0.5rem" }}
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={isInterlude}
            onChange={(e) => setIsInterlude(e.target.checked)}
            style={{ marginRight: "0.3rem" }}
          />
          Interlude
        </label>
      </div>

      {/* Graph */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="rating"
            domain={[1, 10]}
            ticks={[...Array(19)].map((_, i) => +(1 + i * 0.5).toFixed(1))}
            label={{ value: "New Song Rating", position: "insideBottomRight", offset: -5 }}
          />

          <YAxis
            domain={[1, 10]}
            ticks={[...Array(19)].map((_, i) => +(1 + i * 0.5).toFixed(1))}
            label={{ value: "New Weighted Avg", angle: -90, position: "insideLeft" }}
          />

          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="result"
            stroke="#ff7300"
            strokeWidth={2}
            dot={false}
            name="Weighted Avg"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeightedAverageImpactGraph;
