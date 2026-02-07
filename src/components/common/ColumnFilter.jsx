import RangeFilter from "./RangeFilter";

function ColumnFilter({ column }) {
  const columnId = column.id;

  if (["rating", "track_number", "year", "average_rating", "overall_rating"].includes(columnId)) {
    return <RangeFilter column={column} />;
  }

  if (columnId === "is_interlude") {
    return (
      <div className = "table-interlude-filter">
        <label>
          <input
            type="radio"
            name="interlude"
            value="all"
            checked={!column.getFilterValue()}
            onChange={() => column.setFilterValue(undefined)}
          /> All
        </label>
        <label>
          <input
            type="radio"
            name="interlude"
            value="no"
            checked={column.getFilterValue() === "no"}
            onChange={() => column.setFilterValue("no")}
          /> Songs
        </label>
        <label>
          <input
            type="radio"
            name="interlude"
            value="yes"
            checked={column.getFilterValue() === "yes"}
            onChange={() => column.setFilterValue("yes")}
          /> Interludes
        </label>
      </div>
    );
  }

  return (
    <input
      type="text"
      value={column.getFilterValue() ?? ""}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`${columnId} filter`}
      className="table-filter-text"
    />
  );
}

export default ColumnFilter;
