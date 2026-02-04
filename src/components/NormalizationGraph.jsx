import { useMemo } from "react";
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
import { useIsMobile } from "../hooks/useIsMobile";

function NormalizationGraph() {
  const {
    greatnessThreshold,
    scalingFactor,
    steepFactor,
  } = useSettings();

  const isMobile = useIsMobile()

  const ticks = isMobile
    ? [...Array(10)].map((_, i) => i + 1)
    : [...Array(19)].map((_, i) => +(1 + i * 0.5).toFixed(1));

  const data = useMemo(() => {
    const rescaleLinear = (r, mu) => {
      if (r === mu) return mu;
      if (r > mu) return mu + ((r - mu) / (10 - mu)) * (10 - mu);
      return (r / mu) * mu;
    };

    const logisticScaling = (r, mu, steep) => {
      const rightSteep = steep;
      const leftSteep = steep * (10 - mu) / mu;

      if (r < mu) {
        return 1 + (2 * (mu - 1)) / (1 + Math.exp(-leftSteep * (r - mu)));
      } else if (r > mu) {
        return mu - (10 - mu) + (2 * (10 - mu)) / (1 + Math.exp(-rightSteep * (r - mu)));
      } else {
        return mu;
      }
    };

    const rawScores = Array.from({ length: 181 }, (_, i) => 1 + i * 0.05);

    return rawScores.map(raw => {
      const linear = rescaleLinear(raw, greatnessThreshold);
      const logistic = logisticScaling(raw, greatnessThreshold, steepFactor);
      const blended = scalingFactor * logistic + (1 - scalingFactor) * linear;

      return {
        raw: Number(raw.toFixed(2)),
        adjusted: Number(blended.toFixed(2)),
        identity: Number(raw.toFixed(2)) // y = x
      };
    });
  }, [greatnessThreshold, scalingFactor, steepFactor]);

  return (
    <div style={{ width: "100%", maxWidth: "600px", height: "400px", margin: "0 auto" }}>
      <h4 style={{ marginBottom: "1rem" }}>🎵 Weighted Average Rating Adjustment Curve</h4>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="raw"
            domain={[1, 10]}
            ticks={ticks}
            label={{
              value: "Raw Weighted Avg",
              position: "insideBottomRight",
              offset: -5
            }}
          />

          <YAxis
            domain={[1, 10]}
            ticks={ticks}
            label={{
              value: "Adjusted Score",
              angle: -90,
              position: "insideLeft"
            }}
          />

          <Tooltip />
          <Legend />

          {/* Identity reference line y = x */}
          <Line
            type="monotone"
            dataKey="identity"
            stroke="#999"
            strokeDasharray="4 4"
            dot={false}
            isAnimationActive={false}
            name="Raw (y = x)"
          />

          {/* Adjusted curve */}
          <Line
            type="monotone"
            dataKey="adjusted"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
            name="Adjusted Rating"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default NormalizationGraph;
