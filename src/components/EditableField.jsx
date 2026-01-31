import { useState, useEffect, useRef } from "react";

function EditableField({
  value,
  onSave,
  inputType = "text",
  placeholder = "—",
  renderDisplay,
}) {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value ?? "");
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleBlur = async () => {
    if (localValue !== value) {
      try {
        await onSave(inputType === "checkbox" ? localValue : localValue.trim());
      } catch (err) {
        console.error(err.message);
      }
    }
    setEditing(false);
  };

  const handleClick = () => {
    setEditing(true);
    if (inputType === "checkbox") {
      setLocalValue(prev => !prev); // toggle immediately
    }
  };

  if (editing) {
    if (inputType === "checkbox") {
      return (
        <input
          type="checkbox"
          checked={localValue}
          onChange={(e) => setLocalValue(e.target.checked)}
          onBlur={handleBlur}
          ref={inputRef}
        />
      );
    }

    return (
      <input
        type={inputType}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.target.blur();
        }}
        ref={inputRef}
      />
    );
  }

  return (
    <span
      onClick={handleClick}
      className="editable-field"
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      {renderDisplay
        ? renderDisplay(value)
        : value || <i style={{ color: "#aaa" }}>{placeholder}</i>}
      <span className="edit-icon"> ✏️</span>
    </span>
  );
}

export default EditableField;
