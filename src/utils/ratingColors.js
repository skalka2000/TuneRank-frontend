export function getRatingColor(value) {
  if (value == null || isNaN(value)) return "#ccc";

  if (value === 11) {
    return "#D946EF"; // special outlier color
  }

  const clamped = Math.max(0, Math.min(10, value));

  // Adjusted hue mapping:
  // 0 → hue 0 (red)
  // 5 → hue 40 (orange-yellow)
  // 7 → hue 70 (yellow-green)
  // 10 → hue 120 (green)
  let hue;
  if (clamped <= 5) {
    hue = 0 + (clamped / 5) * 40; // red to yellow-orange
  } else if (clamped <= 7) {
    hue = 40 + ((clamped - 5) / 2) * 30; // yellow-orange to yellow-green
  } else {
    hue = 70 + ((clamped - 7) / 3) * 50; // yellow-green to lime-green
  }

  const saturation = 100;
  const lightness = 40;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
