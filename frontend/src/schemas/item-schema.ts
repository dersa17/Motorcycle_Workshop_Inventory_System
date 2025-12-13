import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/avif",
    "image/heic"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const itemRequestSchema = z.object({
    id: z.string().optional(),
    kategoriID: z.string().nonempty("Kategori wajib dipilih"),
    nama: z.string().min(1, "Nama wajib diisi"),
    harga: z.number().gt(0, "Harga harus lebih besar dari 0"),
    stokInitial: z.number().gte(0, "StokInitial harus lebih besar atau sama dengan 0").optional(),
    stokMinimum: z.number().gte(0, "StokMinimum harus lebih besar atau sama dengan 0"),
    gambar:
        z.instanceof(File).refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: "Hanya mendukung format .jpg, .png, .webp, .avif, dan .heic",
        })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
                message: "Ukuran file tidak boleh lebih dari 2MB",
        }).optional(),
});

export const itemResponseSchema = z.object({
    id: z.string(),
    kategori: z.object({
        id: z.string(),
        nama: z.string(),
    }),
    nama: z.string().min(1, "Nama wajib diisi"),
    harga: z.number().gt(0, "Harga harus lebih besar dari 0"),
    stok: z.number().gte(0, "Stok harus lebih besar atau sama dengan 0"),
    stokInitial: z.number().gte(0, "StokInitial harus lebih besar atau sama dengan 0"),
    stokMinimum: z.number().gte(0, "StokMinimum harus lebih besar atau sama dengan 0"),
    gambar: z.string().optional()
});
