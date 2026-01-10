function RangeFilter({ column }) {
  const value = column.getFilterValue() || [undefined, undefined];

  return (
    <div style={{ display: "flex", gap: "0.25rem", marginTop: "0.25rem" }}>
      <input
        type="number"
        value={value[0] ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          column.setFilterValue([val ? parseFloat(val) : undefined, value[1]]);
        }}
        placeholder="Min"
        style={{ width: "60px" }}
      />
      <input
        type="number"
        value={value[1] ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          column.setFilterValue([value[0], val ? parseFloat(val) : undefined]);
        }}
        placeholder="Max"
        style={{ width: "60px" }}
      />
    </div>
  );
}

export default RangeFilter;
