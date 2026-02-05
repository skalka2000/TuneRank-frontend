function SliderControl({
  label,
  value,
  onChange,
  min,
  max,
  step,
  description
}) {
  return (
    <div style={{ gap: "0.25rem", marginBottom: "0.5rem" }}>
      <label>
        {label}: <strong>{value.toFixed(2)}</strong>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%" }}
      />
      <small>{description}</small>
    </div>
  );
}

export default SliderControl;
