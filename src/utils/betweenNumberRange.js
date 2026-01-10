export function betweenNumberRange(row, columnId, value) {
  const num = row.getValue(columnId);
  const [min, max] = value;
  if (typeof num !== "number") return false;
  return (min === undefined || num >= min) && (max === undefined || num <= max);
};
