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
import { Edit, Trash2, RotateCcw, Plus, Loader2 } from "lucide-react";
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
import { categorySchema } from "@/schemas/category-schema";
import { z } from "zod";
import { useActiveCategory } from "@/hooks/use-category";

// const data: z.infer<typeof categorySchema>[] = [
//   {
//     id: "m5gr84i9",
//     nama: "ban",
//     deletedAt: "2023-10-09T09:00:00Z",
//   },
//   {
//     id: "m5gr84i9",
//     nama: "roda",
//     deletedAt: null,
//   },
//   {
//     id: "m5gr84i9",
//     nama: "stang",
//     deletedAt: "2023-10-10T10:00:00Z",
//   },
//   {
//     id: "m5gr84i9",
//     nama: "knalpot",
//     deletedAt: null,
//   },
//   {
//     id: "m5gr84i9",
//     nama: "lampu",
//     deletedAt: "2023-10-11T12:00:00Z",
//   },
//   {
//     id: "m5gr84i9",
//     nama: "spion",
//     deletedAt: null,
//   },

//   {
//     id: "m5gr84i9",
//     nama: "oli",
//     deletedAt: "2023-10-12T14:00:00Z",
//   },

//   {
//     id: "m5gr84i9",
//     nama: "busi",
//     deletedAt: "2023-10-13T15:00:00Z",
//   },
//   {
//     id: "m5gr84i9",
//     nama: "busi",
//     deletedAt: "2023-10-13T15:00:00Z",
//   },
//   {
//     id: "m5gr84i9",
//     nama: "busi",
//     deletedAt: "2023-10-13T15:00:00Z",
//   },
//   {
//     id: "m5gr84i9",
//     nama: "busi",
//     deletedAt: "2023-10-13T15:00:00Z",
//   },
// ];

export function DataTableKategori({
  onCreate,
  onEdit,
  onDelete,
}: {
  onCreate: () => void;
  onEdit: (category: z.infer<typeof categorySchema>) => void;
  onDelete: (category: z.infer<typeof categorySchema>) => void;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { data, isPending } = useActiveCategory()
  const columns: ColumnDef<z.infer<typeof categorySchema>>[] = [
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
    data: data?.categories ?? [],
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
            Buat Kategori
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
                    {isPending ? "Loading Data..." : "No results"}
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
