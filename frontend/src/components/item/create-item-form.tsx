"use client";
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { itemRequestSchema } from "@/schemas/item-schema";
import { CardContent, Card } from "../ui/card";
import { toast } from "sonner";
import { useCreateItem } from "@/hooks/use-item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActiveCategory } from "@/hooks/use-category";
import { categorySchema } from "@/schemas/category-schema";

export function CreateItemForm({ onCancel }: { onCancel: () => void }) {
  const { data: dataKategori } = useActiveCategory();
  const createMutation = useCreateItem();
  const form = useForm<z.infer<typeof itemRequestSchema>>({
    resolver: zodResolver(itemRequestSchema),
    defaultValues: {
      nama: "",
      kategoriID: "",
      harga: 0,
      stokInitial: 0,
      stokMinimum: 0,
      gambar: undefined,
    },
  });

  const onSubmit = (data: z.infer<typeof itemRequestSchema>) => {
    console.log(data);
    const formData = new FormData();
    formData.append("nama", data.nama);
    formData.append("kategoriID", data.kategoriID);
    formData.append("harga", data.harga.toString());
    formData.append("stokInitial", data.stokInitial!.toString());
    formData.append("stokMinimum", data.stokMinimum.toString());
    if (data.gambar) formData.append("gambar", data.gambar);
    createMutation.mutate(formData, {
      onSuccess: (res) => {
        onCancel();
        toast.success(res.message);
      },
      onError: (err: unknown) => {
        const error = err as AxiosError<{ error: string }>;
        const msg = error.response?.data;
        if (msg?.error) toast.error(msg.error);
      },
    });
  };

  return (
    <Card className="shadow-md">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Barang</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama barang" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="harga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan Harga"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kategoriID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {(dataKategori?.categories ?? []).map(
                          (kategori: z.infer<typeof categorySchema>) => (
                            <SelectItem
                              key={kategori.id}
                              value={kategori.id as string}
                            >
                              {kategori.nama}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stokInitial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Awal</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan Stok Awal"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stokMinimum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Minimum</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan Stok Minimum"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gambar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gambar</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      placeholder="Masukkan Gambar"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3">
              {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}

              <Button type="submit" className="cursor-pointer">
                {createMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    Membuat...
                  </span>
                ) : (
                  "Buat"
                )}
              </Button>
              <Button
                type="button"
                variant={"secondary"}
                onClick={onCancel}
                className="cursor-pointer"
              >
                Batal
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
