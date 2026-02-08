import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useMemo, useState, useCallback } from "react";
import { betweenNumberRange } from "../utils/betweenNumberRange";
import EditableField from "./common/EditableField";
import ConfirmDialog from "./common/ConfirmDialog";
import RatingCell from "./common/RatingCell";
import ColumnFilter from "./common/ColumnFilter";
import { useIsMobile } from "../hooks/useIsMobile";
import EditSongModal from "./EditSongModal";

const baseColumns = (onUpdate, onDelete, handleDelete, isMobile, setEditingRow) => {
  const songRatingHeader = isMobile ? "Rating" : "Song Rating";
  const deleteButtonText = isMobile ? "🗑️" : "Delete";

  const editableColumns = [
    {
      accessorKey: "track_number",
      header: "#",
      size: 10,
      enableSorting: true,
      filterFn: betweenNumberRange,
      cell: ({ row }) => (
        isMobile
          ? row.original.track_number
          : <EditableField
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
        isMobile
          ? row.original.title
          : <EditableField
              value={row.original.title}
              onSave={(val) =>
                onUpdate(row.original.id, "title", val)
              }
            />
      ),
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
        isMobile
          ? row.original.is_interlude ? "✅" : ""
          : <EditableField
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
    header: songRatingHeader,
    size: isMobile ? 40 : 80,
    filterFn: betweenNumberRange,
    cell: ({ row }) => {
      const value = row.original.rating;

      return (
        <RatingCell
          value={value}
          editable={
            isMobile
              ? null
              : (
                <EditableField
                  value={value}
                  inputType="text"
                  onSave={(val) =>
                    onUpdate(row.original.id, "rating", parseFloat(val))
                  }
                  renderDisplay={(v) => (
                    <span className="rating-value">{v != null ? v : "—"}</span>
                  )}
                />
              )
          }
        />
      );
    }
  }
  ];

  const staticColumns = [
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
  ];

  const columns = [
    editableColumns.find(c => c.accessorKey === "track_number"),
    editableColumns.find(c => c.accessorKey === "title"),
    staticColumns.find(c => c.accessorKey === "album.title"),
    staticColumns.find(c => c.accessorKey === "album.artist"),
    editableColumns.find(c => c.accessorKey === "is_interlude"),
    editableColumns.find(c => c.accessorKey === "rating"),
  ].filter(Boolean); 
  
  const actionsCol = {
    id: "actions",
    header: "Actions",
    size: 50,
    cell: ({ row }) => {
      const showEdit = isMobile;
      const showDelete = !!onDelete;

      if (!showEdit && !showDelete) return null;

      return (
        <div className="table-actions">
          {showEdit && (
            <button
              className="button button-secondary"
              onClick={() => setEditingRow(row.original)}
              title="Edit"
            >
              ✏️
            </button>
          )}
          {showDelete && (
            <button
              className="button button-danger"
              onClick={() => handleDelete(row.original)}
              title="Delete"
            >
              {deleteButtonText}
            </button>
          )}
        </div>
      );
    },
  };

  if (isMobile || onDelete) {
    columns.push(actionsCol);
  }

  return columns;
};

function SongTable({ songs, isAlbumSpecific, onUpdate, onDelete}) {
  const showAlbum = isAlbumSpecific ? false : true
  const showTrackNumber = isAlbumSpecific ? true : false
  const showArtistForMobile = isAlbumSpecific ? false : true
  const [editingRow, setEditingRow] = useState(null);

  const [sorting, setSorting] = useState(
    showTrackNumber
      ? [{ id: "track_number", desc: false }]
      : []
  );
  const [columnFilters, setColumnFilters] = useState([]);
  const [activeFilterColumn, setActiveFilterColumn] = useState(null);
  const [songToDelete, setSongToDelete] = useState(null);

  const handleDelete = useCallback((song) => {
    setSongToDelete(song);
  }, []);

  const confirmDelete = () => {
    if (songToDelete) {
      onDelete(songToDelete.id);
      setSongToDelete(null);
    }
  };

  const cancelDelete = () => {
    setSongToDelete(null);
  };

  const data = useMemo(() => songs, [songs]);

  const isMobile = useIsMobile();

  const columns = useMemo(() => {
    let cols = [...baseColumns(onUpdate, onDelete, handleDelete, isMobile, setEditingRow)];

    if (!showAlbum) {
      cols = cols.filter(c => c.accessorKey !== "album.title");
    }

    if (!showTrackNumber) {
      cols = cols.filter(c => c.accessorKey !== "track_number");
    }

    if (isMobile) {
      const allowed = new Set([
        showTrackNumber ? "track_number" : null,
        "title",
        showArtistForMobile ? "album.artist" : null,
        "rating",
      ]);
      cols = cols.filter((c) =>
        c.accessorKey ? allowed.has(c.accessorKey) : c.id === "actions"
      );
    }

    return cols;
  }, [showAlbum, showTrackNumber, showArtistForMobile, isMobile, onUpdate, onDelete, handleDelete]);

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
    <div>
      <div className = "table-wrapper">
        <table className = "table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className = "table-header"
                    style={{
                      width: header.column.columnDef.size ?? "150px",
                      maxWidth: header.column.columnDef.maxSize ?? "200px",
                      textAlign: header.column.id === "rating" || header.column.id === "track_number" ? "center" : "left",
                    }}
                  >
                    <div className = "table-header-content">
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
                      <ColumnFilter column={header.column} />
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
                    className ="table-cell"
                    style={{
                      width: cell.column.columnDef.size ?? "150px",
                      maxWidth: cell.column.columnDef.maxSize ?? "200px",
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
      </div>
      {songToDelete !== null && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${songToDelete.title}"?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
      {editingRow && (
        <EditSongModal
          song={editingRow}
          onClose={() => setEditingRow(null)}
          onSave={(field, val) => {
            onUpdate(editingRow.id, field, val);
            setEditingRow(null);
          }}
        />
      )}

    </div>
  );
}

export default SongTable;
