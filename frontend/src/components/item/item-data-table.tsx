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
import { Edit, Trash2, Plus } from "lucide-react";
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
import { itemResponseSchema } from "@/schemas/item-schema";
import { useItem } from "@/hooks/use-item";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { formatRupiah } from "@/utils/formatRupiah";
import { useActiveCategory } from "@/hooks/use-category";
import { categorySchema } from "@/schemas/category-schema";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
export function DataTableItem({
    onCreate,
    onEdit,
    onDelete,
}: {
    onCreate: () => void;
    onEdit: (item: z.infer<typeof itemResponseSchema>) => void;
    onDelete: (item: z.infer<typeof itemResponseSchema>) => void;
}) {
    const { data, isPending } = useItem();
    const { data: dataKategori } = useActiveCategory();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const columns: ColumnDef<z.infer<typeof itemResponseSchema>>[] = [
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
            accessorKey: "harga",
            header: "Harga",
            cell: ({ row }) => <div>{formatRupiah(row.getValue("harga"))}</div>,
        },
        {
            accessorKey: "kategori",
            header: "Kategori",
            cell: ({ row }) => <div>{row.original.kategori.nama}</div>,
            filterFn: (row, id, value) => {
                if (value == "all") return true;
                return row.original.kategori.nama === value;
            },
        },
        {
            accessorKey: "stok",
            header: "Stok",
            cell: ({ row }) => <div>{row.getValue("stok")}</div>,
        },
        {
            accessorKey: "stokMinimum",
            header: "Stok Minimum",
            cell: ({ row }) => <div>{row.getValue("stokMinimum")}</div>,
        },

        {
            id: "statusStok",
            header: "Status Stok",
            cell: ({ row }) => {
                const stok: number = row.getValue("stok");
                const stokMinimum: number = row.getValue("stokMinimum");

                let text = "";
                let bgClass = "";
                let Icon;
                let gradient = "";

                if (stok === 0) {
                    text = "Habis";
                    bgClass = "bg-red-500";
                    gradient = "from-red-500 to-red-600";
                    Icon = XCircle;
                } else if (stok < stokMinimum) {
                    text = "Perlu Restock";
                    bgClass = "bg-yellow-400";
                    gradient = "from-yellow-400 to-yellow-500";
                    Icon = AlertTriangle;
                } else {
                    text = "Aman";
                    bgClass = "bg-green-500";
                    gradient = "from-green-500 to-green-600";
                    Icon = CheckCircle;
                }

                return (
                    <Badge
                        className={`
                ${bgClass} 
                text-foreground 
                gap-1 px-3 py-1 
                bg-gradient-to-r ${gradient}
            `}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="font-semibold">{text}</span>
                    </Badge>
                );
            },
            filterFn: (row, id, value) => {
                const stok: number = row.getValue("stok");
                const stokMinimum: number = row.getValue("stokMinimum");

                if (value === "all") return true;
                if (value === "aman") return stok >= stokMinimum && stok > 0;
                if (value === "restok") return stok < stokMinimum && stok > 0;
                if (value === "habis") return stok === 0;
                return true;
            },
        },

        {
            accessorKey: "gambar",
            header: "Gambar",
            cell: ({ row }) => (
                <div>
                    {row.original.gambar ? (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/${row.original.gambar}`}
                            alt={row.original.nama}
                            width={80}
                            height={80}
                        />
                    ) : (
                        "-"
                    )}
                </div>
            ),
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
        data: data?.items ?? [],
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
                    <div className="flex gap-3">
                        <Select
                            value={
                                (table.getColumn("kategori")?.getFilterValue() as string) ?? ""
                            }
                            onValueChange={(event) => {
                                if (!event || event == "all") {
                                    table.getColumn("kategori")?.setFilterValue(undefined)
                                } else {
                                    table.getColumn("kategori")?.setFilterValue(event)
                                }
                            }
                            }
                        >
                            <SelectTrigger className="max-w-xs">
                                <SelectValue placeholder="Filter kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">-Tidak ada filter-</SelectItem>
                                {(dataKategori?.categories ?? []).map(
                                    (kat: z.infer<typeof categorySchema>) => (
                                        <SelectItem key={kat.id} value={kat.nama}>
                                            {kat.nama}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                        <Select
                            value={
                                (table.getColumn("statusStok")?.getFilterValue() as string) ??
                                ""
                            }
                            onValueChange={(event) => {
                                if (!event || event == "all") {
                                    table.getColumn("statusStok")?.setFilterValue(undefined);
                                } else {
                                    table.getColumn("statusStok")?.setFilterValue(event);
                                }
                            }
                            }
                        >
                            <SelectTrigger className="max-w-xs">
                                <SelectValue placeholder="Filter status stok" />
                            </SelectTrigger>
                            <SelectContent>
                                 <SelectItem value="all">- Tidak ada filter -</SelectItem>
                                <SelectItem value="aman">Aman</SelectItem>
                                <SelectItem value="restok">Perlu Restock</SelectItem>
                                <SelectItem value="habis">Habis</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button className="cursor-pointer" onClick={onCreate}>
                        Buat Barang
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
                            ? `${table.getState().pagination.pageIndex *
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
