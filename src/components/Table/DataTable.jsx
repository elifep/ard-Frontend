import React, { useState, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table";
import { FaArrowUp, FaArrowDown, FaSearch } from "react-icons/fa";

const DataTable = ({
    data,
    columns,
    title,
    actions = null,
    filters = null,
    selectable = false,
}) => {
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
    const [rowSelection, setRowSelection] = useState({});

    // Filter data based on globalFilter
    const filteredData = useMemo(() => {
        if (!globalFilter) return data;
        return data.filter((row) =>
            Object.values(row).some((value) =>
                String(value || "").toLowerCase().includes(globalFilter.toLowerCase())
            )
        );
    }, [globalFilter, data]);

    const tableColumns = useMemo(() => {
        if (selectable) {
            return [
                {
                    id: "select",
                    header: ({ table }) => (
                        <input
                            type="checkbox"
                            {...{
                                checked: table.getIsAllRowsSelected(),
                                onChange: table.getToggleAllRowsSelectedHandler(),
                            }}
                        />
                    ),
                    cell: ({ row }) => (
                        <input
                            type="checkbox"
                            {...{
                                checked: row.getIsSelected(),
                                onChange: row.getToggleSelectedHandler(),
                            }}
                        />
                    ),
                },
                ...columns,
            ];
        }
        return columns;
    }, [columns, selectable]);

    const table = useReactTable({
        data: filteredData,
        columns: tableColumns,
        state: { globalFilter, pagination, rowSelection },
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl text-gray-800 font-bold">{title}</h1>
            </div>

            {/* Search and Actions */}
            <div className="flex justify-between items-center mb-4">
                {/* Search Bar */}
                <div className="relative flex items-center w-full md:w-1/2">
                    <FaSearch className="absolute left-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Ara..."
                        className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-bordo"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </div>
                {/* External Actions */}
                {actions && <div className="flex gap-4 w-1/3 justify-end">{actions}</div>}
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full border-collapse border">
                    <thead className="bg-bordo text-white uppercase text-sm leading-normal">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="border px-4 py-2 text-left cursor-pointer"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center justify-between">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() === "asc" && <FaArrowUp />}
                                            {header.column.getIsSorted() === "desc" && <FaArrowDown />}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => row.toggleSelected()}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="border px-4 py-2">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Önceki
                </button>
                <div className="flex gap-2 items-center">
                    <span>
                        Sayfa {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </span>
                    <select
                        value={pagination.pageSize}
                        onChange={(e) =>
                            setPagination({ ...pagination, pageSize: Number(e.target.value) })
                        }
                        className="border rounded px-2 py-1"
                    >
                        {[5, 10, 15, 20].map((size) => (
                            <option key={size} value={size}>
                                {size} Kayıt
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Sonraki
                </button>
            </div>
        </div>
    );
};

export default DataTable;