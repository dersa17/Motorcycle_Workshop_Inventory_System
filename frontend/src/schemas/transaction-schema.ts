import { z } from "zod";
import { itemResponseSchema } from "./item-schema";
import { supplierSchema } from "./supplier-schema";

export const detailTransactionRequestSchema = z.object({
  barangID: z.string(),       
  jumlah: z.number().int(),
  hargaSatuan: z.number()
});
export const detailTransactionResponseSchema = z.object({
  id: z.string(),  
  barang: itemResponseSchema,       
  jumlah: z.number().int(),
  hargaSatuan: z.number(),
  subtotal: z.number()
});

export const transactionRequestSchema = z.object({
  supplierID: z.string().uuid("SupplierID harus berupa UUID").optional(),
  jenis: z.enum(["pembelian", "penjualan"], {
    message: "Jenis harus pembelian atau penjualan",
  }),
  tanggal: z.string().optional(),
  detailTransaksi: z
    .array(detailTransactionRequestSchema)
    .min(1, "Detail transaksi tidak boleh kosong"),
});


export const transactionRequestUpdateSchema = z.object({
  id : z.string().uuid(),
  supplierID: z.string().uuid("SupplierID harus berupa UUID").optional(),
  jenis: z.enum(["pembelian", "penjualan"], {
    message: "Jenis harus pembelian atau penjualan",
  }),
  tanggal: z.string().optional(),
  detailTransaksi: z
    .array(detailTransactionRequestSchema)
    .min(1, "Detail transaksi tidak boleh kosong"),
});


export const transactionResponseSchema = z.object({
  id : z.string().uuid(),
  supplier: supplierSchema,
  jenis: z.enum(["pembelian", "penjualan"], {
    message: "Jenis harus pembelian atau penjualan",
  }),
  tanggal: z.string(),
  total: z.number(),
  detailTransaksi: z
    .array(detailTransactionResponseSchema)
    .min(1, "Detail transaksi tidak boleh kosong"),
});

