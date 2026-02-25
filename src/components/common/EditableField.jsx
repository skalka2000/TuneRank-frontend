import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

function EditableField({
  value,
  onSave,
  inputType = "text",
  placeholder = "—",
  renderDisplay,
  options = [], // <-- NEW (for select)
}) {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value ?? "");
  const inputRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleBlur = async () => {
    const next =
      inputType === "checkbox"
        ? localValue
        : typeof localValue === "string"
          ? localValue.trim()
          : localValue;

    if (next !== value) {
      try {
        await onSave(next);
      } catch (err) {
        console.error(err.message);
      }
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setLocalValue(value ?? "");
    setEditing(false);
  };

  const handleClick = () => {
    setEditing(true);
    if (inputType === "checkbox") {
      setLocalValue((prev) => !prev);
    }
  };

  if (editing) {
    if (inputType === "checkbox") {
      return (
        <div className="editable-wrapper">
          <input
            type="checkbox"
            className="checkbox-standard"
            checked={!!localValue}
            onChange={(e) => setLocalValue(e.target.checked)}
            ref={inputRef}
          />
          <button className="floating-button" onClick={handleBlur} aria-label="Save">
            ✓
          </button>
        </div>
      );
    }

    if (inputType === "select") {
      return (
        <div className="editable-wrapper">
          <select
            value={localValue ?? ""}
            onChange={(e) => setLocalValue(e.target.value)}
            {...(!isMobile && { onBlur: handleBlur })}
            ref={inputRef}
            className="editable-input"
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button className="floating-button" onClick={handleBlur} aria-label="Save">
            ✓
          </button>
        </div>
      );
    }

    return (
      <div className="editable-wrapper">
        <input
          type={inputType}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          {...(!isMobile && { onBlur: handleBlur })}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.target.blur();
            if (e.key === "Escape") handleCancel();
          }}
          ref={inputRef}
          className="editable-input"
        />
        <button className="floating-button" onClick={handleBlur} aria-label="Save">
          ✓
        </button>
      </div>
    );
  }

  return (
    <span onClick={handleClick} className="editable-field">
      {renderDisplay ? (
        renderDisplay(value)
      ) : value ? (
        value
      ) : (
        <span className="placeholder-muted">{placeholder}</span>
      )}
      <span className="edit-icon"> ✏️</span>
    </span>
  );
}

export default EditableField;