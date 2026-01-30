import { useState } from "react";

function EditableField({ value, onSave, inputType = "text", placeholder = "—" }) {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value ?? "");

  const handleBlur = async () => {
    if (localValue !== value) {
      try {
        await onSave(localValue);
      } catch (err) {
        console.error(err.message);
      }
    }
    setEditing(false);
  };

  return editing ? (
    <input
      type={inputType}
      value={localValue}
      autoFocus
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.target.blur();
      }}
    />
  ) : (
    <span
      onDoubleClick={() => setEditing(true)}
      className="editable-field"
    >
      {value || <i style={{ color: "#aaa" }}>{placeholder}</i>}
      <span className="edit-icon">✏️</span>
    </span>
  );
}

export default EditableField;
