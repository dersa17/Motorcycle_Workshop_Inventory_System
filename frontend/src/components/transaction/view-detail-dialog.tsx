import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { z } from "zod";

import { transactionResponseSchema } from "@/schemas/transaction-schema";
import { formatRupiah } from "@/utils/formatRupiah";
export const ViewDetailTransactionDialog = ({ isDetailOpen, setIsDetailOpen, selectedTransaction }: {
    isDetailOpen: boolean;
    setIsDetailOpen: (open: boolean) => void;
    selectedTransaction: z.infer<typeof transactionResponseSchema> | undefined;
}) => {
  return (
    <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            Detail Transaksi - {selectedTransaction?.id}
          </DialogTitle>
          <DialogDescription>
            Transaksi {
                " "
            }
            {selectedTransaction?.jenis == "pembelian" ? "Pembelian" : "Penjualan"}{" "}
           
  {selectedTransaction?.tanggal
    ? new Date(selectedTransaction.tanggal).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
minute: "2-digit"

      })
    : "-"}


          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Jenis:</p>
              <p>{selectedTransaction?.jenis}</p>
            </div>
            <div>
               {selectedTransaction?.jenis === "pembelian" && (
                <>
                <p className="font-semibold">Supplier:</p>
              <p>{selectedTransaction.supplier?.nama || "Walk-in Customer"}</p>
               </>
               )   }
              
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead className="text-center">Jumlah</TableHead>
                  <TableHead className="text-right">Harga</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedTransaction?.detailTransaksi.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.barang.nama}</TableCell>
                    <TableCell className="text-center">
                      {item.jumlah}
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
                    {formatRupiah(selectedTransaction?.total || 0)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
