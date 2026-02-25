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
            checked={!column.getFilterValue()}
            onChange={() => column.setFilterValue(undefined)}
          />{" "}
          All
        </label>

        <label>
          <input
            type="radio"
            name="song_type"
            value="songs"
            checked={column.getFilterValue() === "songs"}
            onChange={() => column.setFilterValue("songs")}
          />{" "}
          Songs
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
