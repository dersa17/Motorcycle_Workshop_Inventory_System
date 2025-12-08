import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { transactionResponseSchema } from "@/schemas/transaction-schema";
import { formatRupiah } from "@/utils/formatRupiah";
import { useItem } from "@/hooks/use-item";
import { itemResponseSchema } from "@/schemas/item-schema";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";


export const UpdateTransactionDialog = ({
  isEditOpen,
  setIsEditOpen,
  editingTransaction,
  setEditingTransaction,
  handleSaveEdit,
  isSaving,
}: {
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  editingTransaction: z.infer<typeof transactionResponseSchema> | undefined;
  setEditingTransaction: (
    transaction: z.infer<typeof transactionResponseSchema> | undefined
  ) => void;
  handleSaveEdit: () => void;
  isSaving: boolean;
}) => {

  const {data: dataItem} = useItem();  
const handleUpdateItem = (itemId: string, value: number) => {
  if (!editingTransaction) return;

const itemStock = dataItem?.items?.find((i: z.infer<typeof itemResponseSchema>) => i.id === itemId)?.stok ?? 0;


  if (editingTransaction.jenis === "penjualan" && value > itemStock) {
    toast.error(`Jumlah melebihi stok! Maksimum: ${itemStock}`);
    value = itemStock; 
  }

  const updatedItems = editingTransaction.detailTransaksi.map((item) =>
    item.barang.id === itemId ? { ...item, jumlah: value } : item
  );
  const newTotal = updatedItems.reduce(
    (sum, item) => sum + item.jumlah * item.hargaSatuan,
    0
  );

  setEditingTransaction({
    ...editingTransaction,
    detailTransaksi: updatedItems,
    total: newTotal,
  });
};

  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Update Transaksi - {editingTransaction?.id}</DialogTitle>
          <DialogDescription>
            Sesuaikan jumlah dan harga barang untuk transaksi ini
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {editingTransaction?.detailTransaksi.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.barang.nama}</TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        value={item.jumlah}
                        onChange={(e) =>
                          handleUpdateItem( item.barang.id, Number(e.target.value))
                        }
                        className="w-20 text-center"
                        min="0"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {formatRupiah(item.hargaSatuan)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatRupiah(item.subtotal)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-semibold">
                    Total:
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatRupiah(editingTransaction?.total || 0)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveEdit}>

               {isSaving? (
                  <span className="flex items-center justify-center gap-2">
                     <LoaderCircle className="w-4 h-4 animate-spin"/>
                      Menyimpan...
                  </span>
                ) : ("Simpan Perubahan")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
