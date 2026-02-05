import React from "react";

function TableToolbar({ globalFilter, onGlobalFilterChange, actions }) {
  return (
    <div className="table-toolbar">
      <input
        type="text"
        placeholder="Search..."
        value={globalFilter}
        onChange={(e) => onGlobalFilterChange(e.target.value)}
        className="input-standard"
      />
      <div className="toolbar-actions">
        {actions}
      </div>
    </div>
  );
}

export default TableToolbar;
