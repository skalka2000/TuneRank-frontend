import { useState } from "react";

function EditableField({ value, field, albumId, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const handleBlur = async () => {
    if (localValue !== value) {
      try {
        await onUpdate(field, localValue);
      } catch (err) {
        console.error(err.message);
      }
    }
    setEditing(false);
  };

  return editing ? (
    <input
      value={localValue}
      autoFocus
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.target.blur();
      }}
    />
  ) : (
    <span onDoubleClick={() => setEditing(true)} style={{ cursor: "pointer" }}>
      {value || <i style={{ color: "#aaa" }}>—</i>}
    </span>
  );
}

export default EditableField;
