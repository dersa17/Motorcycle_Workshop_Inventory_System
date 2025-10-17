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
import { categorySchema } from "@/schemas/category-schema"
import { CardContent, Card } from "../ui/card"

export function UpdateCategoryForm({category, onSuccess, onCancel}: {category: z.infer<typeof categorySchema>, onSuccess: () => void, onCancel: () => void}) {
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      nama: category.nama,
    },
  })

  const onSubmit = (data: z.infer<typeof categorySchema>) => {
    console.log(data)
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
        <div className="flex gap-3">
        <Button type="submit" className="cursor-pointer">Perbarui</Button>
        <Button type="button" onClick={onCancel} variant={"secondary"} className="cursor-pointer">Batal</Button>

        </div>
      </form>
    </Form>
        </CardContent>
    </Card>


  )
}