"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { supplierSchema } from "@/schemas/supplier-schema"
import { CardContent, Card } from "../ui/card"
import { useUpdateCategory } from "@/hooks/use-category"
import { toast } from "sonner"
import { LoaderCircle } from "lucide-react"


export function UpdateSupplierForm({ supplier, onSuccess, onCancel }: { supplier: z.infer<typeof supplierSchema>, onSuccess: () => void, onCancel: () => void }) {
  const form = useForm<z.infer<typeof supplierSchema>>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      nama: supplier.nama,
      alamat: supplier.alamat,
      kontak: supplier.kontak
    },
  })

  const updateMutation = useUpdateCategory()

  const onSubmit = (data: z.infer<typeof supplierSchema>) => {
    const payload = {
      id: supplier.id,
      ...data
    }
   console.log(payload)

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
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama kategori" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                  <FormField
              control={form.control}
              name="alamat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan alamat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kontak"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kontak</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan kontak" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3">
              <Button type="submit" className="cursor-pointer">
                {updateMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                     <LoaderCircle className="w-4 h-4 animate-spin"/>
                      Memperbarui...
                  </span>
                ) : ("Perbarui")}
                
                </Button>
              <Button type="button" onClick={onCancel} variant={"secondary"} className="cursor-pointer">Batal</Button>

            </div>
          </form>
        </Form>
      </CardContent>
    </Card>


  )
}