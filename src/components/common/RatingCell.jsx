import { getRatingColor } from "../../utils/ratingColors";

function RatingCell({ value, editable, precision }) {
  if (value == null) return <span className="rating-value">—</span>;

  const color = getRatingColor(value);
  const percent = (value / 10) * 100;

  const display =
    precision !== undefined
      ? value.toFixed(precision)
      : value;

  return (
    <div className="rating-cell">
      <div
        className="rating-bar"
        style={{ width: `${percent}%`, backgroundColor: color }}
      />
      {editable ?? (
        <span className="rating-value">{display}</span>
      )}
    </div>
  );
}

export default RatingCell;
