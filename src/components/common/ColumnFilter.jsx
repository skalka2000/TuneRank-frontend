import RangeFilter from "./RangeFilter";

function ColumnFilter({ column }) {
  const columnId = column.id;

  if (["rating", "track_number", "year", "average_rating", "overall_rating"].includes(columnId)) {
    return <RangeFilter column={column} />;
  }

  if (columnId === "song_type") {
    return (
      <div className="table-filter-radio-input">
        <label>
          <input
            type="radio"
            name="song_type"
            value="all"
            checked={!column.getFilterValue() || column.getFilterValue() === "all"}
            onChange={() => column.setFilterValue("all")}
          />{" "}
          All
        </label>

        <label>
          <input
            type="radio"
            name="song_type"
            value="song"
            checked={column.getFilterValue() === "song"}
            onChange={() => column.setFilterValue("song")}
          />{" "}
          Songs
        </label>

        <label>
          <input
            type="radio"
            name="song_type"
            value="interlude"
            checked={column.getFilterValue() === "interlude"}
            onChange={() => column.setFilterValue("interlude")}
          />{" "}
          Interludes
        </label>

        <label>
          <input
            type="radio"
            name="song_type"
            value="epic"
            checked={column.getFilterValue() === "epic"}
            onChange={() => column.setFilterValue("epic")}
          />{" "}
          Epics
        </label>
      </div>
    );
  }

  return (
    <input
      type="text"
      value={column.getFilterValue() ?? ""}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`filter ${columnId}`}
      className="table-filter-input"
    />
  );
}

export default ColumnFilter;
