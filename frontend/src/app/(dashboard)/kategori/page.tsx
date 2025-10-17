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
import { DataTableKategori } from "@/components/category/category-data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CreateCategoryForm } from "@/components/category/create-category-form";
import { UpdateCategoryForm } from "@/components/category/update-category-form";
import { z } from "zod";
import { categorySchema } from "@/schemas/category-schema";

const Page = () => {
  const [activeTab, setActiveTab] = useState<"data" | "create" | "edit">("data");
  const [selectedCategory, setSelectedCategory] = useState<z.infer<typeof categorySchema> | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  

  const handleEdit = (category: z.infer<typeof categorySchema>) => {
    setSelectedCategory(category);
    setActiveTab("edit");
  }

  const handleDelete = (category: z.infer<typeof categorySchema>) => {
    console.log("Delete category", category);
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-3 space-y-3">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gradient">
            {activeTab === "data"
              ? "Kategori"
              : activeTab === "create"
                ? "Buat Kategori"
                : "Edit Kategori"}
          </h1>
          <p className="text-muted-foreground">
            Kelola kategori suku cadang motor Anda
          </p>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "data" | "create" | "edit")
          }
        >
          <TabsContent value="data">
            <DataTableKategori
              onCreate={() => setActiveTab("create")}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </TabsContent>
          <TabsContent value="create">
            <CreateCategoryForm onCancel={() => setActiveTab("data")} />
          </TabsContent>
          <TabsContent value="edit">
            {selectedCategory && (
              <UpdateCategoryForm onCancel={() => setActiveTab("data")}
                category={selectedCategory}
                onSuccess={() => { setActiveTab("data"); setSelectedCategory(null); }}
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
              <AlertDialogAction onClick={() => {
                if (selectedCategory) {
                  console.log("Deleting category", selectedCategory);
                  setDeleteDialogOpen(false);
                }
              }}>Hapus</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Page;
