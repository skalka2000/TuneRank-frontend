function RangeFilter({ column }) {
  const value = column.getFilterValue() || [undefined, undefined];

  return (
    <div className="range-filter">
      <input
        type="number"
        value={value[0] ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          column.setFilterValue([val ? parseFloat(val) : undefined, value[1]]);
        }}
        placeholder="Min"
        className="range-input"
      />
      <input
        type="number"
        value={value[1] ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          column.setFilterValue([value[0], val ? parseFloat(val) : undefined]);
        }}
        placeholder="Max"
        className="range-input"
      />
    </div>
  );
}

export default RangeFilter;
