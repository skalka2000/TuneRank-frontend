import { getRatingColor } from "../../utils/ratingColors";

function RatingCell({ value, editable }) {
  if (value == null) return <span className="rating-value">—</span>;

  const color = getRatingColor(value);
  const percent = (value / 10) * 100;

  return (
    <div className="rating-cell">
      <div
        className="rating-bar"
        style={{ width: `${percent}%`, backgroundColor: color }}
      />
      {editable ?? (
        <span className="rating-value">{value.toFixed(2)}</span>
      )}
    </div>
  );
}


export default RatingCell;
