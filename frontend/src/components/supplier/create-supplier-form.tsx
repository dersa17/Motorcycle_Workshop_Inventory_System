"use client";

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
import { supplierSchema } from "@/schemas/supplier-schema";
import { CardContent, Card } from "../ui/card";
import { useCreateCategory } from "@/hooks/use-category";
import { toast } from "sonner";

export function CreateSupplierForm({ onCancel }: { onCancel: () => void }) {
  const createMutation = useCreateCategory();
  const form = useForm<z.infer<typeof supplierSchema>>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      nama: "",
      alamat: "",
      kontak: "",
    },
  });

  const onSubmit = (data: z.infer<typeof supplierSchema>) => {
    console.log(data);
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
                  <FormLabel>Nama Supplier</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama supplier" {...field} />
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
