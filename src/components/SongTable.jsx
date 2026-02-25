import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useMemo, useState, useEffect, useCallback } from "react";
import { betweenNumberRange } from "../utils/betweenNumberRange";
import EditableField from "./common/EditableField";
import ConfirmDialog from "./common/ConfirmDialog";
import RatingCell from "./common/RatingCell";
import ColumnFilter from "./common/ColumnFilter";
import { useIsMobile } from "../hooks/useIsMobile";

const baseColumns = (onUpdate, onDelete, handleDelete, isMobile) => {
  const songRatingHeader = isMobile ? "Rating" : "Song Rating";
  const deleteButtonText = isMobile ? "🗑️" : "Delete";

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
      accessorKey: "song_type",
      header: "Type",
      size: 70,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || filterValue === "all") return true;
        return row.getValue(columnId) === filterValue;
      },
      cell: ({ row }) => (
        <EditableField
          value={row.original.song_type ?? "song"}
          inputType="select"
          options={[
            { label: "Song", value: "song" },
            { label: "Interlude", value: "interlude" },
            { label: "Epic", value: "epic" },
          ]}
          onSave={(val) => onUpdate(row.original.id, "song_type", val)}
          renderDisplay={(val) => {
            if (val === "interlude") return "Interlude";
            if (val === "epic") return "Epic";
            return "Song";
          }}
        />
      ),
    },
    {
      accessorKey: "rating",
      header: songRatingHeader,
      size: isMobile ? 40 : 80,
      filterFn: betweenNumberRange,
      cell: ({ row }) => {
        const value = row.original.rating ?? "—";
        return (
          <RatingCell
            value={value}
            editable={
              <EditableField
                value={value}
                inputType="text"
                onSave={(val) =>
                  onUpdate(row.original.id, "rating", parseFloat(val))
                }
                renderDisplay={(v) => (
                  <span className="rating-value">
                    {v != null ? v : "—"}
                  </span>
                )}
              />
            }
          />
        );
      }
    }
  ];

  if (onDelete) {
    columns.push({
      id: "actions",
      header: "Actions",
      size: 50,
      cell: ({ row }) => (
        <button
          className="button button-danger"
          onClick={() => handleDelete(row.original)}
        >
          {deleteButtonText}
        </button>
      ),
    });
  }

  return columns;
};

function SongTable({ songs, isAlbumSpecific, onUpdate, onDelete}) {
  const showAlbum = isAlbumSpecific ? false : true
  const showTrackNumber = isAlbumSpecific ? true : false
  const showArtistForMobile = isAlbumSpecific ? false : true

  const [sorting, setSorting] = useState(
    showTrackNumber
      ? [{ id: "track_number", desc: false }]
      : [{ id: "rating", desc: true }]
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
    let cols = [...baseColumns(onUpdate, onDelete, handleDelete, isMobile)];

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
      <ConfirmDialog
        isOpen={!!songToDelete}
        message={
          songToDelete
            ? `Are you sure you want to delete "${songToDelete.title}"?`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

    </div>
  );
}

export default SongTable;
