"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoaderCircle } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import { useSalesReport } from "@/hooks/use-report";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type SalesReport = {
  tanggal: string;
  idDetailTransaksi: string;
  idTransaksi: string;
  namaBarang: string;
  jumlah: number;
  hargaSatuan: number;
  total: number;
};  

export const DataTableSalesReport = React.memo( React.forwardRef<{getExportData: () => {headers: string[]; rows: (string|number)[][]}},
  {startDate: Date | undefined, endDate: Date | undefined}
> (({startDate, endDate},ref) => {
  const {data, isPending} = useSalesReport(startDate, endDate)
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const columns: ColumnDef<SalesReport>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
        accessorKey: "tanggal",
        header: "Tanggal",
        
        cell: ({ row }) => <div>{format(row.getValue("tanggal"), "dd MMM, yyyy", {locale: id})}</div>,
    },
    {
      accessorKey: "idDetailTransaksi",
      header: "Id Detail Transaksi",
      cell: ({ row }) => <div>{row.getValue("idDetailTransaksi")}</div>,
    },
    {
        accessorKey: "idTransaksi",
        header: "Id Transaksi",
        cell: ({ row }) => <div>{row.getValue("idTransaksi")}</div>,
    }
    ,
    {
        accessorKey: "namaBarang",
        header: "Nama Barang",
        cell: ({ row }) => <div>{row.getValue("namaBarang")}</div>,   
    },
    {
        accessorKey: "jumlah",
        header: "Jumlah",
        cell: ({ row }) => <div>{row.getValue("jumlah")}</div>,
    },
    {
        accessorKey: "hargaSatuan",
        header: "Harga Satuan",
        cell: ({ row }) => <div>{formatRupiah(row.getValue("hargaSatuan"))}</div>,
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => <div>{formatRupiah(row.getValue("total"))}</div>,
    },
  ];

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: data ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

   React.useImperativeHandle(ref, () => ({
    getExportData: () => {
      const exportColumns = table
        .getAllColumns()
        .filter(col => col.getIsVisible() && col.id !== "no");

      const headers = exportColumns.map(col =>
        typeof col.columnDef.header === "string"
          ? col.columnDef.header
          : col.id
      );

      const rows = table
        .getFilteredRowModel()
        .rows
        .map(row =>
          exportColumns.map(col => row.getValue(col.id) as string | number)
        );

      return { headers, rows };
    },
  }));

  return (
    <>
           {/* Toggle column visibility */}
        <div className="flex gap-4 mb-4 flex-wrap">
          {table.getAllColumns()
            .filter(col => col.id !== "no")
            .map(col => (
              <label key={col.id} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={col.getIsVisible()}
                  onChange={() => col.toggleVisibility()}
                />
                {typeof col.columnDef.header === "string" ? col.columnDef.header : col.id}
              </label>
            ))}
        </div>
      <div className="w-full">
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
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
                      {isPending ? (<span className="flex justify-center items-center gap-2">
                     <LoaderCircle className="h-4 w-4 animate-spin"/>
                     Loading Data...
                  </span>) : ("No results")}  
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
            {table.getPageCount()} — Menampilkan{" "}
            {table.getRowModel().rows.length > 0
              ? `${
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                  1
                }–${Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}`
              : 0}{" "}
            dari {table.getFilteredRowModel().rows.length} data
          </div>

          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}),
(prevProps, nextProps) =>
    prevProps.startDate === nextProps.startDate &&
    prevProps.endDate === nextProps.endDate
)




