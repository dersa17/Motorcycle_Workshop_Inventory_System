"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import Image from "next/image";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  Plus,
  Minus,
  Package,
  Trash2,
  CalendarIcon,
  Search,
  LoaderCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useItem } from "@/hooks/use-item";
import { Input } from "@/components/ui/input";
import { itemResponseSchema } from "@/schemas/item-schema";
import { formatRupiah } from "@/utils/formatRupiah";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { detailTransactionSchema } from "@/schemas/transaction-schema";
import { useCreateTransaction } from "@/hooks/use-transactions";

const Page = () => {
  const createMutation = useCreateTransaction();
  const { data: dataItem, isPending: isItemPending } = useItem();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [purchaseList, setPurchaseList] = useState<
    z.infer<typeof detailTransactionSchema>[]
  >([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredItems =
    dataItem?.items?.filter((item: z.infer<typeof itemResponseSchema>) =>
      (item.nama ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];

  const handleQuantityChange = (itemId: string, value: string) => {
    const quantity = parseInt(value) || 0;
    setQuantities({ ...quantities, [itemId]: quantity });
  };

  const addToPurchase = (item: z.infer<typeof itemResponseSchema>) => {
    const quantity = quantities[item.id] || 1;

    if (quantity <= 0) {
      toast.error("Kuantitas harus lebih dari 0");
      return;
    }

    const existingItem = purchaseList.find(
      (purchaseItem) => purchaseItem.barangId === item.id
    );
    
    if (!existingItem && quantity > item.stok) {
      toast.error(
        `Stok tidak mencukupi. Stok tersedia: ${item.stok}, Jumlah yang diminta: ${quantity}`
      );
      return;
    }

    if (existingItem && existingItem.jumlah + quantity > item.stok) {
      toast.error(
        `Stok tidak mencukupi. Stok tersedia: ${
          item.stok
        }, Jumlah yang diminta: ${existingItem.jumlah + quantity}`
      );
      return;
    }

    if (existingItem) {
      setPurchaseList(
        purchaseList.map((purchaseItem) =>
          purchaseItem.barangId === item.id
            ? {
                ...purchaseItem,
                jumlah: purchaseItem.jumlah + quantity,
                subtotal:
                  (purchaseItem.jumlah + quantity) * purchaseItem.hargaSatuan,
              }
            : purchaseItem
        )
      );
    } else {
      setPurchaseList([
        ...purchaseList,
        {
          barangId: item.id,
          jumlah: quantity,
          hargaSatuan: item.harga,
        },
      ]);
    }

    setQuantities({ ...quantities, [item.id]: 1 });

    toast.success(`${item.nama} ditambahkan ke daftar penjualan`);
  };

  const removeFromPurchase = (itemId: string) => {
    setPurchaseList(purchaseList.filter((item) => item.barangId !== itemId));
  };

  const calculateTotal = () => {
    return purchaseList.reduce(
      (total, item) => total + item.jumlah * item.hargaSatuan,
      0
    );
  };

  const handleSavePurchase = () => {
    if (purchaseList.length === 0) {
      toast.error("Daftar penjualan kosong");
      return;
    }
    createMutation.mutate(
      {
        jenis: "penjualan",
        tanggal: date ? date.toISOString() : "",
        detailTransaksi: purchaseList,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message);
          setPurchaseList([]);
          setQuantities({});
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };

          console.error(error);
          console.log(error?.response?.data);

          toast.error(
            error?.response?.data?.message ||
              "Terjadi kesalahan saat menyimpan penjualan"
          );
        },
      }
    );
  };

  const handleClearAll = () => {
    setPurchaseList([]);
    setQuantities({});
    toast.success("Daftar penjualan berhasil dikosongkan");
  };

  const findItem = (id: string) =>
    dataItem?.items?.find(
      (i: z.infer<typeof itemResponseSchema>) => i.id === id
    );

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gradient">Penjualan</h1>
        <p className="text-muted-foreground">
          Tambahkan item ke pesanan penjualan dan selesaikan transaksi
        </p>
      </div>
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Tanggal (Opsional):</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[240px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Section - Available Items */}

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Item Tersedia</h2>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {isItemPending ? (
            <span className="flex justify-center items-center gap-2">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Loading...
            </span>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gambar</TableHead>
                    <TableHead>Nama Item</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(filteredItems ?? []).map(
                    (item: z.infer<typeof itemResponseSchema>) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/${item.gambar}`}
                            alt={item.nama}
                            width={50}
                            height={50}
                          />
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate whitespace-nowrap">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>{item.nama}</span>
                              </TooltipTrigger>
                              <TooltipContent>{item.nama}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>{formatRupiah(item.harga)}</TableCell>
                        <TableCell>{item.stok}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={quantities[item.id] || 1}
                            onChange={(e) =>
                              handleQuantityChange(item.id, e.target.value)
                            }
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => addToPurchase(item)}
                            className="gap-1"
                          >
                            <Plus className="h-4 w-4" />
                            Add
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </Card>

        {/* Right Section - Purchase List */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Daftar penjualan</h2>

          {purchaseList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Package className="h-16 w-16 mb-4 opacity-20" />
              <p>Tidak ada item dalam daftar penjualan</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gambar</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseList.map((p) => {
                    const item = findItem(p.barangId);

                    return (
                      <TableRow key={p.barangId}>
                        <TableCell>
                          {item && (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_API_URL}/${item.gambar}`}
                              alt={item.nama}
                              width={50}
                              height={50}
                            />
                          )}
                        </TableCell>

                        <TableCell className="max-w-[150px] truncate whitespace-nowrap">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>{item?.nama}</span>
                              </TooltipTrigger>
                              <TooltipContent>{item?.nama}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>

                        <TableCell>{p.jumlah}</TableCell>
                        <TableCell>{formatRupiah(p.hargaSatuan)}</TableCell>

                        <TableCell className="font-semibold">
                          {formatRupiah(p.jumlah * p.hargaSatuan)}
                        </TableCell>

                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromPurchase(p.barangId)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center text-2xl font-bold border-t pt-4">
                  <span>Total:</span>
                  <span>{formatRupiah(calculateTotal())}</span>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSavePurchase}
                    className="flex-1"
                    size="lg"
                  >
                    {createMutation.isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                        Menyimpan...
                      </span>
                    ) : (
                      "Simpan penjualan"
                    )}
                  </Button>
                  <Button
                    onClick={handleClearAll}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
};

export default Page;
