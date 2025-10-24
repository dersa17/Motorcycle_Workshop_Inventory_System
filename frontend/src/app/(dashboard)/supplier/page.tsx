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
import { DataTableSupplier } from "@/components/supplier/supplier-data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CreateSupplierForm } from "@/components/supplier/create-supplier-form";
import { UpdateSupplierForm } from "@/components/supplier/update-supplier-form";
import { z } from "zod";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { supplierSchema } from "@/schemas/supplier-schema";
import { useDeleteSupplier } from "@/hooks/use-supplier";

const Page = () => {
  const [activeTab, setActiveTab] = useState<"data" | "create" | "edit">("data");
  const [selectedSupplier, setSelectedSupplier] = useState<z.infer<typeof supplierSchema> | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteMutation = useDeleteSupplier()  



  const handleEdit = (supplier: z.infer<typeof supplierSchema>) => {
    setSelectedSupplier(supplier);
    setActiveTab("edit");
  }

  const handleDelete = (supplier: z.infer<typeof supplierSchema>) => {
    setSelectedSupplier(supplier);
    setDeleteDialogOpen(true);
  }

  return (
    <>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gradient">
            {activeTab === "data"
              ? "Supplier"
              : activeTab === "create"
                ? "Buat Supplier"
                : "Edit Supplier"}
          </h1>
          <p className="text-muted-foreground">
            Kelola supplier suku cadang motor Anda
          </p>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "data" | "create" | "edit")
          }
        >
          <TabsContent value="data">
            <DataTableSupplier
              onCreate={() => setActiveTab("create")}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TabsContent>
          <TabsContent value="create">
            <CreateSupplierForm onCancel={() => setActiveTab("data")} />
          </TabsContent>
          <TabsContent value="edit">
            {selectedSupplier && (
              <UpdateSupplierForm onCancel={() => setActiveTab("data")}
                supplier={selectedSupplier}
                onSuccess={() => { setActiveTab("data"); setSelectedSupplier(null); }}
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
                if (selectedSupplier?.id) {
                  console.log("Deleting supplier", selectedSupplier);
                   deleteMutation.mutate(selectedSupplier.id, {
                      onSuccess: (res) => {
                        toast.success(res.message)
                        setDeleteDialogOpen(false);
                        setSelectedSupplier(null)
                        }
                      })
                  }
              }}>
                 {deleteMutation.isPending ? (
                  <span className="flex justify-center items-center gap-2">
                     <LoaderCircle className="h-4 w-4 animate-spin"/>
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
