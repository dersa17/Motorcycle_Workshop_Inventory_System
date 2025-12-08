"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { z } from "zod";
import { DataTableTransaction } from "@/components/transaction/transaction-data-table";
import { ViewDetailTransactionDialog } from "@/components/transaction/view-detail-dialog";
import { transactionResponseSchema } from "@/schemas/transaction-schema";
import { UpdateTransactionDialog } from "@/components/transaction/update-dialog";
import { useUpdateTransaction } from "@/hooks/use-transactions";
import { toast } from "sonner";

const Page = () => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<
    z.infer<typeof transactionResponseSchema> | undefined
  >(undefined);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<
    z.infer<typeof transactionResponseSchema> | undefined
  >(undefined);
  const updateMutation = useUpdateTransaction();

  const onViewDetail = (
    transaction: z.infer<typeof transactionResponseSchema>
  ) => {
    setSelectedTransaction(transaction);
    setIsDetailOpen(true);
  };

  const onEdit = (transaction: z.infer<typeof transactionResponseSchema>) => {
    setEditingTransaction(transaction);
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingTransaction) {
    updateMutation.mutate({
    id: editingTransaction.id,
    supplierID: editingTransaction.supplier.id,
    jenis: editingTransaction.jenis,
    tanggal: editingTransaction.tanggal,
    detailTransaksi: editingTransaction.detailTransaksi.map(item => ({
    barangID: item.barang.id, 
    jumlah: item.jumlah,
    hargaSatuan: item.hargaSatuan
  })),
    }, {
        onSuccess: (res) => {
          toast.success(res.message);
          setIsEditOpen(false);
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };

          console.error(error);
          console.log(error?.response?.data);

          toast.error(
            error?.response?.data?.message ||
              "Terjadi kesalahan saat menyimpan pembelian"
          );
        },
      });
    }
  };

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gradient">Riwayat Transaksi</h1>
        <p className="text-muted-foreground">
          Melihat dan mencari transaksi penjualan dan pembelian sebelumnya
        </p>

        <Card className="p-6">
          <DataTableTransaction onViewDetail={onViewDetail} onEdit={onEdit} />
        </Card>
        <ViewDetailTransactionDialog
          isDetailOpen={isDetailOpen}
          setIsDetailOpen={setIsDetailOpen}
          selectedTransaction={selectedTransaction}
        />
        <UpdateTransactionDialog
          isEditOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
          editingTransaction={editingTransaction}
          setEditingTransaction={setEditingTransaction}
          handleSaveEdit={handleSaveEdit}
          isSaving={updateMutation.isPending}
        />
      </div>
    </>
  );
};

export default Page;
