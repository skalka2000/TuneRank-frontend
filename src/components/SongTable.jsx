import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { getRatingColor } from "../utils/ratingColors";
import { betweenNumberRange } from "../utils/betweenNumberRange";
import RangeFilter from "./RangeFilter";
import EditableField from "./EditableField";


const baseColumns = (onUpdate, onDelete) => {
  const columns = [
  {
    accessorKey: "track_number",
    header: "#",
    size: 10,
    enableSorting: true,
    filterFn: betweenNumberRange,
    cell: ({ row }) => (
      <EditableField
        value={row.original.track_number}
        inputType="number"
        onSave={(val) =>
          onUpdate(row.original.id, "track_number", parseInt(val))
        }
      />
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    filterFn: "includesString",
    cell: ({ row }) => (
      <EditableField
        value={row.original.title}
        onSave={(val) =>
          onUpdate(row.original.id, "title", val)
        }
      />
    ),
  },
  {
    accessorKey: "album.title",
    header: "Album",
    cell: ({ row }) => row.original.album?.title ?? "N/A",
    filterFn: "includesString",
  },
  {
    accessorKey: "album.artist",
    header: "Artist",
    cell: ({ row }) => row.original.album?.artist ?? "N/A",
    filterFn: "includesString",
  },
  {
    accessorKey: "is_interlude",
    header: "Interlude",
    size: 40,
    filterFn: (row, columnId, filterValue) => {
      if (filterValue === "yes") return row.getValue(columnId);
      if (filterValue === "no") return !row.getValue(columnId);
      return true;
    },
    cell: ({ row }) => (
      <EditableField
        value={row.original.is_interlude}
        inputType="checkbox"
        onSave={(val) =>
          onUpdate(row.original.id, "is_interlude", val)
        }
        renderDisplay={(val) => (val ? "✅" : "")}
      />
    ),
  },

  {
    accessorKey: "rating",
    header: "Rating",
    size: 80,
    filterFn: betweenNumberRange,
    cell: ({ row }) => {
      const value = row.original.rating;
      const percent = (value / 10) * 100;
      const color = getRatingColor(value);

      return (
        <div className="rating-cell">
          <div
            className="rating-bar"
            style={{ width: `${percent}%`, backgroundColor: color }}
          />
          <EditableField
            value={value}
            inputType="number"
            onSave={(val) =>
              onUpdate(row.original.id, "rating", parseFloat(val))
            }
            renderDisplay={(v) => <span className="rating-value">{v ?? "—"}</span>}
          />
        </div>
      );
    }
  },

  ];
  if (onDelete) {
    columns.push({
      id: "actions",
      header: "Actions",
      size: 50,
      cell: ({ row }) => (
        <button
          className="button button-danger"
          onClick={() => {
            const confirmed = window.confirm(`Delete "${row.original.title}"?`);
            if (confirmed) onDelete(row.original.id);
          }}
        >
          Delete
        </button>
      ),
    });
  }
  return columns
}


function SongTable({ songs, showAlbum = false, showTrackNumber = true, onUpdate, onDelete}) {
  const [sorting, setSorting] = useState(
    showTrackNumber
      ? [{ id: "track_number", desc: false }]
      : []
  );
  const [columnFilters, setColumnFilters] = useState([]);
  const [activeFilterColumn, setActiveFilterColumn] = useState(null);
  const [interludeFilter, setInterludeFilter] = useState("all");

  const data = useMemo(() => songs, [songs]);

  const columns = useMemo(() => {
    let cols = [...baseColumns(onUpdate, onDelete)];
    if (!showAlbum) {
      cols = cols.filter(c => c.accessorKey !== "album.title");
    }
    if (!showTrackNumber) {
      cols = cols.filter(c => c.accessorKey !== "track_number");
    }
    return cols;
  }, [showAlbum, showTrackNumber, onUpdate, onDelete]);


  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      betweenNumberRange,
    },
  });

  return (
    <table className="table" style={{ tableLayout: "fixed", width: "100%", borderCollapse: "collapse" }}>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th
                key={header.id}
                style={{
                  position: "relative",
                  width: header.column.columnDef.size ?? "150px",
                  maxWidth: header.column.columnDef.maxSize ?? "200px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  textAlign: header.column.id === "rating" || header.column.id === "track_number" ? "center" : "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: " ↑",
                      desc: " ↓",
                    }[header.column.getIsSorted()] ?? ""}
                  </span>
                  {header.column.getCanFilter() && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilterColumn(prev =>
                          prev === header.column.id ? null : header.column.id
                        );
                      }}
                      style={{ cursor: "pointer", marginLeft: "0.5rem", fontSize: "0.8rem" }}
                      title="Filter"
                    >
                      🔍
                    </span>
                  )}
                </div>
                {activeFilterColumn === header.column.id && (
                  <div style={{ marginTop: "0.25rem" }}>
                  {["rating", "track_number"].includes(header.column.id) ? (
                    <RangeFilter column={header.column} />
                  ) : header.column.id === "is_interlude" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <label>
                      <input
                        type="radio"
                        name="interlude"
                        value="all"
                        checked={!header.column.getFilterValue()}
                        onChange={() => header.column.setFilterValue(undefined)}
                      /> All
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="interlude"
                        value="no"
                        checked={header.column.getFilterValue() === "no"}
                        onChange={() => header.column.setFilterValue("no")}
                      /> Songs
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="interlude"
                        value="yes"
                        checked={header.column.getFilterValue() === "yes"}
                        onChange={() => header.column.setFilterValue("yes")}
                      /> Interludes
                    </label>
                  </div>

                  ) : (
                    <input
                      type="text"
                      value={header.column.getFilterValue() ?? ""}
                      onChange={(e) => header.column.setFilterValue(e.target.value)}
                      placeholder={`Filter ${header.column.id}`}
                      style={{
                        width: "100%",
                        maxWidth: "100%",
                        overflow: "hidden",
                        boxSizing: "border-box",
                      }}
                    />
                  )}

                  </div>
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td
                key={cell.id}
                style={{
                  width: cell.column.columnDef.size ?? "150px",
                  maxWidth: cell.column.columnDef.maxSize ?? "200px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  textAlign: cell.column.id === "rating" || cell.column.id === "track_number" ? "center" : "left",
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SongTable;
