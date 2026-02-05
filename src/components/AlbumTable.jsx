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
import RangeFilter from "./common/RangeFilter";
import ConfirmDialog from "./common/ConfirmDialog";
import RatingCell from "./common/RatingCell";
import ColumnFilter from "./common/ColumnFilter";
import GlobalTextFilter from "./common/GlobalTextFilter";
import TableToolbar from "./common/TableToolbar";

function AlbumTable({ albums, onDelete, toolbarActions, extraContent }) {
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

  const sortingIndicator = (sort) => {
    if (sort === "asc") return " ↑";
    if (sort === "desc") return " ↓";
    return "";
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
      size: 50,
      filterFn: betweenNumberRange,
      cell: info => info.getValue() ?? "N/A",
    },
    {
      accessorKey: "rating",
      header: "Album Rating",
      size: 90,
      filterFn: betweenNumberRange,
      cell: info => <RatingCell value={info.getValue()} />
    },
    {
      accessorKey: "average_rating",
      header: "Avg. Song Rating",
      size: 90,
      filterFn: betweenNumberRange,
      cell: info => <RatingCell value={info.getValue()} precision={2} />
    },
    {
      accessorKey: "overall_rating",
      header: "Overall Rating",
      size: 90,
      filterFn: betweenNumberRange,
      cell: info => <RatingCell value={info.getValue()} precision={2}/>
    },

    {
      id: "actions",
      header: "Actions",
      size: 80,
      cell: ({ row }) => {
        const albumId = row.original.id;
        return (
          <div className="table-actions">
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
      {/* Top toolbar with filter and optional external buttons */}
      <TableToolbar
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        actions={toolbarActions}
      />
      {extraContent}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="table-header"
                    style={{ width: header.column.columnDef.size ?? "150px" }}
                  >
                    <div
                      className="table-header-content"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <span>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sortingIndicator(header.column.getIsSorted())}
                      </span>
                      {header.column.getCanFilter() && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveFilterColumn((prev) =>
                              prev === header.column.id ? null : header.column.id
                            );
                          }}
                          title="Filter"
                          style={{ marginLeft: "0.5rem", fontSize: "0.8rem" }}
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
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="table-cell"
                    style={{ width: cell.column.columnDef.size ?? "150px" }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {albumToDelete && (
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
