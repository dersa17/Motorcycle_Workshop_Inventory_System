"use client"
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { itemRequestSchema, itemResponseSchema } from "@/schemas/item-schema"
import { CardContent, Card } from "../ui/card"
import { toast } from "sonner"
import { LoaderCircle } from "lucide-react"
import { useUpdateItem } from "@/hooks/use-item"
import { useActiveCategory } from "@/hooks/use-category";
import { categorySchema } from "@/schemas/category-schema";

export function UpdateItemForm({ item, onSuccess, onCancel }: { item: z.infer<typeof itemResponseSchema>, onSuccess: () => void, onCancel: () => void }) {
  const form = useForm<z.infer<typeof itemRequestSchema>>({
    resolver: zodResolver(itemRequestSchema),
    defaultValues: {
      nama: item.nama,
      kategoriID: item.kategori.id,
      harga: item.harga,
      stokMinimum: item.stokMinimum,
      gambar: undefined,
    },
  })

  const updateMutation = useUpdateItem()
  const {data: dataKategori} = useActiveCategory()

  const onSubmit = (data: z.infer<typeof itemRequestSchema>) => {
    const formData = new FormData();
    formData.append("nama", data.nama);
    formData.append("kategoriID", data.kategoriID);
    formData.append("harga", data.harga.toString());
    formData.append("stokMinimum", data.stokMinimum.toString());
    if (data.gambar) formData.append("gambar", data.gambar);
    

    updateMutation.mutate({id: item.id, data: formData}, {
      onSuccess: (res) => {
        onSuccess()
        toast.success(res.message)
      },
     onError: (err: unknown) => {
             const error = err as AxiosError<{ error: string }>;
             const msg = error.response?.data;
             if (msg?.error) toast.error(msg.error);
      },
    })
  }

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
                    <Input type="number" placeholder="Masukkan Harga" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
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
                          (kategori: z.infer<typeof categorySchema >) => (
                            <SelectItem key={kategori.id} value={kategori.id as string}>
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
              name="stokMinimum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Minimum</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Masukkan Stok Minimum" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
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
                    <Input type="file" placeholder="Masukkan Gambar" onChange={(e) => field.onChange(e.target.files?.[0])}  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3">
              {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}

              <Button type="submit" className="cursor-pointer">
                {updateMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    Memperbarui...
                  </span>
                ) : (
                  "Perbarui"
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
  )
}