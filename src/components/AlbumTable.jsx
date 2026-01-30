import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { getRatingColor } from "../utils/ratingColors";
import { betweenNumberRange } from "../utils/betweenNumberRange";
import RangeFilter from "./RangeFilter";
import ConfirmDialog from "./ConfirmDialog";


function AlbumTable({ albums, onDelete }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [activeFilterColumn, setActiveFilterColumn] = useState(null);
  const [albumToDelete, setAlbumToDelete] = useState(null);

  const data = useMemo(() => albums, [albums]);

  const handleDelete = useCallback((album) => {
    setAlbumToDelete(album);
  }, []);

  const confirmDelete = () => {
    if (albumToDelete) {
      onDelete(albumToDelete.id);
      setAlbumToDelete(null);
    }
  };

  const cancelDelete = () => {
    setAlbumToDelete(null);
  };

  const columns = useMemo(() => [
    {
      accessorKey: "title",
      header: "Title",
      filterFn: "includesString",
      cell: info => info.getValue(),
    },
    {
      accessorKey: "artist",
      header: "Artist",
      filterFn: "includesString",
      cell: info => info.getValue(),
    },
    {
      accessorKey: "year",
      header: "Year",
      filterFn: betweenNumberRange,
      cell: info => info.getValue() ?? "N/A",
    },
    {
      accessorKey: "rating",
      header: "Rating",
      size: 80,
      filterFn: betweenNumberRange,
      cell: info => (
        <div className={getRatingColor(info.getValue())}>
          {info.getValue()}
        </div>
      ),
    },
  {
    id: "actions",
    header: "Actions",
    size: 80,
    cell: ({ row }) => {
      const albumId = row.original.id;

      return (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link to={`/albums/${albumId}`}>
            <button className="button button-secondary">View</button>
          </Link>
          <button
            className="button button-danger"
            onClick={() => handleDelete(row.original)}
          >
            Delete
          </button>
        </div>
      );
    },
  }

  ], [handleDelete]);

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
      <input
        type="text"
        placeholder="Search..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="input"
      />
      <table className="table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  style={{
                    position: "relative",
                    width: header.column.columnDef.size ?? "150px", // fallback width
                    maxWidth: header.column.columnDef.maxSize ?? "200px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    textAlign: header.column.id === "rating" ? "center" : "left",
                  }}
                >
                <div
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
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
                        e.stopPropagation(); // prevent sorting on icon click
                        setActiveFilterColumn((prev) =>
                          prev === header.column.id ? null : header.column.id
                        );
                      }}
                      style={{
                        cursor: "pointer",
                        marginLeft: "0.5rem",
                        fontSize: "0.8rem",
                      }}
                      title="Filter"
                    >
                      🔍
                    </span>
                  )}
                </div>

                {activeFilterColumn === header.column.id && (
                  <div style={{ marginTop: "0.25rem" }}>
                    {header.column.id === "rating" || header.column.id === "year" ? (
                      <RangeFilter column={header.column} />
                    ) : (
                    <input
                      type="text"
                      value={header.column.getFilterValue() ?? ""}
                      onChange={(e) => header.column.setFilterValue(e.target.value)}
                      placeholder={`Filter ${header.column.id}`}
                      style={{
                        width: "100%",        // fill column
                        maxWidth: "100%",     // don’t expand beyond column
                        overflow: "hidden",
                        boxSizing: "border-box", // important for padding inside constrained width
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                style={{
                  width: cell.column.columnDef.size ?? "150px",
                  maxWidth: cell.column.columnDef.maxSize ?? "200px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  textAlign: cell.column.id === "rating" ? "center" : "left",
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {albumToDelete !== null && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${albumToDelete.title}"?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

    </div>
  );
}

export default AlbumTable;
