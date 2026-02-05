import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

function binRatings(data, accessor, step, type) {
  const bins = {};

  if (type === "continuous") {
    const max = 10;
    const min = 1;

    // Initialize bins from 10 down, but store them in correct ascending order
    const binEdges = [];
    for (let val = max; val >= min; val -= step) {
      const bin = parseFloat(val.toFixed(2));
      binEdges.push(bin);
      bins[bin.toFixed(2)] = 0;
    }

    for (const item of data) {
      const val = accessor(item);
      if (val == null || isNaN(val)) continue;

      // Clamp value within range and find appropriate bin
      const clamped = Math.max(min, Math.min(max, val));
      const floored = Math.floor((clamped - min) / step) * step + min;
      const bin = parseFloat(floored.toFixed(2));
      const key = bin.toFixed(2);
      if (key in bins) {
        bins[key]++;
      }
    }

    return binEdges
      .map((bin) => ({
        bin,
        count: bins[bin.toFixed(2)] || 0,
      }))
      .sort((a, b) => a.bin - b.bin); // ascending for display
  }

  // Discrete mode
  for (const item of data) {
    const val = accessor(item);
    if (val == null || isNaN(val)) continue;
    const bin = (Math.floor(val / step) * step).toFixed(2);
    bins[bin] = (bins[bin] || 0) + 1;
  }

  return Object.entries(bins)
    .map(([bin, count]) => ({ bin: parseFloat(bin), count }))
    .sort((a, b) => a.bin - b.bin); // ascending
}

export default function RatingDistributionChart({
  data,
  valueAccessor,
  type = "continuous",
  step = 1,
}) {
  const chartData = useMemo(() => {
    return binRatings(data, valueAccessor, step, type);
  }, [data, valueAccessor, step, type]);

  const isMobile = useIsMobile()

  const ticks = isMobile
    ? [...Array(10)].map((_, i) => i + 1)
    : [...Array(39)].map((_, i) => +(1 + i * 0.25).toFixed(1));

  const ticksFormatter = isMobile
    ? (v) => v.toFixed(0)
    : (v) => v.toFixed(2)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="bin"
          ticks={ticks}
          tickFormatter={ticksFormatter}
          domain={[0, 10]}
        />
        <YAxis allowDecimals={false} />
        <Tooltip
        formatter={(value, name, props) => {
            const total = data.length;
            const percentage = ((value / total) * 100).toFixed(1);
            return [`${value} (${percentage}%)`, "Count"];
        }}
        />
        <Bar dataKey="count" fill="#D946EF" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
