"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { useState } from "react";

interface HD_HyperTableProps {
  datas: any[];
  columns: ColumnDef<any, any>[];
  onRowDoubleClick: (item: any) => void;
}

export default function HD_HyperTable({
  datas,
  columns,
  onRowDoubleClick = () => {},
}: HD_HyperTableProps) {
  return (
    <DataTable<any, any>
      columns={columns}
      data={datas}
      onDoubleClick={(row) => {
        onRowDoubleClick(row.original);
      }}
    />
  );
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDoubleClick: (row: any) => void;
}

function DataTable<TData, TValue>({
  columns,
  data,
  onDoubleClick,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      rowSelection,
      sorting,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="overflow-hidden rounded-md border bg-white p-8 dark:border-gray-800 dark:bg-transparent">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-none bg-[#F7F9FC] dark:bg-gray-700 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onDoubleClick={() => {
                    onDoubleClick(row);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="min-w-[100px] text-left"
                      suppressHydrationWarning
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50 dark:bg-transparent"
        >
          Previous
        </button>

        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50 dark:bg-transparent"
        >
          Next
        </button>
      </div>
    </div>
  );
}
