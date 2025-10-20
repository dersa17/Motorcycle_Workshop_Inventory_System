import { z } from "zod";

export const supplierSchema = z.object({
  id: z.string().optional(),
  nama: z
    .string()
    .min(1, "Nama supplier wajib diisi")
    .max(100, "Nama supplier maksimal 100 karakter"),
  alamat: z
    .string()
    .min(1, "Alamat wajib diisi")
    .max(255, "alamat maksimal 255 katakter"),
  kontak: z
    .string()
    .nonempty("Kontak wajib diisi")
    .min(7, "Minimal 7 karakter")
    .max(15, "Maksimal 15 karakter")
    .regex(/^\+?\d+$/, "Hanya boleh angka dan optional + di depan"),
});
