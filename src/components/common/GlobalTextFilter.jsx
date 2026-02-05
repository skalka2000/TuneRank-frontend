function GlobalTextFilter({ value, onChange, placeholder = "Search..." }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="input-standard"
      style={{ marginTop: "1rem", marginBottom: "0.25rem", maxWidth: "300px" }}
    />
  );
}

export default GlobalTextFilter;
