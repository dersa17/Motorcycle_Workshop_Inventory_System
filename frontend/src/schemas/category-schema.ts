import {z} from "zod";

export const categorySchema = z.object({
    id: z.string().optional(),
    nama: z.string().min(1, "Nama kategori wajib diisi").max(100, "Nama kategori maksimal 100 karakter"),
    deletedAt: z.string().nullable().optional(),
});