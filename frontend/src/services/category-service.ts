import axios from "@/lib/axios"
import { categorySchema } from "@/schemas/category-schema";
import { z } from "zod";

export const getAllCategory = async () => {
  const res = await axios.get("/categories");
  return res.data.data;
};

export const getActiveCategory = async () => {
  const res = await axios.get("/categories/active");
  return res.data.data;
};

export const createCategory = async (data: z.infer<typeof categorySchema>) => {
    const res = await axios.post("/categories", data )
    return res.data
}

export const updateCategory = async (data: z.infer<typeof categorySchema>) => {
  const res = await axios.put(`/categories/${data.id}`, data);
  return res.data;
};

export const deleteCategory = async (id: string) => {
    const res = await axios.delete(`/categories/${id}`)
    return res.data
}

export const restoreCategory = async (id: string) => {
    const res = await axios.put(`/categories/restore/${id}`)
    return res.data
}
