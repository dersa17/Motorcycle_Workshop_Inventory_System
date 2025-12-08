"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { z } from "zod";
import { LoaderCircle } from "lucide-react";
import { formatRupiah } from "@/utils/formatRupiah";
import { Badge } from "@/components/ui/badge";
import { useTransactions } from "@/hooks/use-transactions";
import { transactionResponseSchema } from "@/schemas/transaction-schema";
export function DataTableTransaction({
  onViewDetail,
  onEdit,
}: {
  onViewDetail: (
    transaction: z.infer<typeof transactionResponseSchema>
  ) => void;
  onEdit: (transaction: z.infer<typeof transactionResponseSchema>) => void;
}) {
  const { data, isPending } = useTransactions();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const columns: ColumnDef<z.infer<typeof transactionResponseSchema>>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "jenis",
      header: "Jenis",
      cell: ({ row }) => {
        const jenis = row.getValue("jenis");

        return (
          <Badge
            className={
              jenis === "pembelian"
                ? "bg-green-500 text-foreground  px-2 py-1 rounded-lg"
                : "bg-blue-500 text-foreground  px-2 py-1 rounded-lg"
            }
          >
            {jenis === "pembelian" ? "Pembelian" : "Penjualan"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "id",
      header: "ID Transaksi",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorFn: (row) => row.supplier?.nama,
      id: "supplierNama",
      header: "Supplier",
      cell: ({ row }) => <div>{row.getValue("supplierNama") || "-"}</div>,
    },
    {
      accessorKey: "totalJumlah",
      header: "Jumlah Barang",
      cell: ({ row }) => {
        const detail = row.original.detailTransaksi ?? [];

        const totalJumlah = detail.reduce((acc, d) => acc + (d.jumlah || 0), 0);

        return <div>{totalJumlah}</div>;
      },
    },
    {
      accessorKey: "total",
      header: "Total Harga",
      cell: ({ row }) => <div>{formatRupiah(row.getValue("total"))}</div>,
    },

    {
      id: "aksi",
      header: "Aksi",
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            {/* {row.original.deletedAt === null ? ( */}
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    className="cursor-pointer"
                    onClick={() => onViewDetail(row.original)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Lihat Detail</p>
                </TooltipContent>
              </Tooltip>
              {/* <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    className="cursor-pointer"
                    onClick={() => onEdit(row.original)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit</p>
                </TooltipContent>
              </Tooltip> */}
            </>
          </div>
        );
      },
    },
  ];

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: data?.transactions ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: (row, columnId, filterValue) => {
      const id = row.original.id?.toLowerCase() ?? "";
      const supplier = row.original.supplier?.nama.toLowerCase() ?? "";
      const search = filterValue.toLowerCase();

      return id.includes(search) || supplier.includes(search);
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Cari ID transaksi dan nama supplier..."
            value={table.getState().globalFilter ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />

          <div className="flex gap-3">
            <Select
              value={
                (table.getColumn("jenis")?.getFilterValue() as string) ?? ""
              }
              onValueChange={(event) => {
                if (!event || event == "all") {
                  table.getColumn("jenis")?.setFilterValue(undefined);
                } else {
                  table.getColumn("jenis")?.setFilterValue(event);
                }
              }}
            >
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Filter kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">-Tidak ada filter-</SelectItem>
                <SelectItem value="pembelian">Pembelian</SelectItem>
                <SelectItem value="penjualan">Penjualan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
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
                    {isPending ? (
                      <span className="flex justify-center items-center gap-2">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Loading Data...
                      </span>
                    ) : (
                      "No results"
                    )}
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
  );
}
