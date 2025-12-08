"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CreateItemForm } from "@/components/item/create-item-form";
import { UpdateItemForm } from "@/components/item/update-item-form"
import { z } from "zod";
import { itemResponseSchema } from "@/schemas/item-schema";
import { useDeleteItem } from "@/hooks/use-item";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { DataTableItem } from "@/components/item/item-data-table";
import { AxiosError } from "axios";

const Page = () => {
  const [activeTab, setActiveTab] = useState<"data" | "create" | "edit">("data");
  const [selectedItem, setSelectedItem] = useState<z.infer<typeof itemResponseSchema> | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteMutation = useDeleteItem()



  const handleEdit = (item: z.infer<typeof itemResponseSchema>) => {
    setSelectedItem(item);
    setActiveTab("edit");
  }

  const handleDelete = (item: z.infer<typeof itemResponseSchema>) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  }

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gradient">
          {activeTab === "data"
            ? "Barang"
            : activeTab === "create"
              ? "Buat Barang"
              : "Edit Barang"}
        </h1>
        <p className="text-muted-foreground">
          Kelola suku cadang anda
        </p>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "data" | "create" | "edit")
        }
      >
        <TabsContent value="data">
          <DataTableItem
            onCreate={() => setActiveTab("create")}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
        <TabsContent value="create">
          <CreateItemForm onCancel={() => setActiveTab("data")} />
        </TabsContent>
        <TabsContent value="edit">
          {selectedItem && (
            <UpdateItemForm onCancel={() => setActiveTab("data")}
              item={selectedItem}
              onSuccess={() => { setActiveTab("data"); setSelectedItem(null); }}
            />
          )}

        </TabsContent>
      </Tabs>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="cursor-pointer" onClick={(e) => {
              e.preventDefault()
              if (selectedItem?.id) {
                console.log("Deleting item", selectedItem);
                deleteMutation.mutate(selectedItem.id, {
                  onSuccess: (res) => {
                    toast.success(res.message)
                    setDeleteDialogOpen(false);
                    setSelectedItem(null)
                  },
                  onError: (err: unknown) => {
                               const error = err as AxiosError<{ error: string }>;
                               const msg = error.response?.data;
                               if (msg?.error) toast.error(msg.error);
                  },

                })
              }
            }}>
              {deleteMutation.isPending ? (
                <span className="flex justify-center items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Menghapus...
                </span>
              ) : ("Hapus")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Page;
