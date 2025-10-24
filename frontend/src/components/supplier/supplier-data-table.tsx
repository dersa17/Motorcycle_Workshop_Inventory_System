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
import { Edit, Trash2, Plus, } from "lucide-react";
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
import { supplierSchema } from "@/schemas/supplier-schema";
import {useSupplier} from "@/hooks/use-supplier"
import { LoaderCircle } from "lucide-react";


// const data: z.infer<typeof supplierSchema>[] = [
//   {
//     id: "S001",
//     nama: "PT. Sumber Makmur",
//     alamat: "Jl. Merdeka No. 10, Jakarta",
//     kontak: "+628123456789"
//   },
//   {
//     id: "S002",
//     nama: "CV. Tiga Putra",
//     alamat: "Jl. Sudirman No. 25, Bandung",
//     kontak: "081234567890"
//   },
//   {
//     id: "S003",
//     nama: "UD. Maju Jaya",
//     alamat: "Jl. Gatot Subroto No. 5, Surabaya",
//     kontak: "+62213456789"
//   },
//   {
//     id: "S004",
//     nama: "PT. Sejahtera Abadi",
//     alamat: "Jl. Diponegoro No. 50, Yogyakarta",
//     kontak: "081298765432"
//   },
//   {
//     id: "S005",
//     nama: "CV. Cahaya Mandiri",
//     alamat: "Jl. Ahmad Yani No. 100, Semarang",
//     kontak: "+628987654321"
//   },
//   {
//     id: "S006",
//     nama: "PT. Prima Karya",
//     alamat: "Jl. Teuku Umar No. 15, Denpasar",
//     kontak: "081345678901"
//   },
//   {
//     id: "S007",
//     nama: "UD. Indah Lestari",
//     alamat: "Jl. Gajah Mada No. 20, Medan",
//     kontak: "+62612345678"
//   },
//   {
//     id: "S008",
//     nama: "CV. Bersama Jaya",
//     alamat: "Jl. Pahlawan No. 30, Malang",
//     kontak: "081556677889"
//   },
//   {
//     id: "S009",
//     nama: "PT. Satria Abadi",
//     alamat: "Jl. Panglima Polim No. 12, Jakarta",
//     kontak: "+628223344556"
//   },
//   {
//     id: "S010",
//     nama: "CV. Karya Prima",
//     alamat: "Jl. Veteran No. 45, Bandung",
//     kontak: "081667788990"
//   },
// ];

export function DataTableSupplier({
  onCreate,
  onEdit,
  onDelete,
}: {
  onCreate: () => void;
  onEdit: (supplier: z.infer<typeof supplierSchema>) => void;
  onDelete: (supplier: z.infer<typeof supplierSchema>) => void;
}) {
  const {data, isPending} = useSupplier()
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const columns: ColumnDef<z.infer<typeof supplierSchema>>[] = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "nama",
      header: "Nama",
      cell: ({ row }) => <div>{row.getValue("nama")}</div>,
    },
    {
      accessorKey: "alamat",
      header: "Alamat",
      cell: ({ row }) => <div>{row.getValue("alamat")}</div>,
    },
    {
      accessorKey: "kontak",
      header: "Kontak",
      cell: ({ row }) => <div>{row.getValue("kontak")}</div>,
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
                      onClick={() => onEdit(row.original)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"ghost"}
                      size={"sm"}
                      className="cursor-pointer"
                      onClick={() => onDelete(row.original)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Hapus</p>
                  </TooltipContent>
                </Tooltip>
              </>
            {/* ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size={"sm"}
                    className="cursor-pointer"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pulihkan</p>
                </TooltipContent>
              </Tooltip>
            )} */}
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
    data: data?.suppliers ?? [],
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

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between pb-4">
          <Input
            placeholder="Cari nama..."
            value={(table.getColumn("nama")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("nama")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Button className="cursor-pointer" onClick={onCreate}>
            Buat Supplier
            <Plus className="h-4 w-4" />
          </Button>
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
  );
}
