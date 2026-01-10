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

function SongTable({ songs, showAlbum = false }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [activeFilterColumn, setActiveFilterColumn] = useState(null);

  const data = useMemo(() => songs, [songs]);

  const columns = useMemo(() => {
    const base = [
      {
        accessorKey: "track_number",
        header: "#",
        size: 40,
        cell: info => info.getValue() ?? "",
        enableSorting: true,
        filterFn: betweenNumberRange,
      },
      {
        accessorKey: "title",
        header: "Title",
        filterFn: "includesString",
        cell: info => info.getValue(),
      },
      {
        accessorKey: "album.title",
        header: "Album",
        cell: info => info.row.original.album?.title ?? "N/A",
        filterFn: "includesString",
      },
      {
        accessorKey: "album.artist",
        header: "Artist",
        cell: info => info.row.original.album?.artist ?? "N/A",
        filterFn: "includesString",
      },
      {
        accessorKey: "rating",
        header: "Rating",
        size: 80,
        filterFn: betweenNumberRange,
        cell: info => (
          <div className={getRatingColor(info.getValue())}>
            {info.getValue() ?? "N/A"}
          </div>
        ),
      },
    ];

    return showAlbum ? base : base.filter(col => col.accessorKey !== "album.title");
  }, [showAlbum]);

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
