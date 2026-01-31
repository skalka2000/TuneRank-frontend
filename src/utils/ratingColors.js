export function getRatingColor(value) {
  if (value == null || isNaN(value)) return "#ccc";

  if (value === 11) {
    return "#D946EF"; // distinct purple for outlier
  }

  const clamped = Math.max(0, Math.min(10, value));

  // Hue goes from deep red (0) → orange → lime → neon green (~140)
  const hue = 10 + (clamped / 10) * 130; // hue range: 10–140
  const saturation = 100; // max vividness
  const lightness = 40; // deeper base for contrast

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
